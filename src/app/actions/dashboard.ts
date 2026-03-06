"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function getDashboardMetrics() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [userCount, taskCount, tasksByStatus, recentTasks] = await Promise.all([
    prisma.user.count(),
    prisma.task.count(),
    prisma.task.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.task.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        assignee: {
          select: { name: true, email: true },
        },
      },
    }),
  ]);

  const statusCounts = tasksByStatus.reduce(
    (acc, { status, _count }) => {
      acc[status] = _count.status;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    userCount,
    taskCount,
    statusCounts: {
      TODO: statusCounts.TODO ?? 0,
      IN_PROGRESS: statusCounts.IN_PROGRESS ?? 0,
      IN_REVIEW: statusCounts.IN_REVIEW ?? 0,
      DONE: statusCounts.DONE ?? 0,
    },
    recentTasks,
  };
}

export async function getUsers() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      image: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
