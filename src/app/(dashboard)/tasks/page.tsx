import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getNextTask, getUserSubmissions, getImageTasks } from "@/actions/transcription";
import { UnifiedTasksClient } from "@/components/tasks/unified-tasks-client";

export default async function TasksPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const [videoData, imageData, submissions] = await Promise.all([
    getNextTask(),
    getImageTasks(),
    getUserSubmissions(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Complete video transcription and image description tasks to earn KES
        </p>
      </div>
      <UnifiedTasksClient
        videoTask={videoData.task}
        imageTasks={imageData.tasks}
        todayCount={videoData.todayCount}
        dailyLimit={videoData.dailyLimit}
        limitReached={videoData.limitReached}
        noVideoTasks={"noTasks" in videoData && !!videoData.noTasks}
        noImageTasks={imageData.noTasks}
        submissions={submissions.map((s) => ({
          id: s.id,
          title: s.task.title,
          rewardCoins: s.task.rewardCoins,
          status: s.status,
          createdAt: s.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
