"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function updateProfile(data: { name: string }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (!data.name?.trim()) throw new Error("Name is required");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: data.name.trim() },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true };
}
