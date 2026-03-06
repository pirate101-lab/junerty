"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { NotificationsDropdown } from "@/components/notifications-dropdown";

interface AppHeaderProps {
  user?: { name?: string | null; email?: string | null; image?: string | null };
}

export function AppHeader({ user }: AppHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b px-4 md:px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9"
            onFocus={() => setSearchOpen(true)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationsDropdown />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <span className="sr-only">User menu</span>
              {user?.image ? (
                <img
                  src={user.image}
                  alt=""
                  className="h-9 w-9 rounded-full"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name ?? "User"}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
