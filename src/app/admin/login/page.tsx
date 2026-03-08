"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandLogo } from "@/components/brand-logo";
import { Eye, EyeOff, ShieldCheck, Lock } from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/dashboard";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid admin credentials");
      setLoading(false);
      return;
    }

    // Verify admin role via API
    const res = await fetch("/api/auth/check-role");
    const data = await res.json().catch(() => ({ role: "USER" }));

    if (data.role !== "ADMIN") {
      await signOut({ redirect: false });
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-950">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-600/8 blur-[160px]" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-600/8 blur-[140px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h1v1H0zM20 0h1v1h-1zM0 20h1v1H0zM20 20h1v1h-1z'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* Centered form */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          {/* Logo + Admin badge */}
          <div className="mb-10 flex flex-col items-center gap-4">
            <BrandLogo href="/" size={52} className="flex-col gap-2.5 [&_.brand-gradient]:text-white" />
            <div className="flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-xs font-semibold tracking-wider text-violet-300 uppercase">Admin Console</span>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 ring-1 ring-violet-500/10">
                <Lock className="h-6 w-6 text-violet-400" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white">Admin Sign In</h1>
              <p className="mt-1.5 text-sm text-white/40">Restricted access — authorized personnel only</p>
            </div>

            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-white/40">
                  Admin Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@platform.dev"
                  required
                  disabled={loading}
                  className="h-12 rounded-xl border-white/[0.08] bg-white/[0.04] px-4 text-base text-white placeholder:text-white/20 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-white/40">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPw ? "text" : "password"}
                    required
                    disabled={loading}
                    className="h-12 rounded-xl border-white/[0.08] bg-white/[0.04] px-4 pr-11 text-base text-white placeholder:text-white/20 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-base font-bold text-white shadow-xl shadow-violet-500/20 transition-all hover:shadow-violet-500/35 hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Authenticating…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-[18px] w-[18px]" />
                    Access Admin Panel
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-white/20">
            SYNTHGRAPHIX Admin Console · Secure Access
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <div className="animate-pulse text-white/40">Loading…</div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
