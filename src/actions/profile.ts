"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function updateProfile(data: {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) throw new Error("User not found");

  const updateData: Record<string, unknown> = {};

  if (data.name && data.name !== user.name) {
    updateData.name = data.name;
  }

  if (data.newPassword) {
    if (!data.currentPassword) throw new Error("Current password required");
    if (!user.password) throw new Error("No password set");
    const valid = await bcrypt.compare(data.currentPassword, user.password);
    if (!valid) throw new Error("Current password is incorrect");
    updateData.password = await bcrypt.hash(data.newPassword, 12);
  }

  if (Object.keys(updateData).length > 0) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });
  }

  revalidatePath("/profile");
  return { success: true };
}
