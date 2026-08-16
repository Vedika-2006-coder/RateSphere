import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Star, Store } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { ErrorState, LoadingStats } from "@/components/DataState";
import { RequireRole } from "@/components/RequireRole";
import { StarDisplay } from "@/components/StarRating";
import { StatCard } from "@/components/StatCard";
import { dashboardService } from "@/services";
import { ApiError } from "@/services/apiClient";

export const Route = createFileRoute("/owner/store")({
  ssr: false,
  component: () => (
    <RequireRole role="store_owner">
      <OwnerStore />
    </RequireRole>
  ),
});

function OwnerStore() {
  const query = useQuery({
    queryKey: ["owner-store"],
    queryFn: () => dashboardService.owner(),
  });

  const data = query.data?.data;
  const store = data?.stores?.[0];

  return (
    <AppShell
      title="My Store"
      description="View your store information and rating performance."
    >
      {query.isPending ? <LoadingStats count={3} /> : null}

      {query.isError ? (
        <ErrorState
          message={
            query.error instanceof ApiError
              ? query.error.message
              : "Unable to load your store."
          }
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {data && store ? (
        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Average Rating"
              value={
                store.average_rating !== null
                  ? Number(store.average_rating).toFixed(2)
                  : "—"
              }
              icon={Star}
              tone="success"
            />

            <StatCard
              label="Total Ratings"
              value={store.total_ratings}
              icon={Store}
            />

            <StatCard
              label="Store Status"
              value="Active"
              icon={Store}
            />
          </section>

          <section className="surface-card p-6">
            <h2 className="font-display text-xl font-semibold">
              {store.name}
            </h2>

            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {store.email}
            </div>

            <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {store.address}
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
              <StarDisplay value={Number(store.average_rating ?? 0)} />

              <span className="font-semibold">
                {store.average_rating !== null
                  ? `${Number(store.average_rating).toFixed(2)} / 5`
                  : "No ratings yet"}
              </span>
            </div>
          </section>

          {data.stores.length > 1 ? (
            <section className="surface-card p-6">
              <h2 className="font-display text-lg font-semibold">
                Your Stores
              </h2>

              <div className="mt-4 space-y-3">
                {data.stores.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.address}
                        </p>
                      </div>

                      <span className="font-semibold">
                        {item.average_rating !== null
                          ? Number(item.average_rating).toFixed(2)
                          : "—"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}

      {data && data.stores.length === 0 ? (
        <div className="surface-card p-8 text-center">
          <Store className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 font-semibold">No store assigned</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No store is currently assigned to your account.
          </p>
        </div>
      ) : null}
    </AppShell>
  );
}