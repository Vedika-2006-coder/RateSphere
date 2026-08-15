import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { DistributionPoint } from "@/services/types";

type Props = {
  data: DistributionPoint[];
  height?: number;
};

/** Rating distribution (1–5) rendered from real rating counts. */
export function RatingDistributionChart({ data, height = 240 }: Props) {
  const total = data.reduce((sum, point) => sum + point.count, 0);

  if (total === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No ratings yet — the distribution appears once customers start rating.
      </p>
    );
  }

  const chartData = data.map((point) => ({
    label: `${point.rating}★`,
    rating: point.rating,
    count: point.count,
    share: Math.round((point.count / total) * 100),
  }));

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
          />
          <Tooltip
            cursor={{ fill: "var(--color-muted)" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--color-border)",
              background: "var(--color-card)",
              fontSize: 12,
            }}
            formatter={(value: number, _name, item) => [
              `${value} rating${value === 1 ? "" : "s"} (${item.payload.share}%)`,
              `${item.payload.rating} star`,
            ]}
          />
          <Bar dataKey="count" radius={[8, 8, 4, 4]} maxBarSize={56}>
            {chartData.map((entry) => (
              <Cell
                key={entry.rating}
                fill={entry.rating >= 4 ? "var(--color-chart-4)" : entry.rating === 3 ? "var(--color-chart-3)" : "var(--color-destructive)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Compact accessible bar list — an alternative to the chart for tight layouts. */
export function RatingDistributionBars({ data }: { data: DistributionPoint[] }) {
  const total = data.reduce((sum, point) => sum + point.count, 0);
  return (
    <ul className="space-y-2">
      {[...data].reverse().map((point) => {
        const share = total ? Math.round((point.count / total) * 100) : 0;
        return (
          <li key={point.rating} className="flex items-center gap-3 text-sm">
            <span className="w-10 shrink-0 tabular-nums text-muted-foreground">{point.rating}★</span>
            <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-star transition-[width] duration-500"
                style={{ width: `${share}%` }}
              />
            </span>
            <span className="w-20 shrink-0 text-right tabular-nums text-muted-foreground">
              {point.count} · {share}%
            </span>
          </li>
        );
      })}
    </ul>
  );
}
