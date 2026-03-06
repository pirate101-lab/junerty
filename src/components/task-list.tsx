"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskDialog } from "@/components/task-dialog";
import { updateTaskStatus, deleteTask } from "@/actions/tasks";
import { formatDate } from "@/lib/utils";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  assigneeId?: string | null;
  assignee: { id: string; name: string | null; email: string | null } | null;
};

type User = {
  id: string;
  name: string | null;
  email: string | null;
};

interface TaskListProps {
  tasks: Task[];
  users: User[];
}

const STATUS_OPTIONS = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "DONE", label: "Done" },
];

export function TaskList({ tasks, users }: TaskListProps) {
  const router = useRouter();
  const [editTask, setEditTask] = useState<Task | null>(null);

  async function handleStatusChange(taskId: string, status: string) {
    await updateTaskStatus(
      taskId,
      status as "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE"
    );
    router.refresh();
  }

  async function handleDelete(taskId: string) {
    await deleteTask(taskId);
    router.refresh();
  }

  return (
    <>
      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium">Task</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Assignee</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Due Date</th>
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{task.title}</p>
                  {task.description && (
                    <p className="text-muted-foreground text-sm line-clamp-1">
                      {task.description}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="rounded border bg-background px-2 py-1 text-sm"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-sm">
                  {task.assignee?.name ?? "Unassigned"}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {task.dueDate ? formatDate(task.dueDate) : "-"}
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditTask(task)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(task.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tasks.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            No tasks yet. Create your first task to get started.
          </div>
        )}
      </div>

      {editTask && (
        <TaskDialog
          users={users}
          open={!!editTask}
          onOpenChange={(open) => !open && setEditTask(null)}
          task={editTask}
        />
      )}
    </>
  );
}
