import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Loader2, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { EmptyState, ErrorState, LoadingRows } from "@/components/DataState";
import { RequireRole } from "@/components/RequireRole";
import { StarDisplay, StarRatingInput } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { ratingService } from "@/services";
import { ApiError } from "@/services/apiClient";

export const Route = createFileRoute("/my-ratings")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My ratings — RateSphere" },
      {
        name: "description",
        content: "Review and update every rating you've submitted on RateSphere.",
      },
      { property: "og:title", content: "My ratings — RateSphere" },
      { property: "og:description", content: "Your personal rating history, editable any time." },
    ],
  }),
  component: () => (
    <RequireRole role="normal_user">
      <MyRatingsPage />
    </RequireRole>
  ),
});

function MyRatingsPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  const query = useQuery({ queryKey: ["my-ratings"], queryFn: () => ratingService.mine() });
  const ratings = query.data?.data ?? [];

  async function save(storeId: number) {
    if (!draft) return;
    setSavingId(storeId);
    try {
      await ratingService.update(storeId, draft);
      toast.success("Rating updated");
      setEditingId(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-ratings"] }),
        queryClient.invalidateQueries({ queryKey: ["stores"] }),
        queryClient.invalidateQueries({ queryKey: ["user-dashboard"] }),
      ]);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not update your rating.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <AppShell title="My ratings" description="Every rating you've submitted, newest first.">
      {query.isPending ? <LoadingRows rows={5} /> : null}

      {query.isError ? (
        <ErrorState
          message={query.error instanceof ApiError ? query.error.message : undefined}
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {query.data && ratings.length === 0 ? (
        <EmptyState
          icon={<Star className="size-5" />}
          title="You haven't rated any stores yet."
          description="Find a store you know and share your honest rating."
          action={
            <Button asChild size="sm">
              <Link to="/stores">Browse stores</Link>
            </Button>
          }
        />
      ) : null}

      {ratings.length > 0 ? (
        <ul className="space-y-3">
          {ratings.map((rating) => {
            const editing = editingId === rating.store_id;
            return (
              <li key={rating.id} className="surface-card p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="font-display truncate text-base font-semibold">
                      {rating.store_name}
                    </h2>
                    <p className="truncate text-sm text-muted-foreground">{rating.store_address}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Store average:{" "}
                      <span className="font-semibold text-foreground tabular-nums">
                        {rating.average_rating !== null ? Number(rating.average_rating).toFixed(1) : "—"}
                      </span>{" "}
                      · Last updated {new Date(rating.updated_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-3">
                    {editing ? (
                      <>
                        <StarRatingInput
                          value={draft}
                          onChange={setDraft}
                          size="md"
                          name={`edit-${rating.store_id}`}
                          ariaLabel={`Update your rating for ${rating.store_name}`}
                          disabled={savingId === rating.store_id}
                        />
                        <Button
                          size="sm"
                          onClick={() => void save(rating.store_id)}
                          disabled={savingId === rating.store_id || !draft}
                        >
                          {savingId === rating.store_id ? (
                            <>
                              <Loader2 className="size-4 animate-spin" aria-hidden /> Saving
                            </>
                          ) : (
                            "Save"
                          )}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <StarDisplay value={rating.rating} size="md" />
                        <span className="text-sm font-semibold tabular-nums">{rating.rating}/5</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(rating.store_id);
                            setDraft(rating.rating);
                          }}
                        >
                          Modify
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </AppShell>
  );
}
