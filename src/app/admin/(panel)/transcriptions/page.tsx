import { getAdminSubmissions, getTranscriptionStats, getMediaCacheInfo } from "@/actions/transcription";
import { TranscriptionReviewPanel } from "@/components/admin/transcription-review-panel";
import { MediaCacheRefresh } from "@/components/admin/media-cache-refresh";
import { FileText, Hourglass, ThumbsUp, ThumbsDown } from "lucide-react";

export default async function AdminTranscriptionsPage() {
  const [txStats, recentSubmissions, mediaCacheInfo] = await Promise.all([
    getTranscriptionStats().catch(() => ({ total: 0, pending: 0, approved: 0, rejected: 0 })),
    getAdminSubmissions().catch(() => []),
    getMediaCacheInfo().catch(() => ({ cachedVideos: 0, lastRefresh: null })),
  ]);
  const lastRefreshValue = mediaCacheInfo.lastRefresh
    ? mediaCacheInfo.lastRefresh instanceof Date
      ? mediaCacheInfo.lastRefresh.toISOString()
      : mediaCacheInfo.lastRefresh
    : null;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-white/30 mb-1">
          <span>Admin</span>
          <span className="text-white/10">/</span>
          <span className="text-white/60">Transcriptions</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">Transcription Management</h1>
        <p className="text-sm text-white/40 mt-0.5">Review and manage user submissions</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total",
            value: txStats.total,
            icon: FileText,
            iconClass: "bg-violet-500/15 text-violet-400",
          },
          {
            label: "Pending",
            value: txStats.pending,
            icon: Hourglass,
            iconClass: "bg-amber-500/15 text-amber-400",
          },
          {
            label: "Approved",
            value: txStats.approved,
            icon: ThumbsUp,
            iconClass: "bg-emerald-500/15 text-emerald-400",
          },
          {
            label: "Rejected",
            value: txStats.rejected,
            icon: ThumbsDown,
            iconClass: "bg-red-500/15 text-red-400",
          },
        ].map(({ label, value, icon: Icon, iconClass }) => (
          <div key={label} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/30">{label}</p>
                <p className="mt-2 text-3xl font-bold text-white">{value.toLocaleString()}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Media Cache */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <MediaCacheRefresh
          cachedVideos={mediaCacheInfo.cachedVideos}
          lastRefresh={lastRefreshValue}
        />
      </div>

      {/* Review Queue */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-white/80">Submission Review Queue</h3>
          <p className="text-xs text-white/30 mt-0.5">
            Review transcriptions and approve or reject. Approving releases the coin reward.
          </p>
        </div>
        <TranscriptionReviewPanel
          submissions={recentSubmissions.map((s) => ({
            ...s,
            createdAt: s.createdAt.toISOString(),
            reviewedAt: s.reviewedAt?.toISOString() ?? null,
          }))}
        />
      </div>
    </div>
  );
}
