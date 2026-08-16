import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Star } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { ErrorState, LoadingStats } from "@/components/DataState";
import { RequireRole } from "@/components/RequireRole";
import { storeService } from "@/services";
import { ApiError } from "@/services/apiClient";

export const Route = createFileRoute("/admin/stores")({
  ssr: false,
  component: () => (
    <RequireRole role="administrator">
      <AdminStores />
    </RequireRole>
  ),
});

function AdminStores() {
  const query = useQuery({
    queryKey: ["admin-stores"],
    queryFn: () =>
      storeService.list({
        page: 1,
        limit: 50,
      }),
  });

  const stores = query.data?.data ?? [];

  return (
    <AppShell
      title="Stores"
      description="View and manage all RateSphere stores."
    >
      {query.isPending ? <LoadingStats count={1} /> : null}

      {query.isError ? (
        <ErrorState
          message={
            query.error instanceof ApiError
              ? query.error.message
              : "Unable to load stores."
          }
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {query.data ? (
        <section className="surface-card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border p-5">
            <Building2 className="size-5" />

            <div>
              <h2 className="font-display text-lg font-semibold">
                All Stores
              </h2>

              <p className="text-sm text-muted-foreground">
                {query.data.meta.total} registered stores
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 font-medium">Store Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Address</th>
                  <th className="px-5 py-3 font-medium">Owner</th>
                  <th className="px-5 py-3 font-medium">Rating</th>
                  <th className="px-5 py-3 font-medium">Total Ratings</th>
                </tr>
              </thead>

              <tbody>
                {stores.map((store) => (
                  <tr
                    key={store.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-4 font-medium">
                      {store.name}
                    </td>

                    <td className="px-5 py-4">
                      {store.email}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {store.address}
                    </td>

                    <td className="px-5 py-4">
                      {store.owner_name ?? "No owner"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Star className="size-4" />

                        {store.average_rating !== null
                          ? Number(store.average_rating).toFixed(2)
                          : "No ratings"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {store.total_ratings}
                    </td>
                  </tr>
                ))}

                {stores.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-muted-foreground"
                    >
                      No stores found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}