"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { TaskStatus, TaskPriority } from "@prisma/client";

export type TaskInput = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDate?: Date | null;
};

export async function createTask(input: TaskInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status ?? "TODO",
      priority: input.priority ?? "MEDIUM",
      assigneeId: input.assigneeId,
      dueDate: input.dueDate,
    },
  });

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
  return task;
}

export async function updateTask(id: string, input: Partial<TaskInput>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(input.title && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.status && { status: input.status }),
      ...(input.priority && { priority: input.priority }),
      ...(input.assigneeId !== undefined && { assigneeId: input.assigneeId }),
      ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
    },
  });

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
  return task;
}

export async function deleteTask(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.task.delete({
    where: { id },
  });

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
}

export async function getTasks(filters?: {
  status?: TaskStatus;
  assigneeId?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const tasks = await prisma.task.findMany({
    where: {
      ...(filters?.status && { status: filters.status }),
      ...(filters?.assigneeId && { assigneeId: filters.assigneeId }),
    },
    include: {
      assignee: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });

  return tasks;
}
