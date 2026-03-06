import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  CheckSquare,
  Users,
  Zap,
  Shield,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Business Platform
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="container flex flex-col items-center px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm text-muted-foreground">
              <Zap className="mr-2 h-4 w-4 text-primary" />
              Modern task management for teams
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Ship faster with{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                clarity
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              A production-ready platform that brings tasks, analytics, and team
              collaboration into one seamless experience. Built for modern teams.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/register">
                  Start free trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container border-t py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Everything you need to succeed
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<CheckSquare className="h-8 w-8" />}
                title="Task Management"
                description="Full CRUD, Kanban boards, status tracking, and task assignment. Keep your team aligned."
              />
              <FeatureCard
                icon={<BarChart3 className="h-8 w-8" />}
                title="Analytics Dashboard"
                description="Real-time metrics, charts, and insights. Make data-driven decisions."
              />
              <FeatureCard
                icon={<Users className="h-8 w-8" />}
                title="User Management"
                description="Admin panel with user roles, permissions, and team overview."
              />
              <FeatureCard
                icon={<Shield className="h-8 w-8" />}
                title="Secure Auth"
                description="NextAuth with credentials, sessions, and protected routes."
              />
              <FeatureCard
                icon={<Zap className="h-8 w-8" />}
                title="Dark Mode"
                description="Seamless light/dark/system theme switching. Easy on the eyes."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container border-t py-24">
          <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-12 text-center shadow-lg">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of teams already using our platform.
            </p>
            <Button size="lg" className="mt-6 gap-2" asChild>
              <Link href="/register">
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Business Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-xl border bg-card p-6 transition-all hover:shadow-md">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
