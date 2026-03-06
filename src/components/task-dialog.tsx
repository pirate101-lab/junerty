"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createTask, updateTask, type TaskFormState } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type User = {
  id: string;
  name: string | null;
  email: string | null;
};

interface TaskDialogProps {
  children?: React.ReactNode;
  users: User[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  task?: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    assigneeId?: string | null;
    dueDate: Date | null;
  };
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : children}
    </Button>
  );
}

export function TaskDialog({
  children,
  users,
  open,
  onOpenChange,
  task,
}: TaskDialogProps) {
  const isEdit = !!task;
  const updateAction = (prev: TaskFormState, fd: FormData) =>
    updateTask(task!.id, prev, fd);
  const [state, formAction] = useFormState<TaskFormState, FormData>(
    isEdit ? updateAction : createTask,
    {}
  );

  useEffect(() => {
    if (state.success && onOpenChange) {
      onOpenChange(false);
    }
  }, [state.success, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={task?.title}
              placeholder="Task title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={task?.description ?? ""}
              placeholder="Task description"
              className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                name="status"
                defaultValue={task?.status ?? "TODO"}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <select
                name="priority"
                defaultValue={task?.priority ?? "MEDIUM"}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Assign to</Label>
            <select
              name="assigneeId"
              defaultValue={task?.assigneeId ?? ""}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name ?? u.email ?? u.id}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              defaultValue={
                task?.dueDate
                  ? new Date(task.dueDate).toISOString().split("T")[0]
                  : ""
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            {onOpenChange && (
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            )}
            <SubmitButton>{isEdit ? "Update" : "Create"}</SubmitButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
