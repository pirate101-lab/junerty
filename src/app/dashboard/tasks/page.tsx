import { getTasks } from "@/app/actions/tasks";
import { getUsers } from "@/app/actions/dashboard";
import { TasksView } from "@/components/tasks-view";

export default async function TasksPage() {
  const [tasks, users] = await Promise.all([getTasks(), getUsers()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          Manage and track all your tasks
        </p>
      </div>
      <TasksView initialTasks={tasks} users={users} />
    </div>
  );
}
