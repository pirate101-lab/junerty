import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Wallet,
  Users,
  BarChart3,
  CheckSquare,
  Shield,
  Headphones,
  Zap,
} from "lucide-react";

export default async function LandingPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-lg font-extrabold tracking-wider text-transparent sm:text-xl">
              SYNTHGRAPHIX
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-sm">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="text-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 top-10 h-[24rem] w-[24rem] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[20rem] w-[20rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
          <p className="mb-4 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-cyan-400 sm:text-sm">
            Next-Generation Business Platform
          </p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            The Future of
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Digital Business
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            SYNTHGRAPHIX is the all-in-one digital platform engineered for
            business growth. Manage your wallet, track analytics, build referral
            networks, and scale — all from a single dashboard.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-xl hover:shadow-cyan-500/30"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="border-border/60 text-base"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/40 bg-muted/30 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 md:gap-8 md:py-10">
          {[
            { value: "Growing", label: "Community" },
            { value: "Secure", label: "Payments" },
            { value: "Always", label: "Available" },
            { value: "24/7", label: "Support" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Powerful tools designed to help you grow your business on the
              SYNTHGRAPHIX platform.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Wallet,
                title: "Wallet & Payments",
                description:
                  "Deposit, withdraw, and transfer funds seamlessly. Real-time balance tracking with full transaction history.",
              },
              {
                icon: Users,
                title: "Referral System",
                description:
                  "Grow your network and earn rewards. Multi-tier referral tracking with automated commission payouts.",
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description:
                  "Visualize earnings, referrals, and growth with interactive charts. Make data-driven decisions.",
              },
              {
                icon: CheckSquare,
                title: "Task Management",
                description:
                  "Complete daily tasks to earn rewards. Track progress and unlock new earning opportunities.",
              },
              {
                icon: Shield,
                title: "Secure Platform",
                description:
                  "Bank-grade encryption, two-factor authentication, and secure sessions protect your account and funds.",
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                description:
                  "Round-the-clock customer support via chat, email, and phone. We are always here to help you.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/30 hover:bg-card/80 hover:shadow-lg hover:shadow-cyan-500/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20">
                  <feature.icon className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border/40 bg-muted/20 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get Started in{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                3 Simple Steps
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join SYNTHGRAPHIX and start growing your digital business today.
            </p>
          </div>

          <div className="relative mt-16">
            {/* Connecting line */}
            <div className="absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-cyan-500 via-blue-500 to-indigo-500 md:left-1/2 md:block md:-translate-x-px" />

            <div className="space-y-12 md:space-y-16">
              {[
                {
                  step: "01",
                  title: "Sign Up",
                  description:
                    "Create your free SYNTHGRAPHIX account in under a minute. Just your name, email, and a password.",
                },
                {
                  step: "02",
                  title: "Activate Your Account",
                  description:
                    "Make your first deposit to activate your wallet and unlock all platform features and earning tools.",
                },
                {
                  step: "03",
                  title: "Earn & Grow",
                  description:
                    "Complete tasks, refer friends, and watch your earnings grow. Withdraw anytime to your mobile wallet.",
                },
              ].map((item, index) => (
                <div
                  key={item.step}
                  className={`relative flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-8 ${
                    index % 2 === 1 ? "md:flex-row-reverse md:text-right" : ""
                  }`}
                >
                  {/* Step number */}
                  <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 md:mx-auto">
                    {item.step}
                  </div>

                  {/* Content */}
                  <div className="flex-1 rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm md:max-w-[calc(50%-3rem)]">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-indigo-600/10" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-[20rem] w-[20rem] rounded-full bg-cyan-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute -top-20 -left-20 h-[20rem] w-[20rem] rounded-full bg-blue-600/15 blur-[100px]" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Zap className="mx-auto mb-4 h-10 w-10 text-cyan-400" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Ready to Grow Your
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Digital Business?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join thousands of entrepreneurs already building and earning on
            SYNTHGRAPHIX. Your journey starts with a single click.
          </p>
          <Link href="/auth/register" className="mt-8 inline-block">
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-xl hover:shadow-cyan-500/30"
            >
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/80 py-10 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-lg font-extrabold tracking-wider text-transparent">
                SYNTHGRAPHIX
              </span>
              <p className="text-xs text-muted-foreground">
                © 2025 SYNTHGRAPHIX. All rights reserved.
              </p>
            </div>

            {/* Social links placeholders */}
            <div className="flex items-center gap-4">
              {["Twitter", "Discord", "GitHub"].map((social) => (
                <span
                  key={social}
                  className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {social}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
