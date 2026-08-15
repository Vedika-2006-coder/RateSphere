import { ShieldCheck, Star, TrendingUp } from "lucide-react";

import { Logo } from "@/components/Logo";

const POINTS = [
  { icon: Star, text: "One honest rating per store, editable whenever you change your mind." },
  { icon: TrendingUp, text: "Owners see real averages, distributions and who rated them." },
  { icon: ShieldCheck, text: "Every request is authorised on the server, not in the browser." },
];

export function AuthAside({ heading, body }: { heading: string; body: string }) {
  return (
    <aside className="hero-gradient relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-14">
      <div
        aria-hidden
        className="absolute -bottom-32 -left-20 size-[26rem] rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative">
        <Logo tone="inverted" showTagline />
      </div>
      <div className="relative max-w-md">
        <h2 className="font-display text-3xl font-semibold text-ink-foreground">{heading}</h2>
        <p className="mt-4 leading-relaxed text-ink-foreground/70">{body}</p>
        <ul className="mt-8 space-y-4">
          {POINTS.map((point) => (
            <li key={point.text} className="flex items-start gap-3 text-sm text-ink-foreground/75">
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-ink-foreground/10 text-primary">
                <point.icon className="size-4" aria-hidden />
              </span>
              <span>{point.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="relative text-xs text-ink-foreground/50">
        RateSphere — Discover. Rate. Trust.
      </p>
    </aside>
  );
}
