"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().optional(),
  assignedToId: z.string().optional().nullable(),
});

const updateTaskSchema = createTaskSchema.partial();

export async function createTask(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  const parsed = createTaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    status: formData.get("status") || "TODO",
    priority: formData.get("priority") || "MEDIUM",
    dueDate: formData.get("dueDate") || undefined,
    assignedToId: formData.get("assignedToId") || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { title, description, status, priority, dueDate, assignedToId } =
    parsed.data;

  await prisma.task.create({
    data: {
      title,
      description,
      status: status ?? "TODO",
      priority: priority ?? "MEDIUM",
      dueDate: dueDate ? new Date(dueDate) : null,
      assignedToId: assignedToId || null,
      createdById: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  return { success: true };
}

export async function updateTask(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  const parsed = updateTaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
    assignedToId: formData.get("assignedToId") || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const data = parsed.data;
  const updateData: Record<string, unknown> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.dueDate !== undefined)
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  if (data.assignedToId !== undefined)
    updateData.assignedToId = data.assignedToId || null;

  await prisma.task.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  return { success: true };
}

export async function deleteTask(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  await prisma.task.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  return { success: true };
}

export async function updateTaskStatus(id: string, status: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  const validStatuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
  if (!validStatuses.includes(status)) return { error: "Invalid status" };

  await prisma.task.update({
    where: { id },
    data: { status: status as "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE" },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  return { success: true };
}
