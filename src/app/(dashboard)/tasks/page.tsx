import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { TasksView } from "@/components/tasks-view";

export default async function TasksPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const tasks = await prisma.task.findMany({
    where: userId
      ? {
          OR: [{ creatorId: userId }, { assigneeId: userId }],
        }
      : undefined,
    include: {
      assignee: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          Manage and track your tasks. Create, assign, and update status.
        </p>
      </div>
      <TasksView tasks={tasks} users={users} />
    </div>
  );
}
