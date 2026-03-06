"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assigneeId: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

export type TaskFormState = {
  error?: string;
  success?: boolean;
};

export async function createTask(
  _prev: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const parsed = taskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    status: formData.get("status") || "TODO",
    priority: formData.get("priority") || "MEDIUM",
    assigneeId: formData.get("assigneeId") || null,
    dueDate: formData.get("dueDate") || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await prisma.task.create({
      data: {
        ...parsed.data,
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
        creatorId: session.user.id,
        assigneeId: parsed.data.assigneeId || null,
      },
    });
    revalidatePath("/tasks");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Create task error:", error);
    return { error: "Failed to create task" };
  }
}

export async function updateTask(
  taskId: string,
  _prev: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const parsed = taskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    status: formData.get("status"),
    priority: formData.get("priority"),
    assigneeId: formData.get("assigneeId") || null,
    dueDate: formData.get("dueDate") || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        ...parsed.data,
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
        assigneeId: parsed.data.assigneeId || null,
      },
    });
    revalidatePath("/tasks");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update task error:", error);
    return { error: "Failed to update task" };
  }
}

export async function updateTaskStatus(
  taskId: string,
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE"
): Promise<TaskFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
    revalidatePath("/tasks");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update status error:", error);
    return { error: "Failed to update status" };
  }
}

export async function deleteTask(taskId: string): Promise<TaskFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await prisma.task.delete({
      where: { id: taskId },
    });
    revalidatePath("/tasks");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete task error:", error);
    return { error: "Failed to delete task" };
  }
}
