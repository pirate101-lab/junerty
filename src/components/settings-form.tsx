"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsFormProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully" });
        router.refresh();
      } else {
        setMessage({ type: "error", text: data.error ?? "Failed to update" });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.type === "success"
              ? "bg-green-500/10 text-green-600 dark:text-green-400"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={user.email ?? ""}
          disabled
          className="opacity-70"
        />
        <p className="text-xs text-muted-foreground">
          Email cannot be changed.
        </p>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
