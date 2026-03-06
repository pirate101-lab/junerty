"use client";

import { useOptimistic } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TaskCard } from "@/components/task-card";
import { updateTask } from "@/app/actions/tasks";
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

export function TaskKanban({
  tasks,
  users,
}: {
  tasks: TaskWithAssignee[];
  users: Pick<User, "id" | "name" | "email">[];
}) {
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(tasks);

  async function handleStatusChange(taskId: string, newStatus: TaskStatus) {
    setOptimisticTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    await updateTask(taskId, { status: newStatus });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {COLUMNS.map((col) => {
        const columnTasks = optimisticTasks.filter((t) => t.status === col.status);
        return (
          <Card key={col.status} className="flex flex-col">
            <CardHeader className="pb-2">
              <h3 className="font-semibold">
                {col.label}{" "}
                <span className="text-muted-foreground">({columnTasks.length})</span>
              </h3>
            </CardHeader>
            <CardContent className="flex-1 space-y-2 overflow-auto">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  users={users}
                  onStatusChange={(status) => handleStatusChange(task.id, status)}
                  columns={COLUMNS}
                />
              ))}
              {columnTasks.length === 0 && (
                <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                  No tasks
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
