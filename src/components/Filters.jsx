import React from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CATEGORIES, BRANDS, getColorHex } from "@/lib/products";
import { formatINR } from "@/lib/format";
import { X } from "lucide-react";

export default function Filters({ filters, setFilters, onClear }) {
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-xs h-7 gap-1 text-muted-foreground">
          <X size={13} /> Clear all
        </Button>
      </div>

      {/* Category */}
      <div>
        <p className="text-sm font-medium mb-2">Category</p>
        <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
          {CATEGORIES.map((c) => (
            <div key={c} className="flex items-center gap-2">
              <Checkbox id={`cat-${c}`} checked={filters.category.includes(c)}
                onCheckedChange={(v) => {
                  set("category", v ? [...filters.category, c] : filters.category.filter((x) => x !== c));
                }} />
              <Label htmlFor={`cat-${c}`} className="text-sm font-normal cursor-pointer">{c}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <p className="text-sm font-medium mb-2">Brand</p>
        <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar pr-1">
          {BRANDS.map((b) => (
            <div key={b} className="flex items-center gap-2">
              <Checkbox id={`br-${b}`} checked={filters.brand.includes(b)}
                onCheckedChange={(v) => set("brand", v ? [...filters.brand, b] : filters.brand.filter((x) => x !== b))} />
              <Label htmlFor={`br-${b}`} className="text-sm font-normal cursor-pointer">{b}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-sm font-medium mb-2">Price range</p>
        <Slider value={filters.price} min={0} max={150000} step={1000} onValueChange={(v) => set("price", v)} className="my-3" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatINR(filters.price[0])}</span>
          <span>{formatINR(filters.price[1])}</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="text-sm font-medium mb-2">Rating</p>
        <div className="flex flex-wrap gap-2">
          {[4, 3, 2, 1].map((r) => (
            <button key={r} onClick={() => set("rating", filters.rating === r ? 0 : r)}
              className={`px-3 py-1 rounded-full text-xs border transition ${filters.rating === r ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
              {r}★ & up
            </button>
          ))}
        </div>
      </div>

      {/* Discount */}
      <div>
        <p className="text-sm font-medium mb-2">Discount</p>
        <div className="flex flex-wrap gap-2">
          {[10, 20, 30, 50].map((d) => (
            <button key={d} onClick={() => set("discount", filters.discount === d ? 0 : d)}
              className={`px-3 py-1 rounded-full text-xs border transition ${filters.discount === d ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
              {d}% & up
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <p className="text-sm font-medium mb-2">Availability</p>
        <div className="flex items-center gap-2">
          <Checkbox id="instock" checked={filters.inStock}
            onCheckedChange={(v) => set("inStock", v)} />
          <Label htmlFor="instock" className="text-sm font-normal cursor-pointer">In stock only</Label>
        </div>
      </div>

      {/* Colour */}
      <div>
        <p className="text-sm font-medium mb-2">Colour</p>
        <div className="flex flex-wrap gap-2">
          {["Silver", "Black", "White", "Steel Blue", "Grey", "Champagne", "Rose Gold", "Titanium", "Pearl White", "Graphite"].map((c) => (
            <button key={c} title={c} onClick={() => set("color", filters.color === c ? "" : c)}
              className={`h-7 w-7 rounded-full border-2 transition ${filters.color === c ? "border-brand scale-110" : "border-border"}`}
              style={{ background: getColorHex(c) }} />
          ))}
        </div>
      </div>
    </div>
  );
}