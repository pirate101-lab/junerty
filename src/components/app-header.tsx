"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, Bell, Menu, User, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { getNotifications, markNotificationRead } from "@/actions/notifications";
import type { Notification } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/sidebar-context";
import { BrandLogo } from "@/components/brand-logo";
import { useTheme } from "@/components/theme-provider";

export function AppHeader() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const { toggle: toggleSidebar } = useSidebar();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = useCallback(async () => {
    const data = await getNotifications();
    setNotifications(data);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadNotifications();
    }, 0);
    return () => window.clearTimeout(timer);
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
  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <>
      <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-background/95 px-4 backdrop-blur-sm md:px-6">
        {/* Left: mobile hamburger + brand */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <BrandLogo size={28} className="md:hidden" />
        </div>

        {/* Center: desktop search */}
        <div className="hidden flex-1 md:flex">
          <Button
            variant="outline"
            className="relative h-9 w-72 justify-start rounded-full border-border/60 bg-muted/40 text-sm text-muted-foreground transition-all hover:bg-muted/60 hover:text-foreground"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="absolute left-3 h-4 w-4" />
            <span className="ml-6">Search...</span>
            <kbd className="pointer-events-none absolute right-3 hidden h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium sm:flex">
              ⌘K
            </kbd>
          </Button>
        </div>

        {/* Right: action icons */}
        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <span className="text-sm font-semibold">Notifications</span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No notifications yet
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "cursor-pointer border-b border-border/50 px-4 py-3 transition-colors hover:bg-accent/50",
                        !n.read && "bg-primary/5"
                      )}
                      onClick={async () => {
                        await markNotificationRead(n.id);
                        loadNotifications();
                      }}
                    >
                      {!n.read && (
                        <span className="mb-1 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        </span>
                      )}
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="ml-1 flex h-9 items-center gap-2 rounded-lg px-1.5 hover:bg-accent/50"
              >
                <Avatar className="h-7 w-7 shrink-0 border border-primary/30">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-[10px] font-bold text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start md:flex">
                  <span className="text-xs font-semibold leading-none">
                    {session?.user?.name ?? "User"}
                  </span>
                  <span className="text-[10px] leading-none text-muted-foreground">
                    {session?.user?.email ?? ""}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <div className="flex items-center gap-3 px-3 py-2.5">
                <Avatar className="h-8 w-8 border border-primary/30">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{session?.user?.name ?? "User"}</p>
                  <p className="text-xs text-muted-foreground">Member</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="mx-auto mt-[15vh] max-w-xl rounded-xl border border-border bg-card p-4 shadow-2xl shadow-primary/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search tasks, wallet, referrals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-sm"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
              >
                ESC
              </button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Search for tasks, wallet transactions, or referrals
            </p>
          </div>
        </div>
      )}
    </>
  );
}
