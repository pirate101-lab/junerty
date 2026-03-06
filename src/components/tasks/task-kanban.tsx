"use client";

import { useRouter } from "next/navigation";
import { TaskCard } from "./task-card";
import { updateTaskStatus } from "@/app/actions/tasks";

const COLUMNS = [
  { id: "TODO", title: "To Do", color: "bg-slate-500/20" },
  { id: "IN_PROGRESS", title: "In Progress", color: "bg-blue-500/20" },
  { id: "IN_REVIEW", title: "In Review", color: "bg-amber-500/20" },
  { id: "DONE", title: "Done", color: "bg-green-500/20" },
];

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  createdBy: { id: string; name: string | null; email: string };
  assignedTo: { id: string; name: string | null; email: string } | null;
};

interface TaskKanbanProps {
  tasks: Task[];
}

export function TaskKanban({ tasks }: TaskKanbanProps) {
  const router = useRouter();

  async function handleStatusChange(taskId: string, newStatus: string) {
    await updateTaskStatus(taskId, newStatus);
    router.refresh();
  }

  const tasksByStatus = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="flex gap-4 min-w-max pb-4">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            className={`w-72 flex-shrink-0 rounded-lg border p-4 ${col.color}`}
          >
            <h3 className="font-semibold mb-4 flex items-center justify-between">
              {col.title}
              <span className="text-sm font-normal text-muted-foreground">
                {tasksByStatus[col.id]?.length ?? 0}
              </span>
            </h3>
            <div className="space-y-3">
              {tasksByStatus[col.id]?.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={(status) => handleStatusChange(task.id, status)}
                  columns={COLUMNS}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
