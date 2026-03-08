import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/media/refresh
 *
 * Admin-only endpoint that fetches videos from the Coverr API and caches
 * them in the local MediaTask table. Fetches multiple pages to build a
 * large cache while minimizing API calls.
 *
 * Caching strategy for 1000-call demo limit:
 * - Fetches up to 5 pages × 25 videos = 125 videos = 5 API calls
 * - Upserts into DB (deduplicates by coverrAssetId)
 * - Only callable by admins, manually or via cron
 * - With 125+ cached videos, 100 users × 10 tasks/day are served from cache
 * - At 5 calls per refresh, you get ~200 refreshes before hitting the limit
 */

interface CoverrVideo {
  id: string;
  title: string;
  tags: string[];
  playback_id: string;
  base_filename: string;
  poster?: string;
  thumbnail?: string;
  duration?: string;
}

interface CoverrApiResponse {
  hits?: CoverrVideo[];
  videos?: CoverrVideo[];
  total: number;
  page: number;
  per_page?: number;
  page_size?: number;
}

const COVERR_API_BASE = "https://api.coverr.co/videos";
const PAGES_TO_FETCH = 5;
const PER_PAGE = 25;

/** Construct CDN MP4 URL from base_filename (360p for lighter streaming) */
function cdnMp4Url(baseFilename: string): string {
  return `https://cdn.coverr.co/videos/${baseFilename}/360p.mp4`;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function POST() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.COVERR_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "COVERR_API_KEY not configured" },
      { status: 500 },
    );
  }

  const allVideos: CoverrVideo[] = [];
  let apiCallsUsed = 0;

  // Fetch multiple pages to build a robust cache
  for (let page = 1; page <= PAGES_TO_FETCH; page++) {
    try {
      const res = await fetch(
        `${COVERR_API_BASE}?page=${page}&page_size=${PER_PAGE}&sort_by=popular`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: "application/json",
          },
        },
      );
      apiCallsUsed++;

      if (!res.ok) {
        console.error(`Coverr API page ${page} failed: ${res.status}`);
        break;
      }

      const data = (await res.json()) as CoverrApiResponse;
      const videos = data.hits ?? data.videos ?? [];

      if (!Array.isArray(videos) || videos.length === 0) break;
      allVideos.push(...videos);

      // Stop early if we got fewer than requested (last page)
      if (videos.length < PER_PAGE) break;
    } catch (err) {
      console.error(`Coverr API fetch error page ${page}:`, err);
      break;
    }
  }

  if (allVideos.length === 0) {
    return NextResponse.json(
      { error: "No videos returned from Coverr API", apiCallsUsed },
      { status: 502 },
    );
  }

  // Upsert videos into MediaTask table
  let upsertedCount = 0;
  for (const video of allVideos) {
    if (!video.base_filename) continue;
    const streamUrl = cdnMp4Url(video.base_filename);

    try {
      await prisma.mediaTask.upsert({
        where: { coverrAssetId: video.id },
        update: {
          streamUrl,
          title: video.title || "Untitled",
          category: video.tags?.[0] ?? null,
          thumbnailUrl: video.thumbnail ?? video.poster ?? null,
          isActive: true,
        },
        create: {
          coverrAssetId: video.id,
          mediaType: "video",
          streamUrl,
          thumbnailUrl: video.thumbnail ?? video.poster ?? null,
          title: video.title || "Untitled",
          category: video.tags?.[0] ?? null,
          rewardCoins: randomInt(35, 55),
          isActive: true,
        },
      });
      upsertedCount++;
    } catch (err) {
      console.error(`Failed to upsert video ${video.id}:`, err);
    }
  }

  // Update cache timestamp
  await prisma.globalSettings.updateMany({
    data: { mediaCacheLastRefresh: new Date() },
  });

  return NextResponse.json({
    message: "Media cache refreshed",
    fetched: allVideos.length,
    upserted: upsertedCount,
    apiCallsUsed,
  });
}
