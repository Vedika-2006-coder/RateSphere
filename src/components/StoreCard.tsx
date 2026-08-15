import { Check, Loader2, MapPin, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";

import { StarDisplay, StarRatingInput } from "@/components/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Store } from "@/services/types";

type Props = {
  store: Store;
  onSubmitRating: (storeId: number, rating: number, isUpdate: boolean) => Promise<void>;
};

/** Store card with inline, optimistic-free rating flow (loading/success/error states). */
export function StoreCard({ store, onSubmitRating }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<number | null>(store.user_rating);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setDraft(store.user_rating);
  }, [store.user_rating]);

  const hasRated = store.user_rating !== null;

  async function save() {
    if (!draft) return;
    setState("saving");
    setErrorMessage(null);
    try {
      await onSubmitRating(store.id, draft, hasRated);
      setState("saved");
      setEditing(false);
      window.setTimeout(() => setState("idle"), 2200);
    } catch (error) {
      setState("error");
      setErrorMessage(error instanceof Error ? error.message : "Could not save your rating.");
    }
  }

  return (
    <article className="surface-card flex h-full flex-col gap-4 p-5 transition-shadow hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display truncate text-base font-semibold">{store.name}</h3>
          <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            <span className="line-clamp-2">{store.address}</span>
          </p>
        </div>
        {hasRated ? (
          <Badge variant="secondary" className="shrink-0 gap-1">
            <Check className="size-3" aria-hidden /> Rated
          </Badge>
        ) : null}
      </div>

      <div className="flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2.5">
        <StarDisplay value={store.average_rating} />
        <span className="text-sm font-semibold tabular-nums">
          {store.average_rating !== null ? Number(store.average_rating).toFixed(1) : "—"}
        </span>
        <span className="text-xs text-muted-foreground">
          {store.total_ratings} rating{Number(store.total_ratings) === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-auto space-y-3 border-t border-border pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Your rating
          </p>
          {hasRated && !editing ? (
            <span className="text-sm font-semibold tabular-nums">{store.user_rating} / 5</span>
          ) : null}
        </div>

        {editing || !hasRated ? (
          <div className="space-y-3">
            <StarRatingInput
              value={draft}
              onChange={setDraft}
              disabled={state === "saving"}
              name={`store-${store.id}-rating`}
              ariaLabel={`Your rating for ${store.name}`}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" onClick={save} disabled={!draft || state === "saving"}>
                {state === "saving" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden /> Saving
                  </>
                ) : hasRated ? (
                  "Update rating"
                ) : (
                  "Submit rating"
                )}
              </Button>
              {hasRated ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditing(false);
                    setDraft(store.user_rating);
                    setState("idle");
                  }}
                  disabled={state === "saving"}
                >
                  <X className="size-4" aria-hidden /> Cancel
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <StarDisplay value={store.user_rating} size="md" label={`You rated ${store.user_rating} out of 5`} />
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              <Pencil className="size-3.5" aria-hidden /> Modify
            </Button>
          </div>
        )}

        {state === "saved" ? (
          <p role="status" className="flex items-center gap-1.5 text-xs font-medium text-success">
            <Check className="size-3.5" aria-hidden /> Rating saved
          </p>
        ) : null}
        {state === "error" && errorMessage ? (
          <p role="alert" className="text-xs font-medium text-destructive">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </article>
  );
}
