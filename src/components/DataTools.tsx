import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SortState = { sortBy: string; order: "asc" | "desc" };

/** Sortable table header button — toggles asc/desc and announces state. */
export function SortHeader({
  label,
  field,
  sort,
  onSort,
  className,
}: {
  label: string;
  field: string;
  sort: SortState;
  onSort: (next: SortState) => void;
  className?: string;
}) {
  const active = sort.sortBy === field;
  const nextOrder: "asc" | "desc" = active && sort.order === "asc" ? "desc" : "asc";
  const Icon = !active ? ArrowUpDown : sort.order === "asc" ? ArrowUp : ArrowDown;

  return (
    <button
      type="button"
      onClick={() => onSort({ sortBy: field, order: nextOrder })}
      aria-label={`Sort by ${label} ${nextOrder === "asc" ? "ascending" : "descending"}`}
      aria-sort={active ? (sort.order === "asc" ? "ascending" : "descending") : "none"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md py-1 text-xs font-semibold tracking-wide uppercase transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {label}
      <Icon className="size-3.5" aria-hidden />
    </button>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="surface-card flex flex-col gap-3 p-4 md:flex-row md:flex-wrap md:items-end">
      {children}
    </div>
  );
}

export function PaginationBar({
  page,
  totalPages,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  if (total === 0) return null;
  return (
    <div className="flex flex-col items-center justify-between gap-3 pt-1 sm:flex-row">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Page {page} of {totalPages} · {total} result{total === 1 ? "" : "s"}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
