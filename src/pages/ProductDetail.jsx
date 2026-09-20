import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart, Zap, Heart, Truck, ShieldCheck, RefreshCw, Check, ChevronRight, Star,
} from "lucide-react";
import { appClient } from "@/api/appClient";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { formatINR, discountPct } from "@/lib/format";
import { getCategoryImage, getColorHex } from "@/lib/products";
import StarRating from "@/components/StarRating";
import ProductCard from "@/components/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, inWishlist, addRecentlyViewed } = useStore();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", description: "", user_name: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    appClient.entities.Product.get(id)
      .then((p) => {
        setProduct(p);
        setColor(p?.colors?.[0] || "");
        setActiveImg(0);
        addRecentlyViewed(p.id);
        return appClient.entities.Product.filter({ category: p.category }, "-rating", 6);
      })
      .then((r) => setRelated((r || []).filter((x) => x.id !== id)))
      .finally(() => setLoading(false));
    appClient.entities.Review.filter({ product_id: id }).then(setReviews).catch(() => {});
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.user_name || !reviewForm.title) {
      toast({ title: "Please fill your name and review title", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const created = await appClient.entities.Review.create({
        product_id: id,
        product_name: product.name,
        user_name: reviewForm.user_name,
        rating: Number(reviewForm.rating),
        title: reviewForm.title,
        description: reviewForm.description,
        verified: true,
      });
      setReviews((r) => [created, ...r]);
      setReviewForm({ rating: 5, title: "", description: "", user_name: "" });
      toast({ title: "Review submitted!" });
    } catch {
      toast({ title: "Could not submit review", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container-px mx-auto max-w-7xl py-20"><div className="aspect-[4/3] rounded-2xl bg-muted animate-pulse max-w-2xl" /></div>;
  }
  if (!product) {
    return (
      <div className="container-px mx-auto max-w-3xl py-24 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/products"><Button className="mt-4">Browse products</Button></Link>
      </div>
    );
  }

  const pct = discountPct(product.original_price, product.discount_price);
  const outOfStock = (product.stock ?? 0) <= 0;
  const wished = inWishlist(product.id);
  const imageSrc = product.image || getCategoryImage(product.category);
  const gallery = [imageSrc, imageSrc, imageSrc];
  const specs = (() => {
    try { return JSON.parse(product.specifications || "{}"); } catch { return {}; }
  })();

  const handleAdd = () => { addToCart(product, color, qty); toast({ title: "Added to cart", description: `${qty} × ${product.name}` }); };
  const handleBuy = () => { addToCart(product, color, qty); navigate("/checkout"); };

  return (
    <div className="container-px mx-auto max-w-7xl py-6">
      {/* breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link to="/" className="hover:text-foreground">Home</Link><ChevronRight size={14} />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-foreground">{product.category}</Link><ChevronRight size={14} />
        <span className="text-foreground truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* gallery */}
        <div>
          <div className="aspect-square rounded-2xl bg-muted overflow-hidden border border-border">
            <Image src={gallery[activeImg]} alt={product.name} fittingType="fill" className="w-full h-full object-cover" />
          </div>
          <div className="mt-3 flex gap-3">
            {gallery.map((g, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`h-20 w-20 rounded-xl overflow-hidden border-2 transition ${activeImg === i ? "border-brand" : "border-border"}`}>
                <Image src={g} alt="" fittingType="fill" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* info */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium uppercase tracking-wide text-brand">{product.brand}</span>
            {product.is_new && <Badge className="bg-brand text-white">New</Badge>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1 leading-tight">{product.name}</h1>
          {product.model && <p className="text-sm text-muted-foreground mt-1">Model: {product.model}</p>}
          <div className="mt-2 flex items-center gap-3">
            <StarRating rating={product.rating} size={18} showValue />
            <span className="text-sm text-muted-foreground">{product.review_count} reviews</span>
            <span className="text-sm text-muted-foreground">·</span>
            <span className={`text-sm font-medium ${outOfStock ? "text-red-500" : "text-green-600"}`}>
              {outOfStock ? "Out of stock" : "In stock"}
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatINR(product.discount_price)}</span>
            {product.original_price > product.discount_price && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatINR(product.original_price)}</span>
                <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded text-sm font-semibold">{pct}% off</span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>

          <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>

          {/* colour */}
          {product.colors?.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-medium mb-2">Select Colour: <span className="text-muted-foreground font-normal">{color}</span></p>
              <div className="flex gap-2.5">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)} title={c}
                    className={`h-9 w-9 rounded-full border-2 transition flex items-center justify-center ${color === c ? "border-brand scale-110" : "border-border"}`}
                    style={{ background: getColorHex(c) }}>
                    {color === c && <Check size={15} className="text-white drop-shadow" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* qty + actions */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center border border-border rounded-lg">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2.5 text-lg">−</button>
              <span className="px-4 py-2.5 font-semibold min-w-12 text-center">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2.5 text-lg">+</button>
            </div>
            <Button onClick={handleAdd} disabled={outOfStock} className="flex-1 gap-1.5 h-12">
              <ShoppingCart size={18} /> Add to Cart
            </Button>
            <Button onClick={handleBuy} disabled={outOfStock} className="flex-1 gap-1.5 h-12 bg-brand hover:bg-brand/90 text-white">
              <Zap size={18} /> Buy Now
            </Button>
            <Button onClick={() => { toggleWishlist(product); toast({ title: wished ? "Removed from wishlist" : "Added to wishlist" }); }}
              variant="outline" className="h-12 px-3">
              <Heart size={18} className={wished ? "fill-red-500 text-red-500" : ""} />
            </Button>
          </div>

          {/* delivery info */}
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {[
              { icon: Truck, title: "Free Delivery", desc: "2-4 business days" },
              { icon: ShieldCheck, title: "Warranty", desc: product.warranty_period || "1 Year" },
              { icon: RefreshCw, title: "Easy Returns", desc: "7-day return policy" },
            ].map((b) => (
              <div key={b.title} className="flex items-center gap-2.5 rounded-xl border border-border p-3">
                <b.icon size={20} className="text-brand" />
                <div><div className="text-sm font-semibold">{b.title}</div><div className="text-xs text-muted-foreground">{b.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* tabs */}
      <div className="mt-12">
        <Tabs defaultValue="specs">
          <TabsList className="w-full justify-start flex-wrap h-auto">
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="warranty">Warranty</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="specs" className="mt-4">
            <div className="rounded-2xl border border-border overflow-hidden">
              {Object.keys(specs).length === 0 ? (
                <p className="p-6 text-muted-foreground">Specifications not available.</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(specs).map(([k, v], i) => (
                      <tr key={k} className={i % 2 ? "bg-muted/40" : ""}>
                        <td className="px-5 py-3 font-medium w-1/3 align-top">{k}</td>
                        <td className="px-5 py-3 text-muted-foreground">{String(v)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="description" className="mt-4">
            <p className="text-muted-foreground leading-relaxed max-w-3xl">{product.description}</p>
          </TabsContent>

          <TabsContent value="warranty" className="mt-4">
            <div className="rounded-2xl border border-border p-6 max-w-2xl space-y-3">
              <div className="flex items-center gap-2"><ShieldCheck className="text-brand" /><h3 className="font-semibold">Warranty Information</h3></div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Warranty Period:</span> <span className="font-medium">{product.warranty_period || "1 Year"}</span></div>
                <div><span className="text-muted-foreground">Warranty Type:</span> <span className="font-medium">{product.warranty_type || "Manufacturer Warranty"}</span></div>
              </div>
              <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Coverage:</span> {product.warranty_coverage || "Covers manufacturing defects. Does not cover physical damage."}</p>
              <Link to="/warranty"><Button variant="outline" className="mt-2">Register Warranty</Button></Link>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <div className="grid lg:grid-cols-2 gap-8">
              <form onSubmit={submitReview} className="rounded-2xl border border-border p-6 space-y-4">
                <h3 className="font-semibold">Write a Review</h3>
                <div>
                  <Label className="mb-1.5 block">Your Rating</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button type="button" key={i} onClick={() => setReviewForm((f) => ({ ...f, rating: i }))}>
                        <Star size={26} className={i <= reviewForm.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/40"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div><Label className="mb-1.5 block">Your Name</Label><Input value={reviewForm.user_name} onChange={(e) => setReviewForm((f) => ({ ...f, user_name: e.target.value }))} placeholder="John Doe" /></div>
                <div><Label className="mb-1.5 block">Review Title</Label><Input value={reviewForm.title} onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))} placeholder="Great product!" /></div>
                <div><Label className="mb-1.5 block">Review</Label><Textarea value={reviewForm.description} onChange={(e) => setReviewForm((f) => ({ ...f, description: e.target.value }))} rows={4} placeholder="Share your experience…" /></div>
                <Button type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Submit Review"}</Button>
              </form>

              <div className="space-y-4">
                {reviews.length === 0 && <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>}
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-border p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="grid place-items-center h-9 w-9 rounded-full bg-primary text-primary-foreground font-semibold">{r.user_name?.[0]?.toUpperCase()}</div>
                        <div><p className="font-medium text-sm">{r.user_name}</p>
                          {r.verified && <p className="text-xs text-green-600 flex items-center gap-1"><Check size={12} /> Verified Purchase</p>}</div>
                      </div>
                      <StarRating rating={r.rating} size={14} />
                    </div>
                    <p className="font-semibold mt-3">{r.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* related */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {related.slice(0, 5).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}