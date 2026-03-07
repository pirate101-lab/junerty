"use server";

import { prisma } from "@/lib/prisma";

export async function getWhatsappNumber(): Promise<string | null> {
  const settings = await prisma.globalSettings.findFirst({
    select: { whatsappNumber: true },
  });
  return settings?.whatsappNumber ?? null;
}
