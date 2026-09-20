import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StarRating({ rating = 0, size = 16, className, showValue = false, count }) {
  const r = Number(rating) || 0;
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={cn(
              i <= Math.round(r) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/40"
            )}
          />
        ))}
      </div>
      {showValue && <span className="text-sm font-semibold text-foreground">{r.toFixed(1)}</span>}
      {typeof count === "number" && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}