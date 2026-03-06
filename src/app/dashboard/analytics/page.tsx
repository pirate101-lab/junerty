import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";

export default async function AnalyticsPage() {
  const [taskStats, userGrowth] = await Promise.all([
    prisma.task.groupBy({
      by: ["status", "priority"],
      _count: { id: true },
    }),
    prisma.user.findMany({
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const statusCounts = taskStats.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] ?? 0) + s._count.id;
    return acc;
  }, {} as Record<string, number>);

  const priorityCounts = taskStats.reduce((acc, s) => {
    acc[s.priority] = (acc[s.priority] ?? 0) + s._count.id;
    return acc;
  }, {} as Record<string, number>);

  const userGrowthData = userGrowth.reduce((acc, u, i) => {
    const date = u.createdAt.toISOString().slice(0, 10);
    acc.push({
      date,
      users: i + 1,
      cumulative: i + 1,
    });
    return acc;
  }, [] as { date: string; users: number; cumulative: number }[]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Platform metrics and insights
        </p>
      </div>

      <AnalyticsCharts
        statusCounts={statusCounts}
        priorityCounts={priorityCounts}
        userGrowth={userGrowthData}
      />
    </div>
  );
}
