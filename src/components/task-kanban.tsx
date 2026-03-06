"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskDialog } from "@/components/task-dialog";
import { updateTaskStatus, deleteTask } from "@/actions/tasks";
import { formatDate } from "@/lib/utils";

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
  assigneeId?: string | null;
  assignee: { id: string; name: string | null; email: string | null } | null;
};

type User = {
  id: string;
  name: string | null;
  email: string | null;
};

interface TaskKanbanProps {
  tasks: Task[];
  users: User[];
}

function TaskCard({
  task,
  users,
  onStatusChange,
}: {
  task: Task;
  users: User[];
  onStatusChange: (taskId: string, status: string) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  return (
    <>
      <Card className="group cursor-grab">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{task.title}</p>
              <p className="text-muted-foreground text-xs mt-1">
                {task.assignee?.name ?? "Unassigned"}
              </p>
              {task.dueDate && (
                <p className="text-muted-foreground text-xs">
                  Due {formatDate(task.dueDate)}
                </p>
              )}
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
                  className="text-destructive"
                  onClick={() => onStatusChange(task.id, "delete")}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
      <TaskDialog
        users={users}
        open={editOpen}
        onOpenChange={setEditOpen}
        task={task}
      />
    </>
  );
}

export function TaskKanban({ tasks, users }: TaskKanbanProps) {
  const router = useRouter();

  const tasksByStatus = COLUMNS.reduce(
    (acc, col) => {
      acc[col.id] = tasks.filter((t) => t.status === col.id);
      return acc;
    },
    {} as Record<string, Task[]>
  );

  async function handleStatusChange(taskId: string, action: string) {
    if (action === "delete") {
      await deleteTask(taskId);
      router.refresh();
      return;
    }
    await updateTaskStatus(
      taskId,
      action as "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE"
    );
    router.refresh();
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => (
        <div
          key={col.id}
          className="flex w-72 shrink-0 flex-col rounded-lg border bg-muted/30 p-4"
        >
          <h3 className="font-semibold mb-4">{col.title}</h3>
          <div className="space-y-2">
            {tasksByStatus[col.id]?.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                users={users}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
