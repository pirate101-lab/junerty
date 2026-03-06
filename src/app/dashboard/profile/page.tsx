import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Your account information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Your profile details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={session.user?.image ?? undefined} />
              <AvatarFallback className="text-2xl">
                {session.user?.name?.[0] ?? session.user?.email?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <p className="text-lg font-semibold">
                {session.user?.name ?? "—"}
              </p>
              <p className="text-muted-foreground">
                {session.user?.email}
              </p>
              {session.user?.role && (
                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                  {session.user.role}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
