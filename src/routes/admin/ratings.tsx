import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { ErrorState, LoadingStats } from "@/components/DataState";
import { RequireRole } from "@/components/RequireRole";
import { StarDisplay } from "@/components/StarRating";
import { storeService } from "@/services";
import { ApiError } from "@/services/apiClient";

export const Route = createFileRoute("/admin/ratings")({
  ssr: false,
  component: () => (
    <RequireRole role="administrator">
      <AdminRatings />
    </RequireRole>
  ),
});

function AdminRatings() {
  const storesQuery = useQuery({
    queryKey: ["admin-rating-stores"],
    queryFn: () =>
      storeService.list({
        page: 1,
        limit: 50,
      }),
  });

  const stores = storesQuery.data?.data ?? [];

  const ratingsQuery = useQuery({
    queryKey: [
      "admin-ratings",
      stores.map((store) => store.id),
    ],
    enabled: stores.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        stores.map(async (store) => {
          const response = await storeService.ratings(store.id);

          return response.data.map((rating) => ({
            ...rating,
            store_id: store.id,
            store_name: store.name,
          }));
        }),
      );

      return results.flat();
    },
  });

  const ratings = ratingsQuery.data ?? [];

  return (
    <AppShell
      title="Ratings"
      description="View ratings submitted across all RateSphere stores."
    >
      {storesQuery.isPending ? <LoadingStats count={1} /> : null}

      {ratingsQuery.isPending && stores.length > 0 ? (
        <LoadingStats count={1} />
      ) : null}

      {storesQuery.isError || ratingsQuery.isError ? (
        <ErrorState
          message={
            storesQuery.error instanceof ApiError
              ? storesQuery.error.message
              : ratingsQuery.error instanceof ApiError
                ? ratingsQuery.error.message
                : "Unable to load ratings."
          }
          onRetry={() => {
            void storesQuery.refetch();
            void ratingsQuery.refetch();
          }}
        />
      ) : null}

      {!storesQuery.isPending &&
      !ratingsQuery.isPending &&
      !storesQuery.isError &&
      !ratingsQuery.isError ? (
        <section className="surface-card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border p-5">
            <Star className="size-5" />

            <div>
              <h2 className="font-display text-lg font-semibold">
                All Ratings
              </h2>

              <p className="text-sm text-muted-foreground">
                {ratings.length} submitted ratings
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 font-medium">
                    Store
                  </th>

                  <th className="px-5 py-3 font-medium">
                    User
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Email
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Rating
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Updated
                  </th>
                </tr>
              </thead>

              <tbody>
                {ratings.map((rating) => (
                  <tr
                    key={`${rating.store_id}-${rating.id}`}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-4 font-medium">
                      {rating.store_name}
                    </td>

                    <td className="px-5 py-4">
                      {rating.user_name}
                    </td>

                    <td className="px-5 py-4">
                      {rating.user_email}
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
                        rating.updated_at,
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}

                {ratings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-muted-foreground"
                    >
                      No ratings have been submitted yet.
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