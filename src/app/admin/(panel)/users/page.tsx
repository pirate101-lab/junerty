import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Users, UserCheck, UserX, Search, Shield } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      walletBalance: true,
      createdAt: true,
      _count: { select: { transcriptions: true, transactions: true } },
    },
  });

  const totalUsers = await prisma.user.count();
  const activeUsers = await prisma.user.count({ where: { isActive: true } });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-white/30 mb-1">
          <span>Admin</span>
          <span className="text-white/10">/</span>
          <span className="text-white/60">Users</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">User Management</h1>
        <p className="text-sm text-white/40 mt-0.5">View and manage platform users</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-3">
        {[
          {
            label: "Total Users",
            value: totalUsers,
            icon: Users,
            cardClass: "bg-violet-500/[0.05]",
            iconClass: "bg-violet-500/15 text-violet-400",
          },
          {
            label: "Active",
            value: activeUsers,
            icon: UserCheck,
            cardClass: "bg-emerald-500/[0.05]",
            iconClass: "bg-emerald-500/15 text-emerald-400",
          },
          {
            label: "Inactive",
            value: totalUsers - activeUsers,
            icon: UserX,
            cardClass: "bg-amber-500/[0.05]",
            iconClass: "bg-amber-500/15 text-amber-400",
          },
        ].map(({ label, value, icon: Icon, cardClass, iconClass }) => (
          <div key={label} className={`rounded-2xl border border-white/[0.06] ${cardClass} p-5`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/30">{label}</p>
                <p className="mt-2 text-3xl font-bold text-white">{value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-white/30" />
          <h3 className="text-sm font-semibold text-white/80">All Users</h3>
          <span className="ml-auto text-xs text-white/20">Showing latest 50</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["User", "Role", "Status", "Balance", "Tasks", "Joined"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-white/20">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-[11px] font-bold text-white/50">
                        {(u.name ?? u.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/80 truncate max-w-[140px]">{u.name ?? "—"}</p>
                        <p className="text-[10px] text-white/25 truncate max-w-[140px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {u.role === "ADMIN" ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold text-violet-400">
                        <Shield className="h-3 w-3" /> Admin
                      </span>
                    ) : (
                      <span className="text-[11px] text-white/40">User</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                      u.isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? "bg-emerald-400" : "bg-amber-400"}`} />
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-white/70">
                    KES {Number(u.walletBalance).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-xs text-white/40">
                    {u._count.transcriptions} tasks
                  </td>
                  <td className="py-3 px-4 text-[11px] text-white/25">
                    {formatDate(u.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
