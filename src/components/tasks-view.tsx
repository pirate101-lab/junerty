"use client";

import { useState } from "react";
import { LayoutGrid, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskKanban } from "@/components/task-kanban";
import { TaskList } from "@/components/task-list";
import { TaskDialog } from "@/components/task-dialog";

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

interface TasksViewProps {
  tasks: Task[];
  users: User[];
}

export function TasksView({ tasks, users }: TasksViewProps) {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={view === "kanban" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("kanban")}
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            Kanban
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("list")}
          >
            <List className="mr-2 h-4 w-4" />
            List
          </Button>
        </div>
        <TaskDialog users={users} open={createOpen} onOpenChange={setCreateOpen}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </TaskDialog>
      </div>

      {view === "kanban" ? (
        <TaskKanban tasks={tasks} users={users} />
      ) : (
        <TaskList tasks={tasks} users={users} />
      )}
    </div>
  );
}
