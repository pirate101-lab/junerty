import { getDashboardMetrics } from "@/actions/dashboard";
import { getWalletData } from "@/actions/wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardBarChart, DashboardPieChart } from "@/components/dashboard/dashboard-charts";
import { CheckSquare, Users, TrendingUp, ListTodo, WalletIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

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
  ].filter((d) => d.value > 0);

  const barData = [
    { status: "To Do", count: metrics.tasksByStatus.TODO },
    { status: "In Progress", count: metrics.tasksByStatus.IN_PROGRESS },
    { status: "In Review", count: metrics.tasksByStatus.IN_REVIEW },
    { status: "Done", count: metrics.tasksByStatus.DONE },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your tasks and activity
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card className="col-span-2 sm:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              All tasks assigned to you
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.completionRate.toFixed(1)}% completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.tasksByStatus.IN_PROGRESS}
            </div>
            <p className="text-xs text-muted-foreground">
              Active tasks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.userCount}</div>
            <p className="text-xs text-muted-foreground">
              Total users
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet</CardTitle>
            <WalletIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {Number(walletData?.user?.walletBalance ?? 0).toFixed(2)}
            </div>
            <Link href="/wallet">
              <p className="text-xs text-primary hover:underline cursor-pointer">
                {walletData?.user?.isActive ? "Manage wallet →" : "Activate account →"}
              </p>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Status</CardTitle>
            <CardDescription>Distribution across workflow stages</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardBarChart data={barData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
            <CardDescription>Pie chart view</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardPieChart data={statusData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Your latest activity</CardDescription>
          </div>
          <Link href="/tasks">
            <Button variant="outline" size="sm">View all</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {metrics.recentTasks.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No tasks yet.{" "}
              <Link href="/tasks" className="text-primary hover:underline">
                Create your first task
              </Link>
            </p>
          ) : (
            <div className="space-y-4">
              {metrics.recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.status} • {task.assignedTo?.name ?? "Unassigned"}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(task.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
