import { Star } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
} as const;

type StarDisplayProps = {
  value: number | null;
  size?: keyof typeof SIZES;
  className?: string;
  label?: string;
};

/** Read-only star display; supports fractional averages. */
export function StarDisplay({ value, size = "sm", className, label }: StarDisplayProps) {
  const rating = value ?? 0;
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={label ?? (value === null ? "Not rated yet" : `${rating} out of 5 stars`)}
    >
      {[1, 2, 3, 4, 5].map((index) => {
        const fill = Math.max(0, Math.min(1, rating - (index - 1)));
        return (
          <span key={index} className={cn("relative inline-block", SIZES[size])} aria-hidden>
            <Star className={cn(SIZES[size], "absolute inset-0 text-star-muted")} fill="currentColor" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star className={cn(SIZES[size], "text-star")} fill="currentColor" />
            </span>
          </span>
        );
      })}
    </span>
  );
}

type StarRatingInputProps = {
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: keyof typeof SIZES;
  name?: string;
  ariaLabel?: string;
};

/**
 * Accessible interactive rating control.
 * Implemented as a radio group: arrow keys and number keys work, each star has
 * a real label, and the numeric value is always shown as text (never colour alone).
 */
export function StarRatingInput({
  value,
  onChange,
  disabled = false,
  size = "lg",
  name = "rating",
  ariaLabel = "Your rating",
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? value ?? 0;

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1"
      onMouseLeave={() => setHovered(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const selected = value === star;
        return (
          <label
            key={star}
            className={cn(
              "group relative cursor-pointer rounded-md p-1 transition-transform",
              disabled ? "cursor-not-allowed opacity-60" : "hover:scale-110 active:scale-95",
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
            )}
            onMouseEnter={() => !disabled && setHovered(star)}
          >
            <input
              type="radio"
              name={name}
              value={star}
              checked={selected}
              disabled={disabled}
              onChange={() => onChange(star)}
              className="sr-only"
            />
            <span className="sr-only">{`Rate ${star} out of 5`}</span>
            <Star
              aria-hidden
              className={cn(
                SIZES[size],
                "transition-colors",
                star <= active ? "text-star" : "text-star-muted",
              )}
              fill={star <= active ? "currentColor" : "none"}
              strokeWidth={1.75}
            />
          </label>
        );
      })}
    </div>
  );
}
