import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WithdrawForm } from "@/components/wallet/withdraw-form";
import { Wallet, Clock, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function WithdrawPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isActive: true, walletBalance: true },
  });

  const [settings, pendingWithdrawals] = await Promise.all([
    prisma.globalSettings.findFirst({
      select: { minWithdrawalAmount: true },
    }),
    prisma.transaction.findMany({
      where: { userId: session.user.id, type: "WITHDRAWAL", status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, amount: true, status: true, createdAt: true },
    }),
  ]);

  const minWithdrawal = Number(settings?.minWithdrawalAmount ?? 500);
  const balance = Number(user?.walletBalance ?? 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Withdraw Funds</h1>
        <p className="text-sm text-muted-foreground">Send your earnings to M-Pesa</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Withdraw Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Withdraw to M-Pesa</CardTitle>
            </div>
            <CardDescription>
              Balance: <strong>KES {balance.toLocaleString()}</strong>
              {" · "}Min: <strong>KES {minWithdrawal.toLocaleString()}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!user?.isActive ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <AlertTriangle className="h-10 w-10 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Account Not Activated</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Activate your account to enable withdrawals
                  </p>
                </div>
                <Link
                  href="/activate"
                  className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Activate Now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : balance < minWithdrawal ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <Wallet className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Insufficient Balance</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    You need at least KES {minWithdrawal.toLocaleString()} to withdraw.
                    Current balance: KES {balance.toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <WithdrawForm balance={balance} minWithdrawal={minWithdrawal} />
            )}
          </CardContent>
        </Card>

        {/* Info + Pending Withdrawals */}
        <div className="space-y-4">
          {/* How it works */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">How Withdrawals Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">1</span>
                Enter your Safaricom M-Pesa number and amount
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">2</span>
                Your withdrawal goes to <strong className="text-foreground">pending</strong> review
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">3</span>
                Once approved, funds are sent to your M-Pesa instantly
              </div>
            </CardContent>
          </Card>

          {/* Pending Withdrawals */}
          {pendingWithdrawals.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  Pending Withdrawals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pendingWithdrawals.map((w) => (
                  <div key={w.id} className="flex items-center justify-between rounded-lg border border-border/60 p-2.5">
                    <div>
                      <p className="text-sm font-medium">KES {Number(w.amount).toLocaleString()}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(w.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-[11px] font-medium text-yellow-500">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
