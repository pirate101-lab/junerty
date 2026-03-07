import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TasksView } from "@/components/tasks/tasks-view";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function TasksPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const tasks = await prisma.task.findMany({
    where: {
      OR: [{ createdById: session.user.id }, { assignedToId: session.user.id }],
    },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track your tasks
          </p>
        </div>
        <CreateTaskDialog users={users}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </CreateTaskDialog>
      </div>

      <TasksView tasks={tasks} users={users} />
    </div>
  );
}
