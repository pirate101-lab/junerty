"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateGlobalSettings } from "@/actions/admin";

interface AdminSettingsFormProps {
  initialValues: {
    activationFeeAmount: number;
    referralBonusAmount: number;
    minWithdrawalAmount: number;
    whatsappNumber: string;
  };
}

export function AdminSettingsForm({ initialValues }: AdminSettingsFormProps) {
  const [values, setValues] = useState(initialValues);
  const [whatsappNumber, setWhatsappNumber] = useState(initialValues.whatsappNumber);
  const [lipana, setLipana] = useState({ apiKey: "", secretKey: "", merchantId: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await updateGlobalSettings({
        activationFeeAmount: values.activationFeeAmount,
        referralBonusAmount: values.referralBonusAmount,
        minWithdrawalAmount: values.minWithdrawalAmount,
        whatsappNumber,
        ...(lipana.apiKey && lipana.secretKey && lipana.merchantId ? {
          lipanaApiKey: lipana.apiKey,
          lipanaSecretKey: lipana.secretKey,
          lipanaMerchantId: lipana.merchantId,
        } : {}),
      });
      setMessage({ type: "success", text: "Settings updated successfully!" });
      setLipana({ apiKey: "", secretKey: "", merchantId: "" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to update settings" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`rounded-lg p-3 text-sm ${message.type === "success" ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Fee Configuration</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="activationFee">Activation Fee (KES)</Label>
            <Input
              id="activationFee"
              type="number"
              min={0}
              value={values.activationFeeAmount}
              onChange={(e) => setValues((v) => ({ ...v, activationFeeAmount: Number(e.target.value) }))}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="referralBonus">Referral Bonus (KES)</Label>
            <Input
              id="referralBonus"
              type="number"
              min={0}
              value={values.referralBonusAmount}
              onChange={(e) => setValues((v) => ({ ...v, referralBonusAmount: Number(e.target.value) }))}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minWithdrawal">Min Withdrawal (KES)</Label>
            <Input
              id="minWithdrawal"
              type="number"
              min={0}
              value={values.minWithdrawalAmount}
              onChange={(e) => setValues((v) => ({ ...v, minWithdrawalAmount: Number(e.target.value) }))}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Lipana Payment Credentials</h3>
        <p className="text-xs text-muted-foreground">Leave blank to keep existing credentials. All fields required to update.</p>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="lipanaApiKey">API Key</Label>
            <Input
              id="lipanaApiKey"
              type="password"
              placeholder="Enter Lipana API Key"
              value={lipana.apiKey}
              onChange={(e) => setLipana((v) => ({ ...v, apiKey: e.target.value }))}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lipanaSecretKey">Secret Key</Label>
            <Input
              id="lipanaSecretKey"
              type="password"
              placeholder="Enter Lipana Secret Key"
              value={lipana.secretKey}
              onChange={(e) => setLipana((v) => ({ ...v, secretKey: e.target.value }))}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lipanaMerchantId">Merchant ID</Label>
            <Input
              id="lipanaMerchantId"
              placeholder="Enter Lipana Merchant ID"
              value={lipana.merchantId}
              onChange={(e) => setLipana((v) => ({ ...v, merchantId: e.target.value }))}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Support Settings</h3>
        <div className="space-y-2">
          <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
          <Input
            id="whatsappNumber"
            type="text"
            placeholder="e.g. 254712345678"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground">
            International format without + sign. Leave empty to hide the WhatsApp button.
          </p>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
