import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Store as StoreIcon, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState, ErrorState, LoadingCards } from "@/components/DataState";
import { PaginationBar, Toolbar } from "@/components/DataTools";
import { StoreCard } from "@/components/StoreCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ratingService, storeService } from "@/services";
import { ApiError } from "@/services/apiClient";

const SORT_OPTIONS = [
  { value: "name:asc", label: "Name (A–Z)" },
  { value: "name:desc", label: "Name (Z–A)" },
  { value: "rating:desc", label: "Highest rated" },
  { value: "rating:asc", label: "Lowest rated" },
  { value: "address:asc", label: "Address (A–Z)" },
  { value: "created_at:desc", label: "Newest first" },
];

/** Debounced value helper — keeps search from firing a request per keystroke. */
function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function StoreBrowser({ pageSize = 9 }: { pageSize?: number }) {
  const queryClient = useQueryClient();
  const [nameSearch, setNameSearch] = useState("");
  const [addressSearch, setAddressSearch] = useState("");
  const [sort, setSort] = useState("name:asc");
  const [page, setPage] = useState(1);

  const debouncedName = useDebounced(nameSearch);
  const debouncedAddress = useDebounced(addressSearch);

  useEffect(() => {
    setPage(1);
  }, [debouncedName, debouncedAddress, sort]);

  const [sortBy, order] = sort.split(":") as [string, "asc" | "desc"];

  const params = useMemo(
    () => ({
      name: debouncedName || undefined,
      address: debouncedAddress || undefined,
      sortBy,
      order,
      page,
      limit: pageSize,
    }),
    [debouncedName, debouncedAddress, sortBy, order, page, pageSize],
  );

  const query = useQuery({
    queryKey: ["stores", params],
    queryFn: () => storeService.list(params),
  });

  async function handleRating(storeId: number, rating: number, isUpdate: boolean) {
    try {
      const response = isUpdate
        ? await ratingService.update(storeId, rating)
        : await ratingService.submit(storeId, rating);
      toast.success(response.message ?? "Rating saved");
      // Refresh store lists and dashboard statistics from the database.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["stores"] }),
        queryClient.invalidateQueries({ queryKey: ["user-dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["my-ratings"] }),
      ]);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Could not save your rating. Please try again.";
      toast.error(message);
      throw new Error(message);
    }
  }

  const hasFilters = Boolean(nameSearch || addressSearch);

  return (
    <div className="space-y-5">
      <Toolbar>
        <div className="flex-1 space-y-1.5 md:min-w-56">
          <Label htmlFor="store-name-search" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Search by name
          </Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="store-name-search"
              value={nameSearch}
              onChange={(event) => setNameSearch(event.target.value)}
              placeholder="e.g. Verdant Grocers"
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex-1 space-y-1.5 md:min-w-56">
          <Label htmlFor="store-address-search" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Search by address
          </Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="store-address-search"
              value={addressSearch}
              onChange={(event) => setAddressSearch(event.target.value)}
              placeholder="e.g. Mumbai"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5 md:w-52">
          <Label htmlFor="store-sort" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Sort
          </Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger id="store-sort" aria-label="Sort stores">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasFilters ? (
          <Button
            variant="ghost"
            onClick={() => {
              setNameSearch("");
              setAddressSearch("");
            }}
          >
            <X className="size-4" aria-hidden /> Clear
          </Button>
        ) : null}
      </Toolbar>

      {query.isPending ? <LoadingCards count={pageSize > 6 ? 6 : pageSize} /> : null}

      {query.isError ? (
        <ErrorState
          message={
            query.error instanceof ApiError ? query.error.message : "Unexpected error loading stores."
          }
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {query.data && query.data.data.length === 0 ? (
        <EmptyState
          icon={<StoreIcon className="size-5" />}
          title="No stores found."
          description={
            hasFilters
              ? "Try a different name or address."
              : "No stores have been registered yet. Check back soon."
          }
        />
      ) : null}

      {query.data && query.data.data.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {query.data.data.map((store) => (
              <StoreCard key={store.id} store={store} onSubmitRating={handleRating} />
            ))}
          </div>
          <PaginationBar
            page={query.data.meta.page}
            totalPages={query.data.meta.totalPages}
            total={query.data.meta.total}
            onPageChange={setPage}
          />
        </>
      ) : null}
    </div>
  );
}
