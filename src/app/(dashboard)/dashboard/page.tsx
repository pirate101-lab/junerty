import { getDashboardMetrics } from "@/actions/dashboard";
import { getWalletData } from "@/actions/wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  WeeklyActivityChart,
  TaskDistributionChart,
} from "@/components/dashboard/dashboard-charts";
import { UserAvatar } from "@/components/user-avatar";
import {
  Users,
  TrendingUp,
  WalletIcon,
  ArrowUpRight,
  Mic,
  Play,
  Coins,
  Image,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STATUS_COLORS: Record<string, string> = {
  TODO: "#94a3b8",
  IN_PROGRESS: "#3b82f6",
  IN_REVIEW: "#f59e0b",
  DONE: "#22c55e",
};

export default async function DashboardPage() {
  const [metrics, walletData] = await Promise.all([
    getDashboardMetrics(),
    getWalletData(),
  ]);

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const statusData = [
    { name: "To Do", value: metrics.tasksByStatus.TODO, color: STATUS_COLORS.TODO },
    { name: "In Progress", value: metrics.tasksByStatus.IN_PROGRESS, color: STATUS_COLORS.IN_PROGRESS },
    { name: "In Review", value: metrics.tasksByStatus.IN_REVIEW, color: STATUS_COLORS.IN_REVIEW },
    { name: "Done", value: metrics.tasksByStatus.DONE, color: STATUS_COLORS.DONE },
  ];

  const walletBalance = Number(walletData?.user?.walletBalance ?? 0);
  const isActive = walletData?.user?.isActive ?? false;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your tasks and earnings overview
          </p>
        </div>
      </div>

      {/* Top Stats Row — 4 cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Wallet Balance */}
        <Card className="dashboard-card bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Balance</p>
                <p className="mt-2 text-2xl font-bold">
                  KES {walletBalance.toLocaleString()}
                </p>
                <Link href="/wallet">
                  <p className="mt-1 text-xs text-primary hover:underline cursor-pointer flex items-center gap-1">
                    {isActive ? "Manage wallet" : "Activate account"} <ArrowUpRight className="h-3 w-3" />
                  </p>
                </Link>
              </div>
              <div className="stat-icon-purple flex h-10 w-10 items-center justify-center rounded-xl">
                <WalletIcon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Progress */}
        <Card className="dashboard-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Today</p>
                <p className="mt-2 text-2xl font-bold">{metrics.todaySubmissions}/{metrics.dailyLimit}</p>
                <p className="mt-1 text-xs text-muted-foreground">Tasks completed</p>
              </div>
              <div className="stat-icon-green flex h-10 w-10 items-center justify-center rounded-xl">
                <Mic className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referrals */}
        <Card className="dashboard-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Referrals</p>
                <p className="mt-2 text-2xl font-bold">{metrics.referrals.length}</p>
                <Link href="/referrals">
                  <p className="mt-1 text-xs text-primary hover:underline cursor-pointer flex items-center gap-1">
                    View all <ArrowUpRight className="h-3 w-3" />
                  </p>
                </Link>
              </div>
              <div className="stat-icon-teal flex h-10 w-10 items-center justify-center rounded-xl">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earnings Trend */}
        <Card className="dashboard-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Earnings</p>
                <p className="mt-2 text-2xl font-bold">{metrics.completedTasks}</p>
                <p className="mt-1 text-xs text-muted-foreground">Completed tasks</p>
              </div>
              <div className="stat-icon-blue flex h-10 w-10 items-center justify-center rounded-xl">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!isActive && (
        <Card className="border-orange-500/30 bg-orange-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="text-lg">⚡</span>
            <div className="flex-1">
              <p className="text-sm font-medium">Activate your account</p>
              <p className="text-xs text-muted-foreground">Unlock referral bonuses and withdrawals</p>
            </div>
            <Link href="/activate">
              <Button size="sm" variant="outline" className="gap-1 text-xs">
                Activate <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Assigned Video Tasks — 2 per row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Your Tasks</h2>
            <p className="text-xs text-muted-foreground">
              Transcribe videos to earn coins · {metrics.todaySubmissions}/{metrics.dailyLimit} done today
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/tasks">
              <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
                <Image className="h-3 w-3" /> Image Tasks
              </Button>
            </Link>
            <Link href="/transcription">
              <Button size="sm" className="text-xs h-7 gap-1">
                <Mic className="h-3 w-3" /> Start Transcribing
              </Button>
            </Link>
          </div>
        </div>

        {metrics.assignedVideos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12">
              <Mic className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium">All caught up!</p>
              <p className="text-xs text-muted-foreground">You&apos;ve completed all available tasks. Check back later for new ones.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {metrics.assignedVideos.map((video) => (
              <Link key={video.id} href="/transcription">
                <Card className="group overflow-hidden transition-all hover:border-primary/40 hover:shadow-md cursor-pointer">
                  <div className="relative aspect-video bg-zinc-900">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Play className="h-8 w-8 text-white/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <Play className="h-5 w-5 text-white translate-x-0.5" />
                      </div>
                    </div>
                    <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
                      <Coins className="h-3 w-3 text-yellow-400" /> +{video.rewardCoins}
                    </span>
                    {video.category && (
                      <span className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">
                        {video.category}
                      </span>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium truncate">{video.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Tap to transcribe · Earn {video.rewardCoins} coins</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Charts + Referrals Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Task Activity</CardTitle>
              <CardDescription>Tasks created &amp; completed this week</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <WeeklyActivityChart data={metrics.weekData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Status Distribution</CardTitle>
            <CardDescription>Tasks by current stage</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskDistributionChart data={statusData} />
          </CardContent>
        </Card>
      </div>

      {/* Referrals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base">My Referrals</CardTitle>
            <CardDescription>People you&apos;ve invited</CardDescription>
          </div>
          <Link href="/referrals">
            <Button variant="outline" size="sm" className="text-xs h-7 px-2.5">View All</Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {metrics.referrals.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No referrals yet. Share your link to invite others!</p>
          ) : (
            metrics.referrals.map((referral) => (
              <div key={referral.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors">
                <UserAvatar name={referral.name} email={referral.email} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{referral.name ?? referral.email}</p>
                  <p className="text-xs text-muted-foreground truncate">{referral.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${referral.isActive ? "badge-done" : "badge-todo"}`}>
                  {referral.isActive ? "Active" : "Pending"}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
