import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, CreditCard, Headphones, Tag, Sparkles } from "lucide-react";
import { appClient } from "@/api/appClient";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { useStore } from "@/lib/store";
import { CATEGORIES, CATEGORY_IMAGES, HERO_IMAGE, getCategoryImage } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import CountdownTimer from "@/components/CountdownTimer";

const TRUST = [
  { icon: Truck, title: "Free Delivery", desc: "On orders above ₹4,999" },
  { icon: ShieldCheck, title: "Genuine Warranty", desc: "Up to 10 years" },
  { icon: CreditCard, title: "Secure Payments", desc: "UPI · Cards · COD" },
  { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { recentlyViewed } = useStore();

  useEffect(() => {
    appClient.entities.Product.list("-created_date", 100)
      .then((d) => setProducts(d))
      .finally(() => setLoading(false));
  }, []);

  const featured = products.filter((p) => p.is_featured).slice(0, 8);
  const newArrivals = products.filter((p) => p.is_new).slice(0, 4);
  const deals = products.filter((p) => p.discount_percentage >= 25).slice(0, 4);

  // recommendations
  let recommended = [];
  if (recentlyViewed.length && products.length) {
    const viewed = products.filter((p) => recentlyViewed.includes(p.id));
    const cats = [...new Set(viewed.map((p) => p.category))];
    recommended = products.filter((p) => cats.includes(p.category) && !recentlyViewed.includes(p.id)).slice(0, 4);
  }
  if (recommended.length < 4) {
    const fill = products.filter((p) => !recommended.includes(p) && p.rating >= 4.2).slice(0, 4 - recommended.length);
    recommended = [...recommended, ...fill];
  }

  const offerEnd = new Date();
  offerEnd.setDate(offerEnd.getDate() + 2);
  offerEnd.setHours(23, 59, 59);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[hsl(222_47%_18%)] text-white">
        <div className="absolute inset-0 opacity-20">
          <Image src={HERO_IMAGE} alt="" fittingType="fill" className="w-full h-full object-cover" />
        </div>
        <div className="relative container-px mx-auto max-w-7xl grid lg:grid-cols-2 gap-8 items-center py-16 sm:py-24">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-sm">
              <Sparkles size={15} className="text-accent" /> Mega Appliance Festival · Up to 40% off
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05]">
              Premium Home Appliances,<br /><span className="text-accent">Smarter Living.</span>
            </h1>
            <p className="text-lg text-white/70 max-w-lg">
              Shop the finest refrigerators, washing machines, ACs, TVs and more from top brands — with genuine warranty, easy EMIs and fast delivery.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products"><Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5 text-base">
                Shop Now <ArrowRight size={18} />
              </Button></Link>
              <Link to="/offers"><Button size="lg" variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white/10 text-base">
                View Offers
              </Button></Link>
            </div>
            <div className="flex gap-6 pt-4 text-sm">
              <div><div className="text-2xl font-bold">12+</div><div className="text-white/60">Categories</div></div>
              <div><div className="text-2xl font-bold">40+</div><div className="text-white/60">Top Brands</div></div>
              <div><div className="text-2xl font-bold">2L+</div><div className="text-white/60">Happy Customers</div></div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20">
              <Image src={HERO_IMAGE} alt="Premium home appliances" fittingType="fill" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white text-foreground rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div className="grid place-items-center h-11 w-11 rounded-full bg-accent/15 text-accent-foreground"><Tag size={20} /></div>
              <div><div className="text-xs text-muted-foreground">Starting from</div><div className="font-bold text-lg">₹6,990</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-b border-border">
        <div className="container-px mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
          {TRUST.map((t) => (
            <div key={t.title} className="flex items-center gap-3">
              <div className="grid place-items-center h-11 w-11 rounded-full bg-muted text-brand"><t.icon size={20} /></div>
              <div><div className="text-sm font-semibold">{t.title}</div><div className="text-xs text-muted-foreground">{t.desc}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-px mx-auto max-w-7xl py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground mt-1">Find exactly what your home needs</p>
          </div>
          <Link to="/products" className="text-brand text-sm font-medium hidden sm:flex items-center gap-1 hover:gap-2 transition-all">View all <ArrowRight size={15} /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/products?category=${encodeURIComponent(c)}`}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                <Image src={CATEGORY_IMAGES[c]} alt={c} fittingType="fill" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3 text-center"><p className="text-sm font-semibold leading-tight">{c}</p></div>
            </Link>
          ))}
        </div>
      </section>

      {/* DEALS BANNER */}
      <section className="container-px mx-auto max-w-7xl">
        <div className="rounded-3xl bg-gradient-to-r from-accent/15 via-accent/10 to-transparent border border-accent/30 p-6 sm:p-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <span className="inline-block bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full mb-3">LIMITED TIME</span>
            <h2 className="text-2xl sm:text-3xl font-bold">Festival Mega Deals</h2>
            <p className="text-muted-foreground mt-2">Flat up to 40% off on best-selling appliances + extra bank discounts.</p>
            <Link to="/offers"><Button className="mt-5 gap-1.5">Grab the deals <ArrowRight size={16} /></Button></Link>
          </div>
          <div className="md:justify-self-end">
            <p className="text-sm font-medium mb-2">Offer ends in</p>
            <CountdownTimer to={offerEnd} />
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-px mx-auto max-w-7xl py-14">
        <div className="flex items-end justify-between mb-8">
          <div><h2 className="text-2xl sm:text-3xl font-bold">Featured Products</h2><p className="text-muted-foreground mt-1">Handpicked best-sellers</p></div>
          <Link to="/products" className="text-brand text-sm font-medium hidden sm:flex items-center gap-1 hover:gap-2 transition-all">View all <ArrowRight size={15} /></Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="container-px mx-auto max-w-7xl pb-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">New Arrivals</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* RECOMMENDED */}
      {recommended.length > 0 && (
        <section className="container-px mx-auto max-w-7xl pb-14">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={20} className="text-accent" />
            <h2 className="text-2xl sm:text-3xl font-bold">Recommended For You</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommended.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* BRANDS */}
      <section className="bg-muted/40 border-y border-border">
        <div className="container-px mx-auto max-w-7xl py-10">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-6">Trusted by leading brands</h2>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xl font-bold text-muted-foreground/70">
            {["Samsung", "LG", "Whirlpool", "Bosch", "Panasonic", "Voltas", "Philips", "Bajaj"].map((b) => <span key={b}>{b}</span>)}
          </div>
        </div>
      </section>
    </div>
  );
}