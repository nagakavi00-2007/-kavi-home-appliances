import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { appClient } from "@/api/appClient";
import { PRODUCTS } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import ProductCard from "@/components/ProductCard";
import Filters from "@/components/Filters";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
  { value: "discount", label: "Best Discount" },
];

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [all, setAll] = useState(/** @type {any[]} */ ([]));
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("featured");
  const [mobileFilters, setMobileFilters] = useState(false);

  const search = params.get("search") || "";
  const initialCat = params.get("category") || "";

  const [filters, setFilters] = useState(/** @type {{ category: string[], brand: string[], price: number[], rating: number, discount: number, inStock: boolean, color: string }} */ ({
    category: initialCat ? [initialCat] : [],
    brand: [],
    price: [0, 150000],
    rating: 0,
    discount: 0,
    inStock: false,
    color: "",
  }));

  useEffect(() => {
    appClient.entities.Product.list()
      .then((d) => setAll(Array.isArray(d) && d.length ? d : PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  // keep filter in sync when URL category changes
  useEffect(() => {
    setFilters((f) => ({ ...f, category: initialCat ? [initialCat] : [] }));
  }, [initialCat]);

  const filtered = useMemo(() => {
    let list = [...all];
    const q = search.toLowerCase();
    if (q) {
      list = list.filter((p) =>
        [p.name, p.brand, p.category, p.model].some((v) => String(v || "").toLowerCase().includes(q))
      );
    }
    if (filters.category.length) list = list.filter((p) => filters.category.includes(p.category));
    if (filters.brand.length) list = list.filter((p) => filters.brand.includes(p.brand));
    list = list.filter((p) => Number(p.discount_price ?? p.sellingPrice ?? 0) >= filters.price[0] && Number(p.discount_price ?? p.sellingPrice ?? 0) <= filters.price[1]);
    if (filters.rating) list = list.filter((p) => p.rating >= filters.rating);
    if (filters.discount) list = list.filter((p) => (p.discount_percentage || 0) >= filters.discount);
    if (filters.inStock) list = list.filter((p) => (p.stock ?? 0) > 0);
    if (filters.color) list = list.filter((p) => p.colors?.includes(filters.color));

    switch (sort) {
      case "price_asc": list.sort((a, b) => Number(a.discount_price ?? a.sellingPrice) - Number(b.discount_price ?? b.sellingPrice)); break;
      case "price_desc": list.sort((a, b) => Number(b.discount_price ?? b.sellingPrice) - Number(a.discount_price ?? a.sellingPrice)); break;
      case "rating": list.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case "newest": list.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime()); break;
      case "discount": list.sort((a, b) => (b.discount_percentage || 0) - (a.discount_percentage || 0)); break;
      default: list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }
    return list;
  }, [all, filters, sort, search]);

  const clearAll = () => {
    setFilters({ category: [], brand: [], price: [0, 150000], rating: 0, discount: 0, inStock: false, color: "" });
    const next = new URLSearchParams(params);
    next.delete("category");
    setParams(next);
  };

  const FiltersPanel = (
    <Filters filters={filters} setFilters={setFilters} onClear={clearAll} />
  );

  return (
    <div className="container-px mx-auto max-w-7xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {search ? `Results for "${search}"` : initialCat || "All Products"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{loading ? "Loading…" : `${filtered.length} products found`}</p>
      </div>

      <div className="flex gap-6">
        {/* desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-44 bg-card border border-border rounded-2xl p-5">
            {FiltersPanel}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* toolbar */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <Sheet open={mobileFilters} onOpenChange={setMobileFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden gap-1.5"><SlidersHorizontal size={16} /> Filters</Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetTitle className="p-5">Filters</SheetTitle>
                <div className="px-5 pb-8">{FiltersPanel}</div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-muted-foreground hidden sm:inline">Sort by</span>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SORTS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* active chips */}
          {(filters.category.length > 0 || filters.brand.length > 0 || filters.color) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.category.map((c) => (
                <button key={c} onClick={() => setFilters((f) => ({ ...f, category: f.category.filter((x) => x !== c) }))}
                  className="text-xs bg-muted rounded-full px-3 py-1 flex items-center gap-1">{c} <X size={12} /></button>
              ))}
              {filters.brand.map((b) => (
                <button key={b} onClick={() => setFilters((f) => ({ ...f, brand: f.brand.filter((x) => x !== b) }))}
                  className="text-xs bg-muted rounded-full px-3 py-1 flex items-center gap-1">{b} <X size={12} /></button>
              ))}
              {filters.color && (
                <button onClick={() => setFilters((f) => ({ ...f, color: "" }))}
                  className="text-xs bg-muted rounded-full px-3 py-1 flex items-center gap-1">{filters.color} <X size={12} /></button>
              )}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-medium">No products match your filters</p>
              <Button variant="outline" onClick={clearAll} className="mt-4">Clear filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}