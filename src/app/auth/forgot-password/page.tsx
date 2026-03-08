"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrandLogo } from "@/components/brand-logo";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted p-4">
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-purple-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[380px] w-[380px] rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-pink-500/10 blur-[100px]" />

        <div className="relative z-10 w-full max-w-md">
          {/* SYNTHGRAPHIX branding */}
          <div className="mb-8 flex justify-center">
            <BrandLogo size={72} className="flex-col gap-2" />
          </div>

          <Card className="border border-border/50 bg-card/80 shadow-2xl backdrop-blur-xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
              <CardDescription>
                If an account exists with that email, we&apos;ve sent password
                reset instructions.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/auth/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Back to sign in
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted p-4">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-purple-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[380px] w-[380px] rounded-full bg-blue-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-pink-500/10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* SYNTHGRAPHIX branding */}
        <div className="mb-8 flex justify-center">
          <BrandLogo size={72} className="flex-col gap-2" />
        </div>

        <Card className="border border-border/50 bg-card/80 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you reset instructions
            </CardDescription>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </Button>
              <Link
                href="/auth/login"
                className="text-center text-sm text-muted-foreground hover:text-primary"
              >
                Back to sign in
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
