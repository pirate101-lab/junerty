import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, CheckSquare, Shield, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BarChart3 className="h-5 w-5" />
            </div>
            Business Platform
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Button asChild>
              <Link href="/auth/register">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container flex flex-col items-center px-4 pt-32 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-8">
          <Zap className="h-4 w-4" />
          Modern task management for teams
        </div>
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Ship faster with
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {" "}
            intelligent workflows
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          A complete business platform with task management, analytics dashboards,
          and team collaboration. Built for modern teams that move fast.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" asChild className="h-12 px-8 text-base">
            <Link href="/auth/register" className="flex items-center gap-2">
              Start free trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base">
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container px-4 py-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: CheckSquare,
              title: "Task Management",
              desc: "Full CRUD with Kanban boards, status tracking, and task assignment.",
            },
            {
              icon: BarChart3,
              title: "Analytics Dashboard",
              desc: "Real-time metrics, charts, and insights to drive decisions.",
            },
            {
              icon: Shield,
              title: "Secure & Reliable",
              desc: "Enterprise-grade auth, protected routes, and session management.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container px-4 py-24">
        <div className="rounded-2xl border bg-gradient-to-r from-primary/5 to-primary/10 p-12 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Create your free account and start managing tasks in minutes.
          </p>
          <Button size="lg" asChild className="mt-6">
            <Link href="/auth/register">Create free account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Business Platform. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/auth/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/auth/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
