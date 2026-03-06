import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  CheckSquare,
  TrendingUp,
  Users,
} from "lucide-react";
import { DashboardCharts } from "@/components/dashboard-charts";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [taskCount, userCount, recentTasks] = await Promise.all([
    prisma.task.count({ where: userId ? { creatorId: userId } : undefined }),
    prisma.user.count(),
    prisma.task.findMany({
      where: userId ? { creatorId: userId } : undefined,
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { assignee: { select: { name: true } } },
    }),
  ]);

  const totalTasks = await prisma.task.count();
  const completedTasks = await prisma.task.count({
    where: { status: "DONE" },
  });
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      title: "Total Tasks",
      value: taskCount,
      icon: CheckSquare,
      change: "+12%",
    },
    {
      title: "Team Members",
      value: userCount,
      icon: Users,
      change: "+3",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      change: "+5%",
    },
    {
      title: "Active Projects",
      value: "4",
      icon: Activity,
      change: "+2",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {session?.user?.name ?? "User"}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your projects today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 dark:text-green-400">
                  {stat.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Task completion trends</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardCharts />
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Your latest activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tasks yet. Create your first task!
                </p>
              ) : (
                recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {task.assignee?.name ?? "Unassigned"} • {task.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
