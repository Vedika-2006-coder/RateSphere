import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  Compass,
  Lock,
  ShieldCheck,
  Sparkles,
  Star,
  UserPlus,
} from "lucide-react";

import { Logo } from "@/components/Logo";
import { StarDisplay } from "@/components/StarRating";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RateSphere — Discover. Rate. Trust." },
      {
        name: "description",
        content:
          "A store rating platform for shoppers and store owners: browse registered stores, submit 1–5 star ratings, and track reputation with real analytics.",
      },
      { property: "og:title", content: "RateSphere — Discover. Rate. Trust." },
      {
        property: "og:description",
        content:
          "Browse registered stores, submit honest 1–5 star ratings, and give store owners a transparent view of their reputation.",
      },
    ],
  }),
  component: LandingPage,
});

/** Illustrative UI content — not real platform data. */
const PREVIEW_STORES = [
  { name: "Verdant Grocers & Provisions", area: "Bandra West, Mumbai", rating: 4.6 },
  { name: "Paperleaf Books & Stationery", area: "Ballygunge, Kolkata", rating: 4.8 },
  { name: "Northline Coffee Roasters", area: "Hill Road, Mumbai", rating: 4.1 },
];

const STEPS = [
  {
    icon: Compass,
    title: "Discover stores",
    body: "Browse every registered store and search instantly by name or address.",
  },
  {
    icon: Star,
    title: "Rate honestly",
    body: "Leave a single 1–5 star rating per store, and update it whenever your view changes.",
  },
  {
    icon: ShieldCheck,
    title: "Build trust",
    body: "Owners see who rated them, their average score and the full rating distribution.",
  },
];

const PILLARS = [
  {
    icon: Lock,
    title: "One secure sign-in",
    body: "A single login for shoppers, store owners and administrators. Your role comes from the server — never from a dropdown.",
  },
  {
    icon: BarChart3,
    title: "Real analytics only",
    body: "Every average, count and chart is computed from actual ratings stored in MySQL. Nothing on a dashboard is invented.",
  },
  {
    icon: Building2,
    title: "Owner-scoped data",
    body: "Store owners can only ever reach their own stores. Ownership is verified on every API request.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Link to="/" aria-label="RateSphere home" className="rounded-md">
            <Logo />
          </Link>
          <nav aria-label="Account" className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/signup">Sign up</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero-gradient relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -right-24 -top-24 size-[28rem] rounded-full bg-primary/20 blur-3xl"
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/15 bg-ink-foreground/5 px-3 py-1 text-xs font-medium text-ink-foreground/80">
                <Sparkles className="size-3.5" aria-hidden />
                Store ratings people can actually trust
              </span>
              <h1 className="font-display text-balance-tight mt-6 text-4xl font-semibold text-ink-foreground sm:text-5xl lg:text-6xl">
                RateSphere
              </h1>
              <p className="mt-3 text-lg font-medium tracking-[0.2em] text-ink-foreground/70 uppercase">
                Discover. Rate. Trust.
              </p>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-foreground/75">
                Find registered stores near you, share a single honest rating from one to five
                stars, and give store owners a transparent, evidence-based view of their
                reputation.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/signup">
                    Explore Stores <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-ink-foreground/25 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
                >
                  <Link to="/login">Log in</Link>
                </Button>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-foreground/65">
                {["One rating per store", "Update anytime", "Owner analytics"].map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <Check className="size-4 text-primary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Store discovery preview — illustrative */}
            <div className="relative">
              <div className="surface-card sheen-gradient p-5 shadow-lift">
                <div className="flex items-center justify-between">
                  <p className="font-display text-sm font-semibold">Store discovery</p>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    Illustrative preview
                  </span>
                </div>
                <ul className="mt-4 space-y-3">
                  {PREVIEW_STORES.map((store) => (
                    <li
                      key={store.name}
                      className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-3.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{store.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{store.area}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <StarDisplay value={store.rating} />
                        <span className="text-sm font-semibold tabular-nums">{store.rating}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-lg bg-muted/70 p-3.5">
                  <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                    Rating distribution
                  </p>
                  <div className="mt-3 flex items-end gap-2" aria-hidden>
                    {[8, 14, 26, 52, 78].map((height, index) => (
                      <div key={index} className="flex-1 space-y-1.5">
                        <div
                          className="rounded-t-md bg-star/80"
                          style={{ height: `${height}px` }}
                        />
                        <p className="text-center text-[10px] text-muted-foreground">{index + 1}★</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Example shape only — live charts are built from real ratings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold">How it works</h2>
            <p className="mt-3 text-muted-foreground">
              Three roles, one login, and a rating model that stays honest by design.
            </p>
          </div>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="surface-card p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <step.icon className="size-5" aria-hidden />
                  </span>
                  <span className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="font-display mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Trust pillars */}
        <section className="border-y border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-semibold">Built on trust, not vibes</h2>
              <p className="mt-3 text-muted-foreground">
                Ratings are only useful if the platform behind them is disciplined about access and
                accuracy.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {PILLARS.map((pillar) => (
                <div key={pillar.title} className="surface-card p-6">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <pillar.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-display mt-4 text-lg font-semibold">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="hero-gradient flex flex-col items-start gap-6 rounded-2xl px-6 py-12 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold text-ink-foreground">
                Start rating in under a minute
              </h2>
              <p className="mt-3 text-ink-foreground/70">
                Create a free shopper account to browse stores and leave your first rating. Store
                owner and administrator accounts are provisioned by an administrator.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/signup">
                  <UserPlus className="size-4" aria-hidden /> Create account
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-ink-foreground/25 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
              >
                <Link to="/login">Log in</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Logo showTagline />
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              A store rating platform built with React, Express.js and MySQL.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link to="/login" className="text-muted-foreground hover:text-foreground">
              Log in
            </Link>
            <Link to="/signup" className="text-muted-foreground hover:text-foreground">
              Sign up
            </Link>
          </nav>
        </div>
        <div className="border-t border-border">
          <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
            © {new Date().getFullYear()} RateSphere. Store examples shown on this page are
            illustrative UI content.
          </p>
        </div>
      </footer>
    </div>
  );
}
