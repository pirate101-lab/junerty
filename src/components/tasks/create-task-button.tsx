"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTaskDialog } from "./create-task-dialog";

export function CreateTaskButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        New Task
      </Button>
      <CreateTaskDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
