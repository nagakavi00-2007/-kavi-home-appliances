import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Zap, Heart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { formatINR, discountPct } from "@/lib/format";
import { getCategoryImage, getColorHex } from "@/lib/products";
import StarRating from "@/components/StarRating";

export default function QuickViewDialog({ product, open, onOpenChange }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const { toast } = useToast();
  const [color, setColor] = useState(product?.colors?.[0] || "");
  if (!product) return null;
  const imageSrc = product.image || getCategoryImage(product.category);
  const pct = discountPct(product.original_price, product.discount_price);
  const wished = inWishlist(product.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Quick View</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
              <Image src={imageSrc} alt={product.name} fittingType="fill" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.brand}</span>
            <h3 className="text-xl font-bold leading-snug">{product.name}</h3>
            <div className="mt-2 flex items-center gap-2">
              <StarRating rating={product.rating} size={16} />
              <span className="text-sm text-muted-foreground">{product.rating?.toFixed(1)} ({product.review_count} reviews)</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold">{formatINR(product.discount_price)}</span>
              {product.original_price > product.discount_price && (
                <span className="text-muted-foreground line-through">{formatINR(product.original_price)}</span>
              )}
              {pct > 0 && <span className="text-accent-foreground bg-accent px-2 py-0.5 rounded text-xs font-semibold">-{pct}%</span>}
            </div>
            <p className="mt-3 text-sm text-muted-foreground line-clamp-4">{product.description}</p>
            {product.colors?.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Colour: <span className="text-muted-foreground">{color}</span></p>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button key={c} onClick={() => setColor(c)} title={c}
                      className={`h-8 w-8 rounded-full border-2 transition ${color === c ? "border-brand scale-110" : "border-border"}`}
                      style={{ background: getColorHex(c) }} />
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => { addToCart(product, color, 1); toast({ title: "Added to cart" }); onOpenChange(false); }} className="gap-1.5">
                  <ShoppingCart size={16} /> Add to Cart
                </Button>
                <Button onClick={() => { addToCart(product, color, 1); onOpenChange(false); window.location.href = "/checkout"; }} className="gap-1.5 bg-brand hover:bg-brand/90 text-white">
                  <Zap size={16} /> Buy Now
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { toggleWishlist(product); toast({ title: wished ? "Removed" : "Added to wishlist" }); }} className="flex-1 gap-1.5">
                  <Heart size={16} className={wished ? "fill-red-500 text-red-500" : ""} /> {wished ? "In Wishlist" : "Wishlist"}
                </Button>
                <Link to={`/product/${product.id}`} className="flex-1">
                  <Button variant="secondary" className="w-full">View Details</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}