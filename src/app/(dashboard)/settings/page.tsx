import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "@/components/settings-form";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update your profile information and email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm user={session.user} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how the application looks. Automatically switch between light and dark themes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use the theme toggle in the header to switch between light and dark mode.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
