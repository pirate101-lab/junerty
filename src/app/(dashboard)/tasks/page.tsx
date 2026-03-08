import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TasksPageClient } from "@/components/tasks/tasks-page-client";

export default async function TasksPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Complete image labeling and survey tasks to earn coins
        </p>
      </div>
      <TasksPageClient />
    </div>
  );
}
