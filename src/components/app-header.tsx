"use client";

import { useState, useCallback, useEffect } from "react";
import { Menu, Search, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/actions/notifications";
import type { Notification } from "@prisma/client";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = useCallback(async () => {
    const data = await getNotifications();
    setNotifications(data);
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function toggleSidebar() {
    const btn = document.getElementById("sidebar-toggle-hidden");
    if (btn) btn.click();
  }

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-background/95 backdrop-blur-sm px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="relative h-9 w-48 justify-start text-sm text-muted-foreground sm:pr-12 sm:w-64 md:w-80"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="absolute left-3 h-4 w-4" />
          <span className="ml-5">Search tasks...</span>
          <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="text-sm font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-auto py-1"
                  onClick={async () => {
                    await markAllNotificationsRead();
                    loadNotifications();
                  }}
                >
                  Mark all read
                </Button>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Bell className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "cursor-pointer border-b border-border px-4 py-3 transition-colors hover:bg-accent",
                      !n.read && "bg-accent/50"
                    )}
                    onClick={async () => {
                      await markNotificationRead(n.id);
                      loadNotifications();
                    }}
                  >
                    <p className="font-medium text-sm">{n.title}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {n.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="mx-auto mt-[15vh] max-w-xl rounded-xl border border-border bg-card p-0 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search tasks, pages, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-0 focus-visible:ring-0 shadow-none"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Quick actions
              </p>
              <div className="space-y-1">
                {[
                  { label: "Go to Dashboard", href: "/dashboard" },
                  { label: "View Tasks", href: "/tasks" },
                  { label: "Check Wallet", href: "/wallet" },
                  { label: "My Referrals", href: "/referrals" },
                  { label: "Settings", href: "/settings" },
                ]
                  .filter((item) =>
                    searchQuery
                      ? item.label
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      : true
                  )
                  .map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setSearchOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
