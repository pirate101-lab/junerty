import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your account information
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Email</h4>
            <p className="text-muted-foreground">{session?.user?.email}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Name</h4>
            <p className="text-muted-foreground">
              {session?.user?.name || "Not set"}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Role</h4>
            <p className="text-muted-foreground">{session?.user?.role || "USER"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <p className="text-sm text-muted-foreground">
            Customize how the app looks
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm">Theme</span>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
