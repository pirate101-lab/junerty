import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground mt-1">
          Your recent notifications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>
            {notifications.length} notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No notifications yet
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    n.read ? "bg-muted/30" : "bg-background"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{n.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {n.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatRelativeTime(n.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      n.type === "ERROR"
                        ? "bg-destructive/20 text-destructive"
                        : n.type === "SUCCESS"
                          ? "bg-green-500/20 text-green-600"
                          : n.type === "WARNING"
                            ? "bg-amber-500/20 text-amber-600"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {n.type}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
