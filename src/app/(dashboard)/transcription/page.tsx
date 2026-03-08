import { TranscriptionWorkspace } from "@/components/transcription/transcription-workspace";

export default function TranscriptionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Transcription Workspace
        </h1>
        <p className="text-muted-foreground">
          Play the media and type your transcription in real time.
        </p>
      </div>

      <TranscriptionWorkspace />
    </div>
  );
}
