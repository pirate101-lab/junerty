import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSettingsForm } from "@/components/admin/admin-settings-form";
import { ShieldAlert, Settings2, Users, DollarSign, Wallet } from "lucide-react";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center border-border/60">
          <CardHeader>
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to view this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const settings = await prisma.globalSettings.findFirst();

  const configStats = [
    {
      label: "Activation Fee",
      value: `KES ${Number(settings?.activationFeeAmount ?? 100).toFixed(0)}`,
      icon: Wallet,
      color: "stat-violet",
    },
    {
      label: "Referral Bonus",
      value: `KES ${Number(settings?.referralBonusAmount ?? 100).toFixed(0)}`,
      icon: Users,
      color: "stat-green",
    },
    {
      label: "Min Withdrawal",
      value: `KES ${Number(settings?.minWithdrawalAmount ?? 500).toFixed(0)}`,
      icon: DollarSign,
      color: "stat-teal",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
          <Settings2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure platform-wide financial settings
          </p>
        </div>
      </div>

      {/* Config overview cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {configStats.map((stat) => (
          <Card key={stat.label} className="border-border/60 bg-card shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-md ${stat.color}`}
                >
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="max-w-2xl">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Financial Configuration</CardTitle>
            <CardDescription>
              Update activation fees, referral bonuses, minimum withdrawal limits, and WhatsApp support number
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminSettingsForm
              initialValues={{
                activationFeeAmount: Number(settings?.activationFeeAmount ?? 100),
                referralBonusAmount: Number(settings?.referralBonusAmount ?? 100),
                minWithdrawalAmount: Number(settings?.minWithdrawalAmount ?? 500),
                whatsappNumber: settings?.whatsappNumber ?? "",
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
