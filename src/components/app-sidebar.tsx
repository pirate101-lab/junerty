"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  User,
  Settings,
  Wallet,
  Users,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/referrals", label: "Referrals", icon: Users },
];

const accountNavItems = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

const adminNavItem = { href: "/admin", label: "Admin Panel", icon: ShieldCheck };

interface AppSidebarProps {
  isAdmin?: boolean;
  onClose?: () => void;
}

function NavGroup({
  label,
  items,
  pathname,
  onClose,
}: {
  label: string;
  items: typeof mainNavItems;
  pathname: string;
  onClose?: () => void;
}) {
  return (
    <div className="mb-4">
      <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        {label}
      </p>
      {items.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 my-0.5",
              isActive
                ? "bg-primary/15 text-primary nav-active-glow"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            )}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-primary" />
            )}
            <item.icon
              className={cn(
                "h-4 w-4 shrink-0",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function AppSidebar({ isAdmin = false, onClose }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <Link
          href="/dashboard"
          onClick={onClose}
          className="brand-gradient text-lg font-extrabold tracking-wide"
        >
          SYNTHGRAPHIX
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 pt-4">
        <NavGroup
          label="Main"
          items={mainNavItems}
          pathname={pathname}
          onClose={onClose}
        />
        <NavGroup
          label="Account"
          items={accountNavItems}
          pathname={pathname}
          onClose={onClose}
        />
        {isAdmin && (
          <NavGroup
            label="Admin"
            items={[adminNavItem]}
            pathname={pathname}
            onClose={onClose}
          />
        )}
      </nav>

      {/* Footer brand */}
      <div className="border-t border-sidebar-border px-5 py-3">
        <p className="text-[11px] text-muted-foreground/50">
          © 2025 SYNTHGRAPHIX
        </p>
      </div>
    </aside>
  );
}
