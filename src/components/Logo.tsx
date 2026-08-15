import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  tone?: "default" | "inverted";
  showTagline?: boolean;
};

export function Logo({ className, tone = "default", showTagline = false }: LogoProps) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="accent-gradient grid size-9 shrink-0 place-items-center rounded-xl shadow-glow"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" className="text-primary-foreground/70" />
          <path
            d="M12 6.8l1.55 3.14 3.47.5-2.51 2.45.59 3.45L12 14.71l-3.1 1.63.59-3.45-2.51-2.45 3.47-.5L12 6.8z"
            fill="currentColor"
            className="text-primary-foreground"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-semibold tracking-tight",
            tone === "inverted" ? "text-ink-foreground" : "text-foreground",
          )}
        >
          RateSphere
        </span>
        {showTagline ? (
          <span
            className={cn(
              "mt-1 text-[11px] font-medium tracking-[0.18em] uppercase",
              tone === "inverted" ? "text-ink-foreground/60" : "text-muted-foreground",
            )}
          >
            Discover. Rate. Trust.
          </span>
        ) : null}
      </span>
    </span>
  );
}
