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
import { BrandLogo } from "@/components/brand-logo";

export default async function LandingPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <BrandLogo href="/" size={32} />
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-sm">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="sm"
                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-sm text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-violet-600/15 blur-[130px]" />
        <div className="pointer-events-none absolute -right-40 top-0 h-[30rem] w-[30rem] rounded-full bg-indigo-600/15 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
          <p className="mb-4 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-violet-400 sm:text-sm">
            ⚡ Next-Generation Earning Platform
          </p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Earn Real Money
            <br />
            <span className="brand-gradient">
              Complete Tasks &amp; Grow
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            SYNTHGRAPHIX is the all-in-one digital earning platform. Complete
            tasks, refer friends, manage your wallet, and withdraw your earnings
            — all from one powerful dashboard.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 px-8 text-base font-semibold text-white shadow-xl shadow-violet-500/30 transition-all hover:shadow-violet-500/50"
              >
                Start Earning Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="border-border/60 px-8 text-base"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/40 bg-muted/20">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 md:gap-8 md:py-10">
          {[
            { value: "10K+", label: "Active Members" },
            { value: "KES 5M+", label: "Total Earned" },
            { value: "500+", label: "Daily Tasks" },
            { value: "24/7", label: "Support" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="brand-gradient text-2xl font-extrabold sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
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
              <span className="brand-gradient">Earn &amp; Grow</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Powerful tools designed to maximize your earnings on the
              SYNTHGRAPHIX platform.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: CheckSquare,
                title: "Task Management",
                description:
                  "Complete daily tasks to earn real money. Track progress and unlock new earning opportunities every day.",
                color: "from-violet-500/20 to-violet-600/20",
                iconColor: "text-violet-400",
              },
              {
                icon: Wallet,
                title: "Wallet & Payments",
                description:
                  "Manage your earnings in real-time. Instant deposits and fast withdrawals to your M-Pesa wallet.",
                color: "from-teal-500/20 to-teal-600/20",
                iconColor: "text-teal-400",
              },
              {
                icon: Users,
                title: "Referral System",
                description:
                  "Earn bonus commissions by referring friends. Multi-tier referral tracking with automated payouts.",
                color: "from-orange-500/20 to-orange-600/20",
                iconColor: "text-orange-400",
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description:
                  "Visualize your earnings, referrals, and growth with interactive charts and real-time data.",
                color: "from-blue-500/20 to-blue-600/20",
                iconColor: "text-blue-400",
              },
              {
                icon: Shield,
                title: "Secure Platform",
                description:
                  "Bank-grade encryption and secure sessions protect your account and your hard-earned money.",
                color: "from-green-500/20 to-green-600/20",
                iconColor: "text-green-400",
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                description:
                  "Round-the-clock customer support via WhatsApp, email, and live chat. We're always here.",
                color: "from-pink-500/20 to-pink-600/20",
                iconColor: "text-pink-400",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color}`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
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
      <section className="border-y border-border/40 bg-muted/10 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Start Earning in{" "}
              <span className="brand-gradient">3 Simple Steps</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join SYNTHGRAPHIX and start earning real money today.
            </p>
          </div>

          <div className="relative mt-16">
            {/* Connecting line */}
            <div className="absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-violet-500 via-indigo-500 to-purple-500 md:left-1/2 md:block md:-translate-x-px" />

            <div className="space-y-12 md:space-y-16">
              {[
                {
                  step: "01",
                  title: "Create Your Account",
                  description:
                    "Sign up for free in under a minute. Just your name, email, and a password to get started.",
                },
                {
                  step: "02",
                  title: "Activate Your Wallet",
                  description:
                    "Make your first deposit to activate your wallet and unlock all platform earning features.",
                },
                {
                  step: "03",
                  title: "Earn & Withdraw",
                  description:
                    "Complete tasks, refer friends, and watch your earnings grow. Withdraw anytime to your M-Pesa.",
                },
              ].map((item, index) => (
                <div
                  key={item.step}
                  className={`relative flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-8 ${
                    index % 2 === 1 ? "md:flex-row-reverse md:text-right" : ""
                  }`}
                >
                  <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-xl shadow-violet-500/30 md:mx-auto">
                    {item.step}
                  </div>
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-indigo-600/10 to-purple-600/10" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-[24rem] w-[24rem] rounded-full bg-violet-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute -top-20 -left-20 h-[24rem] w-[24rem] rounded-full bg-indigo-600/15 blur-[120px]" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-2xl shadow-violet-500/30">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Ready to Start
            <br />
            <span className="brand-gradient">Earning Today?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join thousands of members already earning on SYNTHGRAPHIX. Your
            journey to financial growth starts with a single click.
          </p>
          <Link href="/auth/register" className="mt-8 inline-block">
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 px-10 text-base font-semibold text-white shadow-2xl shadow-violet-500/30 transition-all hover:shadow-violet-500/50"
            >
              Create Free Account
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <BrandLogo size={24} />
              <p className="text-xs text-muted-foreground">
                © 2025 SYNTHGRAPHIX. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-5">
              {["Terms", "Privacy", "Support"].map((link) => (
                <span
                  key={link}
                  className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
