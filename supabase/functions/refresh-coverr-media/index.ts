/**
 * Supabase Edge Function: refresh-coverr-media
 *
 * Runs as a cron job to fetch videos from the Coverr API and upsert
 * them into the `media_tasks` table, acting as a local cache so that
 * the application does not hit Coverr's rate limits on every request.
 *
 * Required environment variables:
 *   COVERR_API_KEY            – your Coverr API key
 *   SUPABASE_URL              – your project URL (auto-injected by Supabase)
 *   SUPABASE_SERVICE_ROLE_KEY – service-role secret (auto-injected by Supabase)
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ---------------------------------------------------------------------------
// TypeScript interfaces for the Coverr API response
// ---------------------------------------------------------------------------

interface CoverrVideoUrls {
  mp4?: string;
  webm?: string;
  hls?: string;
}

interface CoverrVideo {
  id: string;
  title: string;
  tags: string[];
  urls: CoverrVideoUrls;
  cover: string;
}

interface CoverrApiResponse {
  videos: CoverrVideo[];
  total: number;
  page: number;
  size: number;
}

// ---------------------------------------------------------------------------
// Shape that maps to the media_tasks table
// ---------------------------------------------------------------------------

interface MediaTaskUpsert {
  coverr_asset_id: string;
  media_type: string;
  stream_url: string;
  title: string;
  category: string | null;
  reward_coins: number;
  is_active: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns a random integer in the closed interval [min, max]. */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Picks the best available stream URL from a Coverr video object. */
function pickStreamUrl(urls: CoverrVideoUrls): string {
  return urls.mp4 ?? urls.webm ?? urls.hls ?? "";
}

/**
 * Maps a raw CoverrVideo to a MediaTaskUpsert row.
 * Reward coins are randomly assigned between rewardMin and rewardMax
 * (defaults to 5–15, configurable via REWARD_COINS_MIN / REWARD_COINS_MAX).
 */
function mapVideoToMediaTask(
  video: CoverrVideo,
  rewardMin = 5,
  rewardMax = 15,
): MediaTaskUpsert {
  return {
    coverr_asset_id: video.id,
    media_type: "video",
    stream_url: pickStreamUrl(video.urls),
    title: video.title,
    category: video.tags?.[0] ?? null,
    reward_coins: randomInt(rewardMin, rewardMax),
    is_active: true,
  };
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

Deno.serve(async (_req: Request): Promise<Response> => {
  const apiKey = Deno.env.get("COVERR_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const rewardMin = parseInt(Deno.env.get("REWARD_COINS_MIN") ?? "5", 10);
  const rewardMax = parseInt(Deno.env.get("REWARD_COINS_MAX") ?? "15", 10);

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "COVERR_API_KEY environment variable is not set" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(
      JSON.stringify({ error: "Supabase environment variables are not set" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  // Initialise Supabase client with the service-role key so RLS does not block
  // the upsert.
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // ---------------------------------------------------------------------------
  // 1. Fetch videos from the Coverr API
  // ---------------------------------------------------------------------------

  let coverrData: CoverrApiResponse;

  try {
    const coverrRes = await fetch("https://api.coverr.co/videos?page_size=30", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!coverrRes.ok) {
      const body = await coverrRes.text();
      return new Response(
        JSON.stringify({
          error: "Coverr API request failed",
          status: coverrRes.status,
          body,
        }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    }

    coverrData = (await coverrRes.json()) as CoverrApiResponse;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch from Coverr API", details: message }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!Array.isArray(coverrData.videos) || coverrData.videos.length === 0) {
    return new Response(
      JSON.stringify({ message: "No videos returned from Coverr API", data: coverrData }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  // ---------------------------------------------------------------------------
  // 2. Map videos to media_tasks rows
  // ---------------------------------------------------------------------------

  const rows: MediaTaskUpsert[] = coverrData.videos
    .filter((v) => pickStreamUrl(v.urls) !== "") // skip entries with no usable URL
    .map((v) => mapVideoToMediaTask(v, rewardMin, rewardMax));

  if (rows.length === 0) {
    return new Response(
      JSON.stringify({ message: "No valid stream URLs found in Coverr response" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  // ---------------------------------------------------------------------------
  // 3. Upsert into media_tasks
  // ---------------------------------------------------------------------------

  const { data, error } = await supabase
    .from("media_tasks")
    .upsert(rows, { onConflict: "coverr_asset_id" })
    .select("id, coverr_asset_id, title");

  if (error) {
    return new Response(
      JSON.stringify({ error: "Database upsert failed", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify({
      message: "media_tasks refreshed successfully",
      upserted: data?.length ?? rows.length,
      rows: data,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
});
