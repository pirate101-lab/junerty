"use client";

import { TaskCard } from "@/components/task-card";
import { TaskStatus } from "@prisma/client";
import type { Task, User } from "@prisma/client";

type TaskWithAssignee = Task & {
  assignee: { id: string; name: string | null; email: string; image: string | null } | null;
};

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "TODO", label: "To Do" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "IN_REVIEW", label: "In Review" },
  { status: "DONE", label: "Done" },
];

export function TaskList({
  tasks,
  users,
}: {
  tasks: TaskWithAssignee[];
  users: Pick<User, "id" | "name" | "email">[];
}) {
  async function handleStatusChange(taskId: string, newStatus: TaskStatus) {
    const { updateTask } = await import("@/app/actions/tasks");
    await updateTask(taskId, { status: newStatus });
  }

  return (
    <div className="space-y-2">
      {tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
          No tasks yet. Create your first task to get started.
        </div>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            users={users}
            onStatusChange={(status) => handleStatusChange(task.id, status)}
            columns={COLUMNS}
          />
        ))
      )}
    </div>
  );
}
