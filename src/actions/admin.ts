"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";
import { MS_PER_DAY, buildWeekBuckets } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") throw new Error("Forbidden: Admin access required");
  return session.user.id;
}

export async function getGlobalSettings() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") return null;

  return prisma.globalSettings.findFirst();
}

export async function updateGlobalSettings(data: {
  activationFeeAmount?: number;
  referralBonusAmount?: number;
  minWithdrawalAmount?: number;
  whatsappNumber?: string;
  lipanaApiKey?: string;
  lipanaSecretKey?: string;
  lipanaMerchantId?: string;
}) {
  await requireAdmin();

  const existing = await prisma.globalSettings.findFirst();

  let lipanaCredentials: string | undefined;
  if (data.lipanaApiKey && data.lipanaSecretKey && data.lipanaMerchantId) {
    const credJson = JSON.stringify({
      apiKey: data.lipanaApiKey,
      secretKey: data.lipanaSecretKey,
      merchantId: data.lipanaMerchantId,
    });
    lipanaCredentials = encrypt(credJson);
  }

  const updateData: Record<string, unknown> = {};
  if (data.activationFeeAmount !== undefined) updateData.activationFeeAmount = data.activationFeeAmount;
  if (data.referralBonusAmount !== undefined) updateData.referralBonusAmount = data.referralBonusAmount;
  if (data.minWithdrawalAmount !== undefined) updateData.minWithdrawalAmount = data.minWithdrawalAmount;
  if (data.whatsappNumber !== undefined) updateData.whatsappNumber = data.whatsappNumber || null;
  if (lipanaCredentials) updateData.lipanaCredentials = lipanaCredentials;

  if (existing) {
    await prisma.globalSettings.update({ where: { id: existing.id }, data: updateData });
  } else {
    await prisma.globalSettings.create({ data: updateData });
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function getWhatsappNumber() {
  const settings = await prisma.globalSettings.findFirst({
    select: { whatsappNumber: true },
  });
  return settings?.whatsappNumber ?? null;
}

export async function getAdminDashboardMetrics() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") return null;

  const sevenDaysAgo = new Date(Date.now() - 7 * MS_PER_DAY);

  const [
    totalUsers,
    activeUsers,
    totalRevenue,
    pendingWithdrawals,
    recentTransactions,
    usersLast7Days,
    totalTasks,
    completedTasks,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.transaction.aggregate({
      where: {
        status: "COMPLETED",
        type: { in: ["ACTIVATION", "DEPOSIT"] },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { status: "PENDING", type: "WITHDRAWAL" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.transaction.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true, isActive: true },
    }),
    prisma.task.count(),
    prisma.task.count({ where: { status: "DONE" } }),
  ]);

  // Build weekly user registration data using shared utility
  const weekBuckets = buildWeekBuckets();
  const weekData = weekBuckets.map((b) => ({ ...b, users: 0, active: 0 }));

  usersLast7Days.forEach((u) => {
    const dateStr = new Date(u.createdAt).toDateString();
    const slot = weekData.find((w) => w.dateStr === dateStr);
    if (slot) {
      slot.users += 1;
      if (u.isActive) slot.active += 1;
    }
  });

  return {
    totalUsers,
    activeUsers,
    totalRevenue: Number(totalRevenue._sum.amount ?? 0),
    pendingWithdrawalsAmount: Number(pendingWithdrawals._sum.amount ?? 0),
    pendingWithdrawalsCount: pendingWithdrawals._count,
    recentTransactions,
    weekData: weekData.map(({ day, users, active }) => ({ day, users, active })),
    totalTasks,
    completedTasks,
  };
}
