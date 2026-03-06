"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List } from "lucide-react";
import { TaskKanban } from "@/components/task-kanban";
import { TaskList } from "@/components/task-list";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import type { Task, User } from "@prisma/client";

type TaskWithAssignee = Task & {
  assignee: { id: string; name: string | null; email: string; image: string | null } | null;
};

export function TasksView({
  initialTasks,
  users,
}: {
  initialTasks: TaskWithAssignee[];
  users: Pick<User, "id" | "name" | "email">[];
}) {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={view === "kanban" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("kanban")}
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            Kanban
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("list")}
          >
            <List className="mr-2 h-4 w-4" />
            List
          </Button>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {view === "kanban" ? (
        <TaskKanban tasks={initialTasks} users={users} />
      ) : (
        <TaskList tasks={initialTasks} users={users} />
      )}

      <CreateTaskDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        users={users}
      />
    </div>
  );
}
