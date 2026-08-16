import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Star, TrendingUp, Users } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { ErrorState, LoadingStats } from "@/components/DataState";
import { RatingDistributionBars } from "@/components/RatingDistribution";
import { RequireRole } from "@/components/RequireRole";
import { StatCard } from "@/components/StatCard";
import { dashboardService } from "@/services";
import { ApiError } from "@/services/apiClient";

export const Route = createFileRoute("/owner/analytics")({
  ssr: false,
  component: () => (
    <RequireRole role="store_owner">
      <OwnerAnalytics />
    </RequireRole>
  ),
});

function OwnerAnalytics() {
  const query = useQuery({
    queryKey: ["owner-analytics"],
    queryFn: () => dashboardService.owner(),
  });

  const data = query.data?.data;

  return (
    <AppShell
      title="Analytics"
      description="Understand your store's rating performance."
    >
      {query.isPending ? <LoadingStats count={3} /> : null}

      {query.isError ? (
        <ErrorState
          message={
            query.error instanceof ApiError
              ? query.error.message
              : "Unable to load analytics."
          }
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {data ? (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Average Rating"
              value={
                data.stats.averageRating !== null
                  ? Number(data.stats.averageRating).toFixed(2)
                  : "—"
              }
              icon={TrendingUp}
              tone="success"
            />

            <StatCard
              label="Total Ratings"
              value={data.stats.totalRatings}
              icon={Users}
            />

            <StatCard
              label="Stores"
              value={data.stats.totalStores}
              icon={BarChart3}
            />
          </section>

          <section className="surface-card mt-6 p-6">
            <h2 className="font-display text-lg font-semibold">
              Rating Distribution
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Breakdown of ratings received from customers.
            </p>

            <div className="mt-6">
              <RatingDistributionBars data={data.distribution} />
            </div>
          </section>

          <section className="surface-card mt-6 p-6">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5" />

              <div>
                <h2 className="font-display text-lg font-semibold">
                  Rating Health
                </h2>

                <p className="text-sm text-muted-foreground">
                  Based on your current average customer rating.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Current average
                </span>

                <span className="text-2xl font-bold">
                  {data.stats.averageRating !== null
                    ? `${Number(data.stats.averageRating).toFixed(2)} / 5`
                    : "No ratings"}
                </span>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${
                      data.stats.averageRating !== null
                        ? Math.min(
                            100,
                            (Number(data.stats.averageRating) / 5) * 100,
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </section>
        </>
      ) : null}
    </AppShell>
  );
}