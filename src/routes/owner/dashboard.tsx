import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Star, Store, Users, TrendingUp } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { ErrorState, LoadingStats } from "@/components/DataState";
import { RatingDistributionBars } from "@/components/RatingDistribution";
import { RequireRole } from "@/components/RequireRole";
import { StarDisplay } from "@/components/StarRating";
import { StatCard } from "@/components/StatCard";
import { dashboardService } from "@/services";
import { ApiError } from "@/services/apiClient";

export const Route = createFileRoute("/owner/dashboard")({
  ssr: false,
  component: () => (
    <RequireRole role="store_owner">
      <OwnerDashboard />
    </RequireRole>
  ),
});

function OwnerDashboard() {
  const query = useQuery({
    queryKey: ["owner-dashboard"],
    queryFn: () => dashboardService.owner(),
  });

  const data = query.data?.data;

  return (
    <AppShell
      title="Owner Dashboard"
      description="Monitor your store and see how customers are rating it."
    >
      {query.isPending ? <LoadingStats count={3} /> : null}

      {query.isError ? (
        <ErrorState
          message={
            query.error instanceof ApiError
              ? query.error.message
              : "Unable to load the owner dashboard."
          }
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {data ? (
        <>
          <section
            aria-label="Store statistics"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            <StatCard
              label="Total stores"
              value={data.stats.totalStores}
              icon={Store}
            />

            <StatCard
              label="Total ratings"
              value={data.stats.totalRatings}
              icon={Users}
            />

            <StatCard
              label="Average rating"
              value={
                data.stats.averageRating !== null
                  ? data.stats.averageRating.toFixed(2)
                  : "—"
              }
              icon={TrendingUp}
              tone="success"
            />
          </section>

          <section className="grid gap-5 lg:grid-cols-3">
            <div className="surface-card p-5 lg:col-span-2">
              <h2 className="font-display text-base font-semibold">
                Your Stores
              </h2>

              <div className="mt-4 space-y-3">
                {data.stores.map((store) => (
                  <div
                    key={store.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium">{store.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {store.address}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <StarDisplay
                          value={store.average_rating ?? 0}
                        />
                        <span className="text-sm font-semibold">
                          {store.average_rating !== null
                            ? Number(store.average_rating).toFixed(2)
                            : "No ratings"}
                        </span>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {store.total_ratings} total ratings
                    </p>
                  </div>
                ))}

                {data.stores.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No stores are assigned to you yet.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="surface-card p-5">
              <h2 className="font-display text-base font-semibold">
                Rating Distribution
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Distribution of ratings received by your store.
              </p>

              <div className="mt-4">
                <RatingDistributionBars data={data.distribution} />
              </div>
            </div>
          </section>

          <section className="surface-card p-5">
            <h2 className="font-display text-base font-semibold">
              Recent Ratings
            </h2>

            {data.recentRatings.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No ratings have been submitted yet.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="px-4 py-3 font-medium">Store</th>
                      <th className="px-4 py-3 font-medium">User</th>
                      <th className="px-4 py-3 font-medium">Rating</th>
                      <th className="px-4 py-3 font-medium">Updated</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.recentRatings.map((rating) => (
                      <tr
                        key={rating.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-4 py-3">
                          {rating.store_name}
                        </td>

                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">
                              {rating.user_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {rating.user_email}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <StarDisplay value={rating.rating} />
                            <span>{rating.rating}/5</span>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(
                            rating.updated_at,
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : null}
    </AppShell>
  );
}