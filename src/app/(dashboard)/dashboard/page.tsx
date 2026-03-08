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
  CheckSquare,
  Users,
  TrendingUp,
  ListTodo,
  WalletIcon,
  AlertCircle,
  ArrowUpRight,
  Clock,
  Star,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  TODO: "#94a3b8",
  IN_PROGRESS: "#3b82f6",
  IN_REVIEW: "#f59e0b",
  DONE: "#22c55e",
};

/** Returns a 0-100 progress value for a task based on its status. */
function taskProgress(status: string): number {
  const map: Record<string, number> = {
    TODO: 10,
    IN_PROGRESS: 50,
    IN_REVIEW: 75,
    DONE: 100,
  };
  return map[status] ?? 10;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    TODO: { label: "To Do", cls: "badge-todo" },
    IN_PROGRESS: { label: "In Progress", cls: "badge-inprogress" },
    IN_REVIEW: { label: "In Review", cls: "badge-inreview" },
    DONE: { label: "Done", cls: "badge-done" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "badge-todo" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    LOW: { label: "Low", cls: "badge-low" },
    MEDIUM: { label: "Medium", cls: "badge-medium" },
    HIGH: { label: "High", cls: "badge-high" },
    URGENT: { label: "Urgent", cls: "badge-urgent" },
  };
  const { label, cls } = map[priority] ?? { label: priority, cls: "badge-medium" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

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
            Overview of your tasks and activity
          </p>
        </div>
        <Link href="/tasks">
          <Button size="sm" className="gap-2">
            <ListTodo className="h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      {/* Top Stats Row — 4 cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Completed Tasks */}
        <Card className="dashboard-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Completed</p>
                <p className="mt-2 text-3xl font-bold">{metrics.completedTasks}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {metrics.completionRate.toFixed(1)}% completion rate
                </p>
              </div>
              <div className="stat-icon-green flex h-10 w-10 items-center justify-center rounded-xl">
                <CheckSquare className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card className="dashboard-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">In Progress</p>
                <p className="mt-2 text-3xl font-bold">{metrics.tasksByStatus.IN_PROGRESS}</p>
                <p className="mt-1 text-xs text-muted-foreground">Active tasks</p>
              </div>
              <div className="stat-icon-blue flex h-10 w-10 items-center justify-center rounded-xl">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Tasks */}
        <Card className="dashboard-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Tasks</p>
                <p className="mt-2 text-3xl font-bold">{metrics.totalTasks}</p>
                <p className="mt-1 text-xs text-muted-foreground">All assigned tasks</p>
              </div>
              <div className="stat-icon-purple flex h-10 w-10 items-center justify-center rounded-xl">
                <ListTodo className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overdue */}
        <Card className="dashboard-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Overdue</p>
                <p className="mt-2 text-3xl font-bold">{metrics.overdueTasks}</p>
                <p className="mt-1 text-xs text-muted-foreground">Past due date</p>
              </div>
              <div className="stat-icon-red flex h-10 w-10 items-center justify-center rounded-xl">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row: Wallet + Team */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Wallet Card — spans 2 cols */}
        <Card className="dashboard-card col-span-2 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Wallet Balance</p>
                <p className="mt-2 text-3xl font-bold">
                  KES {walletBalance.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
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
            {!isActive && (
              <div className="mt-4 rounded-lg bg-orange-500/10 border border-orange-500/20 px-3 py-2">
                <p className="text-xs text-orange-500">⚡ Activate your account to unlock referral bonuses and withdrawals</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Referrals Count */}
        <Card className="dashboard-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Referrals</p>
                <p className="mt-2 text-3xl font-bold">{metrics.referrals.length}</p>
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

        {/* In Review */}
        <Card className="dashboard-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">In Review</p>
                <p className="mt-2 text-3xl font-bold">{metrics.tasksByStatus.IN_REVIEW}</p>
                <p className="mt-1 text-xs text-muted-foreground">Awaiting review</p>
              </div>
              <div className="stat-icon-orange flex h-10 w-10 items-center justify-center rounded-xl">
                <Star className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Activity Chart — 2/3 width */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Task Activity</CardTitle>
              <CardDescription>Tasks created &amp; completed this week</CardDescription>
            </div>
            <Link href="/tasks">
              <Button variant="outline" size="sm" className="text-xs h-7 px-2.5">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <WeeklyActivityChart data={metrics.weekData} />
          </CardContent>
        </Card>

        {/* Status Distribution — 1/3 width */}
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

      {/* Team + Recent Tasks Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Referrals */}
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

        {/* Recent Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Recent Tasks</CardTitle>
              <CardDescription>Your latest activity</CardDescription>
            </div>
            <Link href="/tasks">
              <Button variant="outline" size="sm" className="text-xs h-7 px-2.5">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {metrics.recentTasks.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No tasks yet.{" "}
                <Link href="/tasks" className="text-primary hover:underline">Create one →</Link>
              </p>
            ) : (
              metrics.recentTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 rounded-lg border border-border/60 p-3 hover:border-border transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={task.status} />
                      {task.dueDate && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    {task.assignedTo ? (
                      <UserAvatar name={task.assignedTo.name} email={task.assignedTo.email} />
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tasks Summary Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base">Tasks Summary</CardTitle>
            <CardDescription>All your tasks at a glance</CardDescription>
          </div>
          <Link href="/tasks">
            <Button variant="outline" size="sm" className="text-xs h-7 px-2.5">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {metrics.recentTasks.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No tasks yet.{" "}
              <Link href="/tasks" className="text-primary hover:underline">Create your first task →</Link>
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Assigned To</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Priority</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Due Date</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {metrics.recentTasks.map((task, index) => {
                    const progress = taskProgress(task.status);
                    return (
                      <tr key={task.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-5">{index + 1}</span>
                            <span className="font-medium truncate max-w-[180px]">{task.title}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          {task.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <UserAvatar name={task.assignedTo.name} email={task.assignedTo.email} />
                              <span className="text-xs text-muted-foreground truncate max-w-[100px]">{task.assignedTo.name ?? task.assignedTo.email}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={task.status} />
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <PriorityBadge priority={task.priority} />
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground hidden lg:table-cell">
                          {task.dueDate ? formatDate(task.dueDate) : "—"}
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="progress-bar w-20">
                              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground">{progress}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
