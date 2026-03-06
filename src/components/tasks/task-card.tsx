"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, GripVertical } from "lucide-react";
import { TaskEditDialog } from "./task-edit-dialog";
import { deleteTask } from "@/app/actions/tasks";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

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

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "text-slate-500",
  MEDIUM: "text-blue-500",
  HIGH: "text-amber-500",
  URGENT: "text-red-500",
};

interface TaskCardProps {
  task: Task;
  onStatusChange: (status: string) => void;
  columns: { id: string; title: string }[];
}

export function TaskCard({ task, onStatusChange, columns }: TaskCardProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task.id);
      router.refresh();
    }
  }

  return (
    <>
      <div className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{task.title}</p>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span
                className={`text-xs font-medium ${PRIORITY_COLORS[task.priority] ?? ""}`}
              >
                {task.priority}
              </span>
              {task.dueDate && (
                <span className="text-xs text-muted-foreground">
                  {formatDate(task.dueDate)}
                </span>
              )}
              {task.assignedTo && (
                <span className="text-xs text-muted-foreground">
                  → {task.assignedTo.name ?? task.assignedTo.email}
                </span>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columns
                .filter((c) => c.id !== task.status)
                .map((col) => (
                  <DropdownMenuItem
                    key={col.id}
                    onClick={() => onStatusChange(col.id)}
                  >
                    Move to {col.title}
                  </DropdownMenuItem>
                ))}
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDelete}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <TaskEditDialog
        task={task}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
