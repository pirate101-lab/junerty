"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";

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
