import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Star, Store, Target, TrendingUp } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { ErrorState, LoadingStats } from "@/components/DataState";
import { RatingDistributionBars } from "@/components/RatingDistribution";
import { RequireRole } from "@/components/RequireRole";
import { StarDisplay } from "@/components/StarRating";
import { StatCard } from "@/components/StatCard";
import { StoreBrowser } from "@/components/StoreBrowser";
import { Button } from "@/components/ui/button";
import { dashboardService } from "@/services";
import { ApiError } from "@/services/apiClient";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Your dashboard — RateSphere" },
      {
        name: "description",
        content: "Track the stores you've rated and discover new ones to review on RateSphere.",
      },
      { property: "og:title", content: "Your dashboard — RateSphere" },
      { property: "og:description", content: "Your personal store discovery and rating hub." },
    ],
  }),
  component: () => (
    <RequireRole role="normal_user">
      <UserDashboard />
    </RequireRole>
  ),
});

function UserDashboard() {
  const query = useQuery({
    queryKey: ["user-dashboard"],
    queryFn: () => dashboardService.user(),
  });

  const data = query.data?.data;
  const firstName = data?.user.name.split(" ")[0] ?? "there";

  return (
    <AppShell
      title={data ? `Welcome back, ${firstName}` : "Your dashboard"}
      description="Discover registered stores and keep your ratings up to date."
      actions={
        <Button asChild size="sm" variant="outline">
          <Link to="/my-ratings">
            <Star className="size-4" aria-hidden /> My ratings
          </Link>
        </Button>
      }
    >
      {query.isPending ? <LoadingStats count={4} /> : null}

      {query.isError ? (
        <ErrorState
          message={
            query.error instanceof ApiError
              ? query.error.message
              : "Unexpected error loading your dashboard."
          }
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {data ? (
        <>
          <section aria-label="Your statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Registered stores" value={data.stats.totalStores} icon={Store} />
            <StatCard
              label="Stores you rated"
              value={data.stats.storesRated}
              icon={Star}
              tone="star"
              hint={`${data.stats.unratedStores} still unrated`}
            />
            <StatCard
              label="Your average rating"
              value={data.stats.averageGiven !== null ? data.stats.averageGiven.toFixed(2) : "—"}
              icon={TrendingUp}
              tone="success"
              hint={data.stats.averageGiven === null ? "Rate a store to see this" : "Across your ratings"}
            />
            <StatCard
              label="Coverage"
              value={
                data.stats.totalStores
                  ? `${Math.round((data.stats.storesRated / data.stats.totalStores) * 100)}%`
                  : "—"
              }
              icon={Target}
              tone="muted"
              hint="Share of stores you've rated"
            />
          </section>

          <section className="grid gap-5 lg:grid-cols-3">
            <div className="surface-card p-5 lg:col-span-2">
              <h2 className="font-display text-base font-semibold">Your recent ratings</h2>
              {data.recentRatings.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  You haven't rated any stores yet — pick one below to get started.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-border">
                  {data.recentRatings.map((rating) => (
                    <li key={rating.id} className="flex items-center justify-between gap-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{rating.store_name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {rating.store_address}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <StarDisplay value={rating.rating} />
                        <span className="text-sm font-semibold tabular-nums">{rating.rating}/5</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="surface-card p-5">
              <h2 className="font-display text-base font-semibold">How you rate</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Distribution of the ratings you've submitted.
              </p>
              <div className="mt-4">
                <RatingDistributionBars data={data.distribution} />
              </div>
            </div>
          </section>
        </>
      ) : null}

      <section aria-label="Store discovery" className="space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold">Discover stores</h2>
          <p className="text-sm text-muted-foreground">
            Search by name or address, then rate in place.
          </p>
        </div>
        <StoreBrowser pageSize={6} />
      </section>
    </AppShell>
  );
}
