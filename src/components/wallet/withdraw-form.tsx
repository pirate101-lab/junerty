"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestWithdrawal } from "@/actions/wallet";
import { Loader2, Smartphone, CheckCircle, AlertCircle, Lock } from "lucide-react";

type PayMethod = "mpesa" | "airtel";

interface WithdrawFormProps {
  balance: number;
  minWithdrawal: number;
  isActive: boolean;
}

function isValidPhone(phone: string): boolean {
  return /^0[17]\d{8}$/.test(phone.replace(/\s/g, ""));
}

function toInternational(phone: string): string {
  const clean = phone.replace(/\s/g, "");
  if (clean.startsWith("0")) return "254" + clean.slice(1);
  return clean;
}

export function WithdrawForm({ balance, minWithdrawal, isActive }: WithdrawFormProps) {
  const [method, setMethod] = useState<PayMethod>("mpesa");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const phoneValid = phone.length === 0 || isValidPhone(phone);
  const amountNum = Number(amount);
  const amountValid = amount.length === 0 || (amountNum >= minWithdrawal && amountNum <= balance);
  const canSubmit = isActive && isValidPhone(phone) && amountNum >= minWithdrawal && amountNum <= balance && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setMessage(null);

    try {
      const result = await requestWithdrawal(toInternational(phone), amountNum, method);
      setMessage({ type: "success", text: result.message || "Withdrawal request submitted! It will be processed shortly." });
      setPhone("");
      setAmount("");
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Withdrawal failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {message && (
        <div className={`flex items-start gap-2.5 rounded-lg p-3 text-sm ${
          message.type === "success" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-destructive/10 text-destructive"
        }`}>
          {message.type === "success" ? <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" /> : <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />}
          {message.text}
        </div>
      )}

      {/* Payment Method Selector */}
      <div className="space-y-1.5">
        <Label>Payment Method</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMethod("mpesa")}
            className={`flex items-center gap-2.5 rounded-xl border-2 p-3 transition-all ${
              method === "mpesa"
                ? "border-green-500 bg-green-500/10"
                : "border-border hover:border-muted-foreground/30"
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white shrink-0">
              <Smartphone className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">M-Pesa</p>
              <p className="text-[10px] text-muted-foreground">Safaricom</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setMethod("airtel")}
            className={`flex items-center gap-2.5 rounded-xl border-2 p-3 transition-all ${
              method === "airtel"
                ? "border-red-500 bg-red-500/10"
                : "border-border hover:border-muted-foreground/30"
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white shrink-0">
              <Smartphone className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Airtel Money</p>
              <p className="text-[10px] text-muted-foreground">Airtel Kenya</p>
            </div>
          </button>
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="phone">{method === "mpesa" ? "M-Pesa" : "Airtel Money"} Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="numeric"
          placeholder="07XXXXXXXX or 01XXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
          required
          disabled={loading}
          className={!phoneValid ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {!phoneValid && (
          <p className="text-xs text-destructive">Enter a valid number starting with 07 or 01</p>
        )}
      </div>

      {/* Amount */}
      <div className="space-y-1.5">
        <Label htmlFor="amount">Amount (KES)</Label>
        <Input
          id="amount"
          type="number"
          inputMode="numeric"
          placeholder={minWithdrawal.toString()}
          min={minWithdrawal}
          max={balance}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          disabled={loading}
          className={!amountValid ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Min: KES {minWithdrawal.toLocaleString()}</span>
          <span>Balance: KES {balance.toLocaleString()}</span>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full gap-2"
        disabled={!canSubmit}
      >
        {!isActive ? (
          <><Lock className="h-4 w-4" /> Activate Account to Withdraw</>
        ) : loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
        ) : (
          <>Withdraw via {method === "mpesa" ? "M-Pesa" : "Airtel Money"}</>
        )}
      </Button>

      <p className="text-center text-[11px] text-muted-foreground">
        {!isActive
          ? "Your account must be activated before you can withdraw"
          : "Withdrawals go to pending review and are processed within 24 hours"}
      </p>
    </form>
  );
}
