"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandLogo } from "@/components/brand-logo";
import { ArrowRight, Eye, EyeOff, Gift, Star, TrendingUp } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") ?? "";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, referralCode: refCode || undefined }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Registration failed");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Account created but sign in failed. Please try logging in.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      {/* ── Left decorative panel (hidden on mobile) ── */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between">
        {/* Full gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-violet-950 to-slate-950" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        {/* Glow orbs */}
        <div className="pointer-events-none absolute -right-20 top-1/3 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -left-16 bottom-1/4 h-[22rem] w-[22rem] rounded-full bg-violet-500/15 blur-[100px]" />

        <div className="relative z-10 flex flex-1 flex-col justify-between p-10 xl:p-14">
          <BrandLogo href="/" size={44} className="text-white [&_.brand-gradient]:text-white" />

          <div className="space-y-8">
            <h2 className="text-4xl font-black leading-tight tracking-tight text-white xl:text-5xl">
              Start Your
              <br />
              <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                Earning Journey
              </span>
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-white/60">
              Join thousands of Kenyans earning daily by completing simple tasks.
              Zero investment required.
            </p>

            {/* Benefit highlights */}
            <div className="space-y-3">
              {[
                { icon: Gift, label: "Free to join — no fees ever" },
                { icon: TrendingUp, label: "Earn KES 15–55 per task" },
                { icon: Star, label: "Withdraw directly to M-Pesa" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <Icon className="h-4 w-4 text-indigo-300" />
                  </div>
                  <span className="text-sm text-white/70">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} SYNTHGRAPHIX. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="relative flex w-full flex-col items-center justify-center px-4 py-12 sm:px-8 lg:w-1/2">
        {/* Mobile-only gradient blobs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full bg-indigo-600/15 blur-[100px] lg:hidden" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-[260px] w-[260px] rounded-full bg-violet-600/10 blur-[100px] lg:hidden" />

        <div className="relative z-10 w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <BrandLogo href="/" size={56} className="flex-col gap-2" />
          </div>

          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign up for free and start earning today
            </p>
          </div>

          {/* Referral banner */}
          {refCode && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm">
              <Gift className="h-[18px] w-[18px] shrink-0 text-emerald-400" />
              <span className="text-emerald-300">
                🎉 Invited by a friend! You&apos;ll both earn a bonus.
              </span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                disabled={loading}
                className="h-12 rounded-xl border-border/60 bg-muted/30 px-4 text-base placeholder:text-muted-foreground/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={loading}
                className="h-12 rounded-xl border-border/60 bg-muted/30 px-4 text-base placeholder:text-muted-foreground/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                  disabled={loading}
                  className="h-12 rounded-xl border-border/60 bg-muted/30 px-4 pr-11 text-base placeholder:text-muted-foreground/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground/50">Must be at least 8 characters</p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="group h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-base font-bold text-white shadow-xl shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create Account
                  <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
                </span>
              )}
            </Button>

            <p className="text-center text-[11px] text-muted-foreground/50">
              By signing up, you agree to our{" "}
              <Link href="#" className="underline hover:text-muted-foreground">Terms</Link>
              {" "}and{" "}
              <Link href="#" className="underline hover:text-muted-foreground">Privacy Policy</Link>
            </p>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-xs text-muted-foreground/60">or</span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          {/* Login link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                Sign in <ArrowRight className="inline h-3.5 w-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
