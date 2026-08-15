import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "primary" | "star" | "success" | "muted";
};

const TONES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "bg-primary/10 text-primary",
  star: "bg-star/15 text-star",
  success: "bg-success/12 text-success",
  muted: "bg-muted text-muted-foreground",
};

export function StatCard({ label, value, hint, icon: Icon, tone = "primary" }: StatCardProps) {
  return (
    <div className="surface-card flex items-start justify-between gap-4 p-5 transition-shadow hover:shadow-lift">
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {label}
        </p>
        <p className="font-display mt-2 text-3xl font-semibold tabular-nums">{value}</p>
        {hint ? <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", TONES[tone])}>
        <Icon className="size-5" aria-hidden />
      </span>
    </div>
  );
}
