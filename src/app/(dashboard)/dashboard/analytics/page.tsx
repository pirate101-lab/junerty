import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsCharts } from "@/components/analytics-charts";

export default async function AnalyticsPage() {
  const [taskStats, userCount] = await Promise.all([
    prisma.task.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.user.count(),
  ]);

  const statusCounts = taskStats.reduce(
    (acc, s) => {
      acc[s.status] = s._count.id;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          System-wide metrics and insights.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(statusCounts.TODO ?? 0) +
                (statusCounts.IN_PROGRESS ?? 0) +
                (statusCounts.IN_REVIEW ?? 0) +
                (statusCounts.DONE ?? 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{statusCounts.DONE ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{userCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Distribution</CardTitle>
          <CardDescription>Tasks by status</CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsCharts statusCounts={statusCounts} />
        </CardContent>
      </Card>
    </div>
  );
}
