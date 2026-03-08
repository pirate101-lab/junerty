import { getNextTask, getUserSubmissions } from "@/actions/transcription";
import { TranscriptionPageClient } from "@/components/transcription/transcription-page-client";

export default async function TranscriptionPage() {
  const [taskData, submissions] = await Promise.all([
    getNextTask(),
    getUserSubmissions(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Transcription Workspace
        </h1>
        <p className="text-sm text-muted-foreground">
          Play the media, transcribe what you hear, and earn coins. {taskData.dailyLimit} tasks per day.
        </p>
      </div>

      <TranscriptionPageClient
        initialTask={taskData.task}
        todayCount={taskData.todayCount}
        dailyLimit={taskData.dailyLimit}
        limitReached={taskData.limitReached}
        noTasks={"noTasks" in taskData && !!taskData.noTasks}
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
