"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface MediaCacheRefreshProps {
  cachedVideos: number;
  lastRefresh: string | null;
}

export function MediaCacheRefresh({ cachedVideos, lastRefresh }: MediaCacheRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setResult(null);
    try {
      const res = await fetch("/api/media/refresh", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, message: `Cached ${data.upserted} videos (${data.apiCallsUsed} API calls used)` });
      } else {
        setResult({ success: false, message: data.error ?? "Failed to refresh" });
      }
    } catch {
      setResult({ success: false, message: "Network error" });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Media Cache</p>
          <p className="text-xs text-muted-foreground">
            {cachedVideos} videos cached
            {lastRefresh && ` · Last refresh: ${new Date(lastRefresh).toLocaleString()}`}
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} size="sm" variant="outline" className="gap-2">
          {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {isRefreshing ? "Refreshing..." : "Refresh from Coverr"}
        </Button>
      </div>
      {result && (
        <div className={`flex items-center gap-2 text-xs ${result.success ? "text-green-500" : "text-red-500"}`}>
          {result.success ? <CheckCircle className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
          {result.message}
        </div>
      )}
    </div>
  );
}
