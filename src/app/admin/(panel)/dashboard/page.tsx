import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminDashboardMetrics } from "@/actions/admin";
import { getTranscriptionStats, getMediaCacheInfo } from "@/actions/transcription";
import { formatDate } from "@/lib/utils";
import {
  Users,
  UserCheck,
  DollarSign,
  ArrowDownCircle,
  TrendingUp,
  CheckCircle2,
  Clock,
  FileText,
  Hourglass,
  ThumbsUp,
  ThumbsDown,
  Activity,
  Wallet,
} from "lucide-react";
import { AdminRegistrationChart, MetricRing, RevenueChart, ActivityBreakdown } from "@/components/admin/admin-charts";

function TransactionTypeBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; bg: string; text: string }> = {
    ACTIVATION: { label: "Activation", bg: "bg-violet-500/10", text: "text-violet-400" },
    REFERRAL_BONUS: { label: "Referral", bg: "bg-emerald-500/10", text: "text-emerald-400" },
    WITHDRAWAL: { label: "Withdrawal", bg: "bg-amber-500/10", text: "text-amber-400" },
    DEPOSIT: { label: "Deposit", bg: "bg-sky-500/10", text: "text-sky-400" },
  };
  const { label, bg, text } = map[type] ?? { label: type, bg: "bg-white/5", text: "text-white/50" };
  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold ${bg} ${text}`}>
      {label}
    </span>
  );
}

function TransactionStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    PENDING: { label: "Pending", bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
    COMPLETED: { label: "Completed", bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
    FAILED: { label: "Failed", bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
    CANCELLED: { label: "Cancelled", bg: "bg-white/5", text: "text-white/40", dot: "bg-white/40" },
  };
  const { label, bg, text, dot } = map[status] ?? { label: status, bg: "bg-white/5", text: "text-white/40", dot: "bg-white/20" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${bg} ${text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const [settings, adminMetrics, transcriptionStats, mediaCacheInfo] = await Promise.all([
    prisma.globalSettings.findFirst(),
    getAdminDashboardMetrics(),
    getTranscriptionStats().catch(() => ({ total: 0, pending: 0, approved: 0, rejected: 0 })),
    getMediaCacheInfo().catch(() => ({ cachedVideos: 0, lastRefresh: null })),
  ]);

  const m = adminMetrics ?? {
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    pendingWithdrawalsAmount: 0,
    pendingWithdrawalsCount: 0,
    recentTransactions: [],
    weekData: [],
    totalTasks: 0,
    completedTasks: 0,
  };

  const txStats = transcriptionStats;
  const activationRate = m.totalUsers > 0 ? (m.activeUsers / m.totalUsers) * 100 : 0;
  const taskRate = m.totalTasks > 0 ? (m.completedTasks / m.totalTasks) * 100 : 0;
  const lastRefreshLabel = mediaCacheInfo.lastRefresh
    ? new Date(mediaCacheInfo.lastRefresh).toLocaleString()
    : null;

  // Build revenue chart data from weekData
  const revenueData = m.weekData.map((w: { day: string; users: number; active: number }) => ({
    label: w.day,
    amount: w.active * Number(settings?.activationFeeAmount ?? 100),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-white/30 mb-1">
          <span>Admin</span>
          <span className="text-white/10">/</span>
          <span className="text-white/60">Dashboard</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-white/40 mt-0.5">Real-time platform analytics</p>
      </div>

      {/* ── Primary Stats ── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Users",
            value: m.totalUsers.toLocaleString(),
            sub: "All registered",
            icon: Users,
            gradient: "from-violet-500/15 to-violet-500/5",
            iconBg: "bg-violet-500/15 text-violet-400",
          },
          {
            label: "Active Users",
            value: m.activeUsers.toLocaleString(),
            sub: `${activationRate.toFixed(1)}% activated`,
            icon: UserCheck,
            gradient: "from-emerald-500/15 to-emerald-500/5",
            iconBg: "bg-emerald-500/15 text-emerald-400",
          },
          {
            label: "Total Revenue",
            value: `KES ${m.totalRevenue.toLocaleString()}`,
            sub: "Completed transactions",
            icon: DollarSign,
            gradient: "from-sky-500/15 to-sky-500/5",
            iconBg: "bg-sky-500/15 text-sky-400",
          },
          {
            label: "Pending Withdrawals",
            value: `KES ${m.pendingWithdrawalsAmount.toLocaleString()}`,
            sub: `${m.pendingWithdrawalsCount} requests`,
            icon: ArrowDownCircle,
            gradient: "from-amber-500/15 to-amber-500/5",
            iconBg: "bg-amber-500/15 text-amber-400",
          },
        ].map(({ label, value, sub, icon: Icon, gradient, iconBg }) => (
          <div
            key={label}
            className={`rounded-2xl border border-white/[0.06] bg-gradient-to-br ${gradient} p-5`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/30">{label}</p>
                <p className="mt-2 text-2xl font-bold text-white">{value}</p>
                <p className="mt-1 text-[11px] text-white/30">{sub}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Secondary Stats Row ── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/30">Total Tasks</p>
              <p className="mt-2 text-2xl font-bold text-white">{m.totalTasks.toLocaleString()}</p>
              <p className="mt-1 text-[11px] text-white/30">Platform-wide</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-teal-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/30">Completed Tasks</p>
              <p className="mt-2 text-2xl font-bold text-white">{m.completedTasks.toLocaleString()}</p>
              <p className="mt-1 text-[11px] text-white/30">{taskRate.toFixed(1)}% rate</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Config card */}
        <div className="col-span-2 rounded-2xl border border-violet-500/10 bg-gradient-to-br from-violet-500/[0.08] to-indigo-500/[0.04] p-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="text-center flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Activation Fee</p>
              <p className="mt-1 text-xl font-bold text-white">KES {Number(settings?.activationFeeAmount ?? 100).toLocaleString()}</p>
            </div>
            <div className="h-8 w-px bg-white/[0.06]" />
            <div className="text-center flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Referral Bonus</p>
              <p className="mt-1 text-xl font-bold text-white">KES {Number(settings?.referralBonusAmount ?? 100).toLocaleString()}</p>
            </div>
            <div className="h-8 w-px bg-white/[0.06]" />
            <div className="text-center flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Min Withdrawal</p>
              <p className="mt-1 text-xl font-bold text-white">KES {Number(settings?.minWithdrawalAmount ?? 500).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Registration Chart */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-violet-400" />
              <h3 className="text-sm font-semibold text-white/80">User Registration (7 days)</h3>
            </div>
            <p className="mt-0.5 text-xs text-white/30">New registrations and activations this week</p>
          </div>
          <AdminRegistrationChart data={m.weekData} />
        </div>

        {/* Metric Rings + Revenue */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white/80">Platform Health</h3>
            </div>
            <p className="mt-0.5 text-xs text-white/30">Key performance indicators</p>
          </div>

          {/* Rings */}
          <div className="flex items-center justify-around mb-6">
            <MetricRing label="Activation Rate" value={m.activeUsers} max={m.totalUsers} color="#8b5cf6" suffix="%" />
            <MetricRing label="Task Completion" value={m.completedTasks} max={m.totalTasks} color="#10b981" suffix="%" />
          </div>

          {/* Quick stats */}
          <div className="space-y-2">
            {[
              { label: "Inactive Users", value: m.totalUsers - m.activeUsers, color: "text-amber-400" },
              { label: "Active Users", value: m.activeUsers, color: "text-emerald-400" },
              { label: "Total Revenue", value: `KES ${m.totalRevenue.toLocaleString()}`, color: "text-violet-400" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-2.5">
                <span className="text-xs text-white/40">{s.label}</span>
                <span className={`text-sm font-semibold ${s.color}`}>{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Revenue Chart ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-white/80">Revenue Trend (7 days)</h3>
          </div>
          <p className="mt-0.5 text-xs text-white/30">Estimated revenue from activations</p>
        </div>
        <RevenueChart data={revenueData} />
      </div>

      {/* ── Transcription Stats ── */}
      <div>
        <h2 className="text-lg font-bold tracking-tight text-white/90 mb-1">Transcription Overview</h2>
        <p className="text-sm text-white/30 mb-4">Submissions and payout management</p>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
          {[
            {
              label: "Total Submissions",
              value: txStats.total,
              icon: FileText,
              iconClass: "bg-violet-500/15 text-violet-400",
            },
            {
              label: "Pending Review",
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
                  <p className="mt-2 text-2xl font-bold text-white">{value.toLocaleString()}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity breakdown */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h3 className="text-sm font-semibold text-white/80 mb-4">Submission Breakdown</h3>
          <ActivityBreakdown
            total={txStats.total}
            items={[
              { label: "Pending Review", count: txStats.pending, color: "#f59e0b" },
              { label: "Approved", count: txStats.approved, color: "#10b981" },
              { label: "Rejected", count: txStats.rejected, color: "#ef4444" },
            ]}
          />
        </div>
      </div>

      {/* ── Recent Transactions ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-white/40" />
            <h3 className="text-sm font-semibold text-white/80">Recent Transactions</h3>
          </div>
          <p className="mt-0.5 text-xs text-white/30">Latest platform transactions</p>
        </div>

        {m.recentTransactions.length === 0 ? (
          <p className="py-12 text-center text-sm text-white/20">No transactions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["User", "Type", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-white/20">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {m.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-[11px] font-bold text-white/50">
                          {(tx.user.name ?? tx.user.email)[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white/80 truncate max-w-[120px]">{tx.user.name ?? tx.user.email}</p>
                          <p className="text-[10px] text-white/25 truncate max-w-[120px] hidden sm:block">{tx.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4"><TransactionTypeBadge type={tx.type} /></td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-semibold ${tx.type === "WITHDRAWAL" ? "text-amber-400" : "text-emerald-400"}`}>
                        {tx.type === "WITHDRAWAL" ? "-" : "+"}KES {Number(tx.amount).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-3 px-4"><TransactionStatusBadge status={tx.status} /></td>
                    <td className="py-3 px-4 text-[11px] text-white/25 hidden md:table-cell">{formatDate(tx.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Media Cache Info ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white/80">Media Cache</p>
            <p className="text-xs text-white/30">
              {mediaCacheInfo.cachedVideos} videos cached
              {lastRefreshLabel && ` · Last: ${lastRefreshLabel}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
