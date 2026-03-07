import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSettingsForm } from "@/components/admin/admin-settings-form";
import { ShieldAlert } from "lucide-react";

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
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <ShieldAlert className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to view this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const settings = await prisma.globalSettings.findFirst();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">Configure platform-wide financial settings</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Financial Settings</CardTitle>
            <CardDescription>
              Configure activation fees, referral bonuses, and payment gateway credentials
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
