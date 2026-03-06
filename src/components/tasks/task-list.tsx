"use client";

import { TaskCard } from "./task-card";
import { updateTaskStatus } from "@/app/actions/tasks";
import { useRouter } from "next/navigation";

const COLUMNS = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "IN_REVIEW", title: "In Review" },
  { id: "DONE", title: "Done" },
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

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const router = useRouter();

  async function handleStatusChange(taskId: string, newStatus: string) {
    await updateTaskStatus(taskId, newStatus);
    router.refresh();
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="font-semibold mb-4">All Tasks</h3>
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={(status) => handleStatusChange(task.id, status)}
            columns={COLUMNS}
          />
        ))}
      </div>
    </div>
  );
}
