import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getReferralStats } from "@/actions/wallet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Gift } from "lucide-react";
import { CopyReferralButton } from "@/components/wallet/copy-referral-button";
import { formatDate } from "@/lib/utils";

export default async function ReferralsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const stats = await getReferralStats();

  const referralLink = `${process.env.AUTH_URL ?? "http://localhost:3000"}/auth/register?ref=${encodeURIComponent(stats?.referralCode ?? "")}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Referrals</h1>
        <p className="text-muted-foreground">Earn bonuses by referring friends to the platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.referrals.length ?? 0}</div>
            <p className="text-xs text-muted-foreground">People you have referred</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">KES {Number(stats?.walletBalance ?? 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From referral bonuses</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link — you earn a bonus when each person activates their account</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono break-all">
            {referralLink}
          </code>
          <CopyReferralButton text={referralLink} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referred Users</CardTitle>
          <CardDescription>People who signed up using your referral link</CardDescription>
        </CardHeader>
        <CardContent>
          {!stats?.referrals.length ? (
            <p className="py-8 text-center text-muted-foreground">No referrals yet. Share your link to get started!</p>
          ) : (
            <div className="space-y-3">
              {stats.referrals.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium">{ref.name ?? ref.email}</p>
                    <p className="text-sm text-muted-foreground">{ref.email}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(ref.createdAt)}</p>
                  </div>
                  <Badge variant={ref.isActive ? "default" : "secondary"}>
                    {ref.isActive ? "Active" : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
