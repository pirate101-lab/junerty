import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSettingsForm } from "@/components/admin/admin-settings-form";
import { UserAvatar } from "@/components/user-avatar";
import { ShieldAlert, Users, UserCheck, DollarSign, ArrowDownCircle, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { getAdminDashboardMetrics } from "@/actions/admin";
import { AdminBarChart } from "@/components/dashboard/dashboard-charts";
import { formatDate } from "@/lib/utils";

function TransactionTypeBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    ACTIVATION: { label: "Activation", cls: "badge-inprogress" },
    REFERRAL_BONUS: { label: "Referral", cls: "badge-done" },
    WITHDRAWAL: { label: "Withdrawal", cls: "badge-inreview" },
    DEPOSIT: { label: "Deposit", cls: "badge-low" },
  };
  const { label, cls } = map[type] ?? { label: type, cls: "badge-todo" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

function TransactionStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    PENDING: { label: "Pending", cls: "badge-pending" },
    COMPLETED: { label: "Completed", cls: "badge-completed" },
    FAILED: { label: "Failed", cls: "badge-failed" },
    CANCELLED: { label: "Cancelled", cls: "badge-cancelled" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "badge-todo" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <ShieldAlert className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to view this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const [settings, adminMetrics] = await Promise.all([
    prisma.globalSettings.findFirst(),
    getAdminDashboardMetrics(),
  ]);

  const metrics = adminMetrics ?? {
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

  const activationRate = metrics.totalUsers > 0
    ? ((metrics.activeUsers / metrics.totalUsers) * 100).toFixed(1)
    : "0.0";
  const taskCompletionRate = metrics.totalTasks > 0
    ? ((metrics.completedTasks / metrics.totalTasks) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span>Admin</span>
          <span>/</span>
          <span className="text-foreground">Dashboard</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Platform analytics and configuration</p>
      </div>

      {/* Top Stats Row — 4 cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <Card className="dashboard-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Users</p>
                <p className="mt-2 text-3xl font-bold">{metrics.totalUsers.toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted-foreground">All registered accounts</p>
              </div>
              <div className="stat-icon-purple flex h-10 w-10 items-center justify-center rounded-xl">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="dashboard-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Users</p>
                <p className="mt-2 text-3xl font-bold">{metrics.activeUsers.toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted-foreground">{activationRate}% activation rate</p>
              </div>
              <div className="stat-icon-green flex h-10 w-10 items-center justify-center rounded-xl">
                <UserCheck className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="dashboard-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Revenue</p>
                <p className="mt-2 text-3xl font-bold">
                  KES {metrics.totalRevenue.toLocaleString("en-KE", { minimumFractionDigits: 0 })}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Completed transactions</p>
              </div>
              <div className="stat-icon-blue flex h-10 w-10 items-center justify-center rounded-xl">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Withdrawals */}
        <Card className="dashboard-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending Withdrawals</p>
                <p className="mt-2 text-3xl font-bold">
                  KES {metrics.pendingWithdrawalsAmount.toLocaleString("en-KE", { minimumFractionDigits: 0 })}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{metrics.pendingWithdrawalsCount} pending requests</p>
              </div>
              <div className="stat-icon-orange flex h-10 w-10 items-center justify-center rounded-xl">
                <ArrowDownCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="dashboard-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Tasks</p>
                <p className="mt-2 text-3xl font-bold">{metrics.totalTasks.toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted-foreground">Platform-wide tasks</p>
              </div>
              <div className="stat-icon-teal flex h-10 w-10 items-center justify-center rounded-xl">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Completed Tasks</p>
                <p className="mt-2 text-3xl font-bold">{metrics.completedTasks.toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted-foreground">{taskCompletionRate}% completion</p>
              </div>
              <div className="stat-icon-green flex h-10 w-10 items-center justify-center rounded-xl">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card col-span-2 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Activation Fee</p>
                <p className="mt-1 text-2xl font-bold">KES {Number(settings?.activationFeeAmount ?? 100).toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Referral Bonus</p>
                <p className="mt-1 text-2xl font-bold">KES {Number(settings?.referralBonusAmount ?? 100).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Min Withdrawal</p>
                <p className="mt-1 text-2xl font-bold">KES {Number(settings?.minWithdrawalAmount ?? 500).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">User Registration (7 days)</CardTitle>
            <CardDescription>New registrations and activations this week</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminBarChart data={metrics.weekData} />
          </CardContent>
        </Card>

        {/* Platform Overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Platform Overview</CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-muted-foreground">User Activation Rate</span>
                <span className="text-sm font-semibold">{activationRate}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${activationRate}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-muted-foreground">Task Completion Rate</span>
                <span className="text-sm font-semibold">{taskCompletionRate}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${taskCompletionRate}%`, background: "linear-gradient(90deg, #22c55e, #16a34a)" }} />
              </div>
            </div>
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                <span className="text-sm text-muted-foreground">Inactive Users</span>
                <span className="font-semibold text-orange-500">{metrics.totalUsers - metrics.activeUsers}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="font-semibold text-green-500">{metrics.activeUsers}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                <span className="text-sm text-muted-foreground">Total Revenue</span>
                <span className="font-semibold text-primary">KES {metrics.totalRevenue.toLocaleString("en-KE")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent Transactions</CardTitle>
          <CardDescription>Latest platform transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.recentTransactions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No transactions yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />Date
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {metrics.recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <UserAvatar name={tx.user.name} email={tx.user.email} size="sm" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate max-w-[120px]">{tx.user.name ?? tx.user.email}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[120px] hidden sm:block">{tx.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <TransactionTypeBadge type={tx.type} />
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold text-sm ${tx.type === "WITHDRAWAL" ? "text-orange-500" : "text-green-500"}`}>
                          {tx.type === "WITHDRAWAL" ? "-" : "+"}KES {Number(tx.amount).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <TransactionStatusBadge status={tx.status} />
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground hidden md:table-cell">
                        {formatDate(tx.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Form */}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>
              Configure activation fees, referral bonuses, and payment gateway credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminSettingsForm
              initialValues={{
                activationFeeAmount: Number(settings?.activationFeeAmount ?? 100),
                referralBonusAmount: Number(settings?.referralBonusAmount ?? 100),
                minWithdrawalAmount: Number(settings?.minWithdrawalAmount ?? 500),
                whatsappNumber: settings?.whatsappNumber ?? "",
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
