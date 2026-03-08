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
  Star,
  TrendingUp,
  Play,
  Coins,
  ChevronRight,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export default async function LandingPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <BrandLogo href="/" size={32} />
          <nav className="hidden items-center gap-8 md:flex">
            {["Features", "How It Works", "Earnings"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, "-")}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-sm">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-sm text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-24 sm:pt-40 sm:pb-32">
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full bg-violet-600/20 blur-[160px] animate-pulse" />
        <div className="pointer-events-none absolute -right-32 top-20 h-[32rem] w-[32rem] rounded-full bg-indigo-500/15 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-purple-500/10 blur-[120px]" />

        {/* Grid pattern overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-xs font-semibold tracking-wide text-violet-400 sm:text-sm">
              <Zap className="h-3.5 w-3.5" />
              Next-Generation Earning Platform
              <ChevronRight className="h-3.5 w-3.5" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Earn Real
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Money Online
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              Complete tasks. Refer friends. Withdraw to M-Pesa.
              <br className="hidden sm:block" />
              Start earning with <strong className="text-foreground">zero investment</strong>.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/register">
                <Button size="lg" className="group gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 px-8 text-base font-bold text-white shadow-2xl shadow-violet-500/30 transition-all hover:shadow-violet-500/50 hover:scale-[1.02]">
                  Start Earning — It&apos;s Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="border-border/60 px-8 text-base hover:bg-muted/50">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex flex-col items-center gap-3">
              <div className="flex -space-x-2">
                {["A", "B", "C", "D", "E"].map((l, i) => (
                  <div
                    key={l}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background text-xs font-bold text-white"
                    style={{
                      background: ["#7c3aed", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"][i],
                    }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                {/* Half star */}
                <svg key="half" className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <defs>
                    <linearGradient id="halfStar">
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#halfStar)" />
                </svg>
                <span className="ml-1 font-semibold text-amber-400 text-sm">4.5</span>
                <span className="ml-1 text-sm text-muted-foreground">
                  from <strong className="text-foreground">10,000+</strong> earners
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Floating Stats ── */}
      <section className="relative -mt-6 z-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/50 bg-card/80 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-6 md:grid-cols-4 md:gap-6">
            {[
              { value: "10K+", label: "Active Members", icon: Users, color: "text-violet-400" },
              { value: "KES 5M+", label: "Total Earned", icon: Coins, color: "text-emerald-400" },
              { value: "500+", label: "Daily Tasks", icon: Play, color: "text-blue-400" },
              { value: "24/7", label: "Live Support", icon: Headphones, color: "text-pink-400" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1.5 py-2 text-center">
                <stat.icon className={`h-5 w-5 ${stat.color} mb-1`} />
                <p className="text-xl font-black sm:text-2xl">{stat.value}</p>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Features</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Earn &amp; Grow</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Powerful tools designed to maximize your earnings on the SYNTHGRAPHIX platform.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: CheckSquare,
                title: "Task Management",
                desc: "Complete daily video and image tasks to earn KES 15–55 per task. New tasks every day.",
                gradient: "from-violet-500 to-purple-600",
                bg: "bg-violet-500/10",
              },
              {
                icon: Wallet,
                title: "Instant Wallet",
                desc: "Real-time balance tracking. Withdraw earnings to M-Pesa or Airtel Money anytime.",
                gradient: "from-emerald-500 to-teal-600",
                bg: "bg-emerald-500/10",
              },
              {
                icon: Users,
                title: "Referral System",
                desc: "Earn bonus commissions for every friend you refer. Multi-tier tracking with automated payouts.",
                gradient: "from-orange-500 to-amber-600",
                bg: "bg-orange-500/10",
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                desc: "Visualize your earnings, task completion rates, and growth with real-time interactive charts.",
                gradient: "from-blue-500 to-cyan-600",
                bg: "bg-blue-500/10",
              },
              {
                icon: Shield,
                title: "Bank-Grade Security",
                desc: "Encrypted transactions, secure sessions, and protected data. Your earnings are always safe.",
                gradient: "from-green-500 to-emerald-600",
                bg: "bg-green-500/10",
              },
              {
                icon: Headphones,
                title: "24/7 WhatsApp Support",
                desc: "Round-the-clock customer support. Get help anytime via WhatsApp — we respond fast.",
                gradient: "from-pink-500 to-rose-600",
                bg: "bg-pink-500/10",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div className={`absolute top-0 right-0 h-32 w-32 rounded-bl-full ${f.bg} opacity-50 transition-opacity group-hover:opacity-80`} />
                <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} shadow-lg`}>
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="relative mt-5 text-lg font-bold">{f.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="relative border-y border-border/30 bg-muted/5 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">How It Works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Start Earning in{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">3 Steps</span>
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create Account",
                desc: "Sign up for free in under a minute. Just your name, email, and password.",
                gradient: "from-violet-500 to-indigo-600",
              },
              {
                step: "02",
                title: "Complete Tasks",
                desc: "Watch videos and describe images. Earn KES 15–55 for each completed task.",
                gradient: "from-indigo-500 to-purple-600",
              },
              {
                step: "03",
                title: "Withdraw Earnings",
                desc: "Cash out anytime to M-Pesa or Airtel Money. Fast, secure withdrawals.",
                gradient: "from-purple-500 to-violet-600",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-xl font-black text-white shadow-xl`}>
                  {item.step}
                </div>
                <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Earnings Preview ── */}
      <section id="earnings" className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Earning Potential</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                How Much Can You{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Earn?</span>
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                With consistent daily task completion and active referrals, SYNTHGRAPHIX members earn real money every day.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { label: "Video Tasks (10/day)", earn: "KES 350–550", color: "bg-violet-500" },
                  { label: "Image Tasks (10/day)", earn: "KES 150–300", color: "bg-blue-500" },
                  { label: "Referral Bonuses", earn: "KES 100+/referral", color: "bg-emerald-500" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/50 p-4">
                    <div className={`h-3 w-3 shrink-0 rounded-full ${row.color}`} />
                    <span className="flex-1 text-sm font-medium">{row.label}</span>
                    <span className="text-sm font-bold text-emerald-400">{row.earn}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Earnings card */}
            <div className="relative">
              <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 blur-xl" />
              <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-2xl sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Monthly Projection</p>
                    <p className="text-xs text-muted-foreground">Based on daily active usage</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {[
                    { label: "Daily Tasks", value: "KES 500–850", pct: 75 },
                    { label: "Weekly Total", value: "KES 3,500–5,950", pct: 60 },
                    { label: "Monthly Total", value: "KES 15,000–25,500", pct: 90 },
                  ].map((p) => (
                    <div key={p.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{p.label}</span>
                        <span className="font-bold text-emerald-400">{p.value}</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-muted/50">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                          style={{ width: `${p.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Potential Annual Earnings</p>
                  <p className="mt-1 text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    KES 180,000 – 306,000
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="border-y border-border/30 bg-muted/5 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Testimonials</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              What Our Members{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Say</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Sarah M.", role: "Active since 2024", text: "I earn over KES 15,000 monthly just from daily tasks. The withdrawal to M-Pesa is instant!", avatar: "SM", color: "from-violet-500 to-indigo-600" },
              { name: "James K.", role: "Top Referrer", text: "The referral system is amazing. I've invited 50+ friends and the bonuses keep coming in automatically.", avatar: "JK", color: "from-emerald-500 to-teal-600" },
              { name: "Grace W.", role: "Daily Earner", text: "Simple and legit. I complete my 10 tasks every morning before work. Best side hustle platform in Kenya.", avatar: "GW", color: "from-amber-500 to-orange-600" },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl border border-border/40 bg-card/50 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-xs font-bold text-white`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-indigo-600/10" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-violet-500/15 blur-[150px]" />
        <div className="pointer-events-none absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-indigo-600/15 blur-[150px]" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-2xl shadow-violet-500/30">
            <Zap className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Ready to Start
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Earning Today?
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Join thousands of Kenyans earning real money daily. Your journey starts now.
          </p>
          <Link href="/auth/register" className="mt-10 inline-block">
            <Button size="lg" className="group gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 px-12 py-6 text-lg font-bold text-white shadow-2xl shadow-violet-500/30 transition-all hover:shadow-violet-500/50 hover:scale-[1.02]">
              Create Free Account
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/30 bg-muted/5 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <BrandLogo size={28} />
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                The #1 digital earning platform in Kenya. Earn real money completing tasks and referring friends.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Platform</h4>
              <div className="space-y-2.5">
                {["Tasks", "Wallet", "Referrals", "Withdraw"].map((l) => (
                  <p key={l} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{l}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Support</h4>
              <div className="space-y-2.5">
                {["WhatsApp", "FAQ", "Contact Us", "Help Center"].map((l) => (
                  <p key={l} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{l}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Legal</h4>
              <div className="space-y-2.5">
                {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((l) => (
                  <p key={l} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{l}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/30 pt-8 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} SYNTHGRAPHIX. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Made with ❤️ in Kenya
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
