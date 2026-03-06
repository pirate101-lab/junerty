"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { TaskStatus, TaskPriority } from "@prisma/client";
import { updateTask, deleteTask } from "@/app/actions/tasks";
import { EditTaskDialog } from "@/components/edit-task-dialog";
import type { Task, User } from "@prisma/client";

type TaskWithAssignee = Task & {
  assignee: { id: string; name: string | null; email: string; image: string | null } | null;
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  LOW: "bg-slate-500/20 text-slate-600 dark:text-slate-400",
  MEDIUM: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  HIGH: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
  URGENT: "bg-red-500/20 text-red-600 dark:text-red-400",
};

export function TaskCard({
  task,
  users,
  onStatusChange,
  columns,
}: {
  task: TaskWithAssignee;
  users: Pick<User, "id" | "name" | "email">[];
  onStatusChange: (status: TaskStatus) => void;
  columns: { status: TaskStatus; label: string }[];
}) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="group rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{task.title}</p>
          {task.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-1">
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}
            >
              {task.priority}
            </span>
            {task.assignee && (
              <span className="rounded bg-muted px-2 py-0.5 text-xs">
                {task.assignee.name || task.assignee.email}
              </span>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => deleteTask(task.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-3">
        <Select
          value={task.status}
          onValueChange={(v) => onStatusChange(v as TaskStatus)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {columns.map((col) => (
              <SelectItem key={col.status} value={col.status}>
                {col.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <EditTaskDialog
        task={task}
        users={users}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
