"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelativeTime } from "@/lib/utils";

export function NotificationsDropdown() {
  const [notifications] = useState<
    Array<{ id: string; title: string; message: string; read: boolean; createdAt: Date }>
  >([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <h4 className="font-semibold">Notifications</h4>
          {notifications.length > 0 && (
            <Link
              href="/notifications"
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`border-b px-6 py-4 last:border-0 ${
                  !n.read ? "bg-primary/5" : ""
                }`}
              >
                <p className="font-medium text-sm">{n.title}</p>
                <p className="text-muted-foreground text-xs">{n.message}</p>
                <p className="mt-1 text-muted-foreground text-xs">
                  {formatRelativeTime(n.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
