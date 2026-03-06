import { prisma } from "@/lib/prisma";
import { TaskKanban } from "@/components/tasks/task-kanban";
import { TaskList } from "@/components/tasks/task-list";
import { CreateTaskButton } from "@/components/tasks/create-task-button";

export default async function TasksPage() {
  const tasks = await prisma.task.findMany({
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your tasks
          </p>
        </div>
        <CreateTaskButton />
      </div>

      <div className="space-y-6">
        <TaskKanban tasks={tasks} />
        <div className="xl:hidden">
          <h2 className="text-lg font-semibold mb-4">All Tasks</h2>
          <TaskList tasks={tasks} />
        </div>
      </div>
    </div>
  );
}
