import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tag, Copy, Clock, Gift, Banknote, Layers, Zap } from "lucide-react";
import { appClient } from "@/api/appClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import ProductCard from "@/components/ProductCard";
import CountdownTimer from "@/components/CountdownTimer";

const COUPONS = [
  { code: "FESTIVE40", desc: "Flat 40% off on refrigerators & ACs", expiry: "Sep 30, 2026" },
  { code: "VASANTH10", desc: "Extra 10% off on all washing machines", expiry: "Oct 15, 2026" },
  { code: "NEWUSER500", desc: "₹500 off on first order above ₹5,000", expiry: "Dec 31, 2026" },
  { code: "BANK500", desc: "₹500 instant discount with HDFC cards", expiry: "Oct 31, 2026" },
];

const OFFER_CARDS = [
  { icon: Zap, title: "Lightning Deals", desc: "Limited-stock flash discounts refreshed every hour", tone: "bg-red-50 text-red-600" },
  { icon: Gift, title: "Festival Offers", desc: "Celebrate with up to 40% off across categories", tone: "bg-amber-50 text-amber-600" },
  { icon: Layers, title: "Combo Offers", desc: "Buy a TV + soundbar and save ₹8,000", tone: "bg-blue-50 text-brand" },
  { icon: Banknote, title: "Bank Offers", desc: "Extra ₹500–₹2,000 off with leading bank cards", tone: "bg-green-50 text-green-600" },
];

export default function Offers() {
  const [products, setProducts] = useState([]);
  const { toast } = useToast();

  useEffect(() => { appClient.entities.Product.list("-discount_percentage", 100).then(setProducts); }, []);
  const deals = products.filter((p) => (p.discount_percentage || 0) >= 20).slice(0, 8);

  const flashEnd = new Date(); flashEnd.setHours(flashEnd.getHours() + 8);

  const copy = (code) => {
    navigator.clipboard?.writeText(code);
    toast({ title: "Coupon copied!", description: code });
  };

  return (
    <div>
      {/* hero */}
      <section className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border-b border-border">
        <div className="container-px mx-auto max-w-7xl py-12 text-center">
          <Badge className="bg-accent text-accent-foreground mb-3">LIMITED TIME</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Offers & Deals</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Unbeatable prices on premium home appliances. Grab them before they're gone!</p>
        </div>
      </section>

      {/* offer types */}
      <section className="container-px mx-auto max-w-7xl py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {OFFER_CARDS.map((o) => (
            <div key={o.title} className="rounded-2xl border border-border p-5 hover:shadow-lg transition">
              <div className={`grid place-items-center h-12 w-12 rounded-xl mb-3 ${o.tone}`}><o.icon size={22} /></div>
              <h3 className="font-semibold">{o.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{o.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* flash deal */}
      <section className="container-px mx-auto max-w-7xl">
        <div className="rounded-3xl bg-primary text-white p-6 sm:p-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm"><Zap size={14} className="text-accent" /> Flash Sale</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-3">Up to 40% off — Today Only</h2>
            <p className="text-white/70 mt-2">Hand-picked deals on best-sellers. Hurry, limited stock!</p>
            <Link to="/products?sort=discount"><Button className="mt-5 bg-accent text-accent-foreground hover:bg-accent/90">Shop the sale</Button></Link>
          </div>
          <div className="md:justify-self-end">
            <p className="text-sm font-medium mb-2 flex items-center gap-1.5"><Clock size={15} /> Ends in</p>
            <CountdownTimer to={flashEnd} />
          </div>
        </div>
      </section>

      {/* coupons */}
      <section className="container-px mx-auto max-w-7xl py-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Tag className="text-accent" /> Coupon Codes</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {COUPONS.map((c) => (
            <div key={c.code} className="rounded-2xl border border-dashed border-border p-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-lg bg-muted px-3 py-1 rounded">{c.code}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{c.desc}</p>
                <p className="text-xs text-muted-foreground mt-1">Valid till {c.expiry}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => copy(c.code)} className="gap-1.5 shrink-0"><Copy size={14} /> Copy</Button>
            </div>
          ))}
        </div>
      </section>

      {/* deal products */}
      <section className="container-px mx-auto max-w-7xl pb-14">
        <h2 className="text-2xl font-bold mb-6">Top Discounted Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {deals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}