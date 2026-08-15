import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Star, Users } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { ErrorState, LoadingStats } from "@/components/DataState";
import { RequireRole } from "@/components/RequireRole";
import { StatCard } from "@/components/StatCard";
import { dashboardService } from "@/services";
import { ApiError } from "@/services/apiClient";

export const Route = createFileRoute("/admin/dashboard")({
  ssr: false,
  component: () => (
    <RequireRole role="administrator">
      <AdminDashboard />
    </RequireRole>
  ),
});

function AdminDashboard() {
  const query = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => dashboardService.admin(),
  });

  const data = query.data?.data;

  return (
    <AppShell
      title="Administrator Dashboard"
      description="Manage RateSphere users, stores and ratings."
    >
      {query.isPending ? <LoadingStats count={3} /> : null}

      {query.isError ? (
        <ErrorState
          message={
            query.error instanceof ApiError
              ? query.error.message
              : "Unable to load administrator dashboard."
          }
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {data ? (
        <>
          <section
            aria-label="Administrator statistics"
            className="grid gap-4 sm:grid-cols-3"
          >
            <StatCard
              label="Total Users"
              value={data.stats.totalUsers}
              icon={Users}
            />

            <StatCard
              label="Total Stores"
              value={data.stats.totalStores}
              icon={Building2}
            />

            <StatCard
              label="Total Ratings"
              value={data.stats.totalRatings}
              icon={Star}
              tone="star"
            />
          </section>

          <section className="surface-card p-5">
            <h2 className="font-display text-lg font-semibold">
              Top Rated Stores
            </h2>

            <div className="mt-4 space-y-3">
              {data.topStores.map((store) => (
                <div
                  key={store.id}
                  className="flex items-center justify-between border-b border-border py-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">{store.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {store.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="size-4" />
                    <span className="font-semibold">
                      {store.average_rating ?? "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </AppShell>
  );
}