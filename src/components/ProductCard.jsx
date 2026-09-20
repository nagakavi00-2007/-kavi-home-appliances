import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Eye, Zap } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { formatINR, discountPct } from "@/lib/format";
import { getCategoryImage, getColorHex } from "@/lib/products";
import StarRating from "@/components/StarRating";
import QuickViewDialog from "@/components/QuickViewDialog";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const { toast } = useToast();
  const [quickView, setQuickView] = useState(false);

  const pct = discountPct(product.original_price, product.discount_price);
  const outOfStock = (product.stock ?? 0) <= 0;
  const lowStock = !outOfStock && product.stock <= 5;
  const wished = inWishlist(product.id);
  const imageSrc = product.image || getCategoryImage(product.category);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(product, product.colors?.[0] || "", 1);
    toast({ title: "Added to cart", description: product.name });
  };

  const handleBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(product, product.colors?.[0] || "", 1);
    navigate("/checkout");
  };

  const handleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast({ title: wished ? "Removed from wishlist" : "Added to wishlist" });
  };

  return (
    <>
      <div className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] bg-muted overflow-hidden">
          <Image
            src={imageSrc}
            alt={product.name}
            fittingType="fill"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {pct > 0 && <Badge className="bg-accent text-accent-foreground font-semibold shadow">-{pct}%</Badge>}
            {product.is_new && <Badge className="bg-brand text-white shadow">New</Badge>}
          </div>
          <button
            onClick={handleWish}
            aria-label="Toggle wishlist"
            className="absolute top-3 right-3 grid place-items-center h-9 w-9 rounded-full bg-white/90 backdrop-blur shadow hover:bg-white transition"
          >
            <Heart size={18} className={wished ? "fill-red-500 text-red-500" : "text-foreground"} />
          </button>
          {outOfStock && (
            <div className="absolute inset-0 grid place-items-center bg-white/60">
              <span className="bg-foreground text-background px-3 py-1 rounded-full text-xs font-semibold">Out of Stock</span>
            </div>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickView(true); }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-12 group-hover:translate-y-0 transition-transform duration-300 bg-foreground/90 text-background text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5"
          >
            <Eye size={14} /> Quick View
          </button>
        </Link>

        <div className="flex flex-col p-4 flex-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium uppercase tracking-wide">{product.brand}</span>
            <span className="truncate ml-2">{product.category}</span>
          </div>
          <Link to={`/product/${product.id}`} className="mt-1 font-semibold leading-snug line-clamp-2 hover:text-brand transition">
            {product.name}
          </Link>
          <div className="mt-1.5 flex items-center gap-1.5">
            <StarRating rating={product.rating} size={14} />
            <span className="text-xs text-muted-foreground">{product.rating?.toFixed(1)} ({product.review_count})</span>
          </div>

          {product.colors?.length > 0 && (
            <div className="mt-2 flex items-center gap-1">
              {product.colors.slice(0, 4).map((c) => (
                <span key={c} className="h-4 w-4 rounded-full border border-border" style={{ background: getColorHex(c) }} title={c} />
              ))}
            </div>
          )}

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">{formatINR(product.discount_price)}</span>
            {product.original_price > product.discount_price && (
              <span className="text-sm text-muted-foreground line-through">{formatINR(product.original_price)}</span>
            )}
          </div>
          {lowStock && <p className="mt-1 text-xs font-medium text-amber-600">Only {product.stock} left!</p>}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button onClick={handleAdd} disabled={outOfStock} variant="outline" size="sm" className="gap-1.5">
              <ShoppingCart size={15} /> Add
            </Button>
            <Button onClick={handleBuy} disabled={outOfStock} size="sm" className="gap-1.5 bg-brand hover:bg-brand/90 text-white">
              <Zap size={15} /> Buy Now
            </Button>
          </div>
        </div>
      </div>

      <QuickViewDialog product={product} open={quickView} onOpenChange={setQuickView} />
    </>
  );
}