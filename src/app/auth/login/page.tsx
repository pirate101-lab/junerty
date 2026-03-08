"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandLogo } from "@/components/brand-logo";
import { ArrowRight, Eye, EyeOff, Zap, Shield, Users } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
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
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      {/* ── Left decorative panel (hidden on mobile) ── */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between">
        {/* Full gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        {/* Glow orbs */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-16 bottom-1/4 h-[22rem] w-[22rem] rounded-full bg-indigo-500/15 blur-[100px]" />

        <div className="relative z-10 flex flex-1 flex-col justify-between p-10 xl:p-14">
          <BrandLogo href="/" size={44} className="text-white [&_.brand-gradient]:text-white" />

          <div className="space-y-8">
            <h2 className="text-4xl font-black leading-tight tracking-tight text-white xl:text-5xl">
              Welcome
              <br />
              <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
                Back!
              </span>
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-white/60">
              Sign in and continue earning. Your tasks and wallet balance are waiting for you.
            </p>

            {/* Floating trust badges */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Shield, label: "Secure Login" },
                { icon: Zap, label: "Instant Access" },
                { icon: Users, label: "10K+ Active" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs font-medium text-white/70">{label}</span>
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
        <div className="pointer-events-none absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full bg-violet-600/15 blur-[100px] lg:hidden" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-[260px] w-[260px] rounded-full bg-indigo-600/10 blur-[100px] lg:hidden" />

        <div className="relative z-10 w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <BrandLogo href="/" size={56} className="flex-col gap-2" />
          </div>

          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Sign In
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your credentials to access your dashboard
            </p>
          </div>

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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  required
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
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="group h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-base font-bold text-white shadow-xl shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-xs text-muted-foreground/60">or</span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          {/* Register link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                Create one free <ArrowRight className="inline h-3.5 w-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading…</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
