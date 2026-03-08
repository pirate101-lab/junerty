"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestWithdrawal } from "@/actions/wallet";
import { Loader2, Smartphone, CheckCircle, AlertCircle } from "lucide-react";

interface WithdrawFormProps {
  balance: number;
  minWithdrawal: number;
}

/** Validate Kenyan phone: 07xxxxxxxx or 01xxxxxxxx */
function isValidPhone(phone: string): boolean {
  return /^0[17]\d{8}$/.test(phone.replace(/\s/g, ""));
}

/** Convert local 07/01 to 254 format */
function toInternational(phone: string): string {
  const clean = phone.replace(/\s/g, "");
  if (clean.startsWith("0")) return "254" + clean.slice(1);
  return clean;
}

export function WithdrawForm({ balance, minWithdrawal }: WithdrawFormProps) {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const phoneValid = phone.length === 0 || isValidPhone(phone);
  const amountNum = Number(amount);
  const amountValid = amount.length === 0 || (amountNum >= minWithdrawal && amountNum <= balance);
  const canSubmit = isValidPhone(phone) && amountNum >= minWithdrawal && amountNum <= balance && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setMessage(null);

    try {
      const result = await requestWithdrawal(toInternational(phone), amountNum, "mpesa");
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

      {/* Payment Method */}
      <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white">
          <Smartphone className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">M-Pesa</p>
          <p className="text-xs text-muted-foreground">Safaricom mobile money</p>
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="phone">M-Pesa Phone Number</Label>
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
          <p className="text-xs text-destructive">Enter a valid Safaricom number starting with 07 or 01</p>
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

      <Button type="submit" className="w-full gap-2" disabled={!canSubmit}>
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
        ) : (
          <>Withdraw via M-Pesa</>
        )}
      </Button>

      <p className="text-center text-[11px] text-muted-foreground">
        Withdrawals go to pending review until your account is activated
      </p>
    </form>
  );
}
