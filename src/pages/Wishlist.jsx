import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { useStore } from "@/lib/store";
import { formatINR, discountPct } from "@/lib/format";
import { getCategoryImage } from "@/lib/products";
import StarRating from "@/components/StarRating";

export default function Wishlist() {
  const { wishlist, toggleWishlist, moveToCart } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="container-px mx-auto max-w-3xl py-24 text-center">
        <div className="grid place-items-center h-20 w-20 rounded-full bg-muted mx-auto mb-5"><Heart size={32} className="text-muted-foreground" /></div>
        <h1 className="text-2xl font-bold">Your wishlist is empty</h1>
        <p className="text-muted-foreground mt-2">Save items you love to find them quickly later.</p>
        <Link to="/products"><Button className="mt-6 gap-1.5">Explore products <ArrowRight size={16} /></Button></Link>
      </div>
    );
  }

  return (
    <div className="container-px mx-auto max-w-7xl py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">My Wishlist ({wishlist.length})</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlist.map((p) => {
          const pct = discountPct(p.original_price, p.price);
          return (
            <div key={p.id} className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
              <Link to={`/product/${p.id}`} className="aspect-[4/3] bg-muted overflow-hidden">
                <Image src={p.image || getCategoryImage(p.category)} alt={p.name} fittingType="fill" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-muted-foreground uppercase">{p.brand}</p>
                <Link to={`/product/${p.id}`} className="font-semibold leading-snug line-clamp-2 hover:text-brand">{p.name}</Link>
                <div className="mt-1"><StarRating rating={p.rating || 0} size={14} /></div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-bold">{formatINR(p.price)}</span>
                  {p.original_price > p.price && <span className="text-sm text-muted-foreground line-through">{formatINR(p.original_price)}</span>}
                  {pct > 0 && <span className="text-xs text-accent-foreground font-semibold">-{pct}%</span>}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button size="sm" onClick={() => moveToCart(p)} className="gap-1.5"><ShoppingCart size={15} /> Move to Cart</Button>
                  <Button size="sm" variant="outline" onClick={() => toggleWishlist(p)} className="gap-1.5 text-red-500"><Trash2 size={15} /> Remove</Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}