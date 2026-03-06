"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/actions/profile";
import { toast } from "sonner";

interface ProfileEditFormProps {
  currentName: string;
}

export function ProfileEditForm({ currentName }: ProfileEditFormProps) {
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ name: name.trim() });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-border pt-6">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Edit Profile
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Display Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            disabled={loading}
          />
        </div>
      </div>
      <Button type="submit" disabled={loading || name === currentName}>
        {loading ? "Saving..." : "Update Profile"}
      </Button>
    </form>
  );
}
