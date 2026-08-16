import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Star, Users } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { ErrorState, LoadingStats } from "@/components/DataState";
import { RequireRole } from "@/components/RequireRole";
import { StarDisplay } from "@/components/StarRating";
import { StatCard } from "@/components/StatCard";
import { dashboardService } from "@/services";
import { ApiError } from "@/services/apiClient";

export const Route = createFileRoute("/owner/ratings")({
  ssr: false,
  component: () => (
    <RequireRole role="store_owner">
      <OwnerRatings />
    </RequireRole>
  ),
});

function OwnerRatings() {
  const query = useQuery({
    queryKey: ["owner-ratings"],
    queryFn: () => dashboardService.owner(),
  });

  const data = query.data?.data;

  return (
    <AppShell
      title="Ratings"
      description="See how customers are rating your store."
    >
      {query.isPending ? <LoadingStats count={2} /> : null}

      {query.isError ? (
        <ErrorState
          message={
            query.error instanceof ApiError
              ? query.error.message
              : "Unable to load ratings."
          }
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {data ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Total Ratings"
              value={data.stats.totalRatings}
              icon={Users}
            />

            <StatCard
              label="Average Rating"
              value={
                data.stats.averageRating !== null
                  ? Number(data.stats.averageRating).toFixed(2)
                  : "—"
              }
              icon={Star}
              tone="success"
            />
          </section>

          <section className="surface-card mt-6 overflow-hidden">
            <div className="border-b border-border p-5">
              <h2 className="font-display text-lg font-semibold">
                Customer Ratings
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Users who have submitted ratings for your store.
              </p>
            </div>

            {data.raters.length === 0 ? (
              <div className="p-8 text-center">
                <Star className="mx-auto h-10 w-10 text-muted-foreground" />

                <p className="mt-4 font-medium">
                  No ratings have been submitted yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="px-5 py-3 font-medium">Customer</th>
                      <th className="px-5 py-3 font-medium">Rating</th>
                      <th className="px-5 py-3 font-medium">Submitted</th>
                      <th className="px-5 py-3 font-medium">Updated</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.raters.map((rating) => (
                      <tr
                        key={rating.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium">{rating.user_name}</p>

                          <p className="text-xs text-muted-foreground">
                            {rating.user_email}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <StarDisplay value={rating.rating} />

                            <span className="font-medium">
                              {rating.rating}/5
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-muted-foreground">
                          {new Date(
                            rating.created_at,
                          ).toLocaleDateString()}
                        </td>

                        <td className="px-5 py-4 text-muted-foreground">
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