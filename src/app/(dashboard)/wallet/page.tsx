import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WalletIcon, TrendingUp, Users } from "lucide-react";
import { CopyReferralButton } from "@/components/wallet/copy-referral-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

const TX_TYPE_LABELS: Record<string, string> = {
  ACTIVATION: "Activation Fee",
  REFERRAL_BONUS: "Referral Bonus",
  WITHDRAWAL: "Withdrawal",
  DEPOSIT: "Deposit",
};

const TX_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  COMPLETED: "bg-green-500/10 text-green-500",
  FAILED: "bg-red-500/10 text-red-500",
  CANCELLED: "bg-gray-500/10 text-gray-500",
};

export default async function WalletPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      isActive: true,
      walletBalance: true,
      referralCode: true,
      _count: { select: { referrals: true } },
    },
  });

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const referralLink = `${process.env.AUTH_URL ?? "http://localhost:3000"}/auth/register?ref=${encodeURIComponent(user?.referralCode ?? "")}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">Manage your balance and transactions</p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <WalletIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">KES {Number(user?.walletBalance ?? 0).toFixed(2)}</div>
            <div className="mt-2 flex gap-2">
              {!user?.isActive ? (
                <Link href="/activate">
                  <Button size="sm" variant="outline">Activate Account</Button>
                </Link>
              ) : (
                <Link href="/withdraw">
                  <Button size="sm" variant="outline">Withdraw</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.isActive ? (
                <span className="text-green-500">Active</span>
              ) : (
                <span className="text-yellow-500">Inactive</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {user?.isActive
                ? "You can receive referral bonuses and withdraw"
                : "Pay activation fee to unlock all features"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{user?._count.referrals ?? 0}</div>
            <Link href="/referrals">
              <p className="text-xs text-primary hover:underline cursor-pointer mt-1">View referrals →</p>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link to earn referral bonuses when friends activate</CardDescription>
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
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent wallet activity</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No transactions yet.</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border p-4 gap-3">
                  <div>
                    <p className="font-medium">{TX_TYPE_LABELS[tx.type] ?? tx.type}</p>
                    <p className="text-sm text-muted-foreground">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(tx.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-sm font-semibold ${tx.type === "WITHDRAWAL" ? "text-red-500" : "text-green-500"}`}>
                      {tx.type === "WITHDRAWAL" ? "-" : "+"}KES {Number(tx.amount).toFixed(2)}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TX_STATUS_COLORS[tx.status] ?? ""}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
