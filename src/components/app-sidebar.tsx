"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  User,
  Settings,
  LogOut,
  Wallet,
  Users,
  ShieldCheck,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const baseNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/referrals", label: "Referrals", icon: Users },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

const adminNavItem = { href: "/admin", label: "Admin", icon: ShieldCheck };

interface AppSidebarProps {
  isAdmin?: boolean;
  onClose?: () => void;
}

export function AppSidebar({ isAdmin = false, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const navItems = isAdmin ? [...baseNavItems, adminNavItem] : baseNavItems;

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card dark:bg-[#0c0c20]">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Link
          href="/dashboard"
          className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-lg font-bold tracking-wide text-transparent"
          onClick={onClose}
        >
          SYNTHGRAPHIX
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "border-l-[3px] border-primary bg-accent/60 text-foreground"
                  : "border-l-[3px] border-transparent text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4 space-y-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 rounded-xl text-muted-foreground transition-all duration-200 hover:bg-accent/80 hover:text-accent-foreground"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
