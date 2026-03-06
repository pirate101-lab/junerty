import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckSquare,
  BarChart3,
  Shield,
  Users,
  Wallet,
  Star,
  Globe,
  Zap,
  Clock,
  Target,
  TrendingUp,
  Award,
} from "lucide-react";

export default async function LandingPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <CheckSquare className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">Junerty</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Get started free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
              <span>Trusted by 2,000+ teams worldwide</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              The task platform
              <span className="block mt-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                built for results
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Manage tasks, track progress, collaborate with your team, and earn rewards —
              all in one powerful platform designed to help you work smarter.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/register">
                <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/20">
                  Start for free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="text-base px-8 h-12">
                  Sign in to dashboard
                </Button>
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure &amp; encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Lightning fast</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                <span>Available everywhere</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary sm:text-4xl">2K+</p>
              <p className="mt-1 text-sm text-muted-foreground">Active teams</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary sm:text-4xl">50K+</p>
              <p className="mt-1 text-sm text-muted-foreground">Tasks completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary sm:text-4xl">99.9%</p>
              <p className="mt-1 text-sm text-muted-foreground">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary sm:text-4xl">4.9/5</p>
              <p className="mt-1 text-sm text-muted-foreground">User rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Features</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to succeed
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A complete toolkit for modern teams to manage work, track progress, and grow together
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: CheckSquare, title: "Task Management", desc: "Kanban boards, list views, priorities, due dates, and assignees. Everything you need to stay organized.", color: "text-blue-500 bg-blue-500/10" },
              { icon: BarChart3, title: "Analytics Dashboard", desc: "Real-time charts, completion rates, and team productivity metrics at a glance.", color: "text-purple-500 bg-purple-500/10" },
              { icon: Users, title: "Team Collaboration", desc: "Assign tasks to team members, track who is working on what, and keep everyone aligned.", color: "text-green-500 bg-green-500/10" },
              { icon: Wallet, title: "Wallet & Payments", desc: "Built-in wallet system with M-Pesa integration. Earn rewards, manage deposits and withdrawals.", color: "text-orange-500 bg-orange-500/10" },
              { icon: TrendingUp, title: "Referral Program", desc: "Earn bonuses by inviting friends. Track your referrals and watch your earnings grow.", color: "text-pink-500 bg-pink-500/10" },
              { icon: Shield, title: "Enterprise Security", desc: "End-to-end encryption, secure authentication, protected routes, and role-based access.", color: "text-indigo-500 bg-indigo-500/10" },
            ].map((feature) => (
              <div key={feature.title} className="group relative rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="border-y border-border bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">How it works</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Get started in 3 simple steps
            </h2>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { step: "01", icon: Target, title: "Create your account", desc: "Sign up in seconds with just your email and password. Activate your account to unlock all features." },
              { step: "02", icon: Clock, title: "Organize your work", desc: "Create tasks, set priorities and deadlines, assign to team members, and track progress with Kanban boards." },
              { step: "03", icon: Award, title: "Earn & grow", desc: "Complete tasks, invite friends through referrals, earn wallet rewards, and withdraw your earnings." },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold shadow-lg shadow-primary/20">
                  {item.step}
                </div>
                <h3 className="mt-6 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Testimonials</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by teams everywhere
            </h2>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { name: "Sarah K.", role: "Project Manager", quote: "Junerty transformed how our team handles tasks. The Kanban board is incredibly intuitive, and the analytics help us make better decisions.", stars: 5 },
              { name: "Michael O.", role: "Team Lead", quote: "The wallet and referral system is genius. My team stays motivated, and the M-Pesa integration makes everything seamless.", stars: 5 },
              { name: "Grace W.", role: "Freelancer", quote: "Finally, a task management tool that pays you back! The referral bonuses and clean interface make Junerty my daily driver.", stars: 5 },
            ].map((testimonial) => (
              <div key={testimonial.name} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border py-24 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
        </div>
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to supercharge your productivity?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of teams already using Junerty to manage tasks, collaborate, and grow.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/20">
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-base px-8 h-12">
                Sign in
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required &bull; Free forever plan &bull; Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <CheckSquare className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">Junerty</span>
              </div>
              <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
                The modern task management platform that helps teams work smarter,
                stay organized, and achieve more together.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Product</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a></li>
                <li><a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Account</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/auth/login" className="hover:text-foreground transition-colors">Sign in</Link></li>
                <li><Link href="/auth/register" className="hover:text-foreground transition-colors">Create account</Link></li>
                <li><Link href="/auth/forgot-password" className="hover:text-foreground transition-colors">Reset password</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Junerty. All rights reserved. Built with Next.js, Prisma, and Tailwind CSS.
          </div>
        </div>
      </footer>
    </div>
  );
}
