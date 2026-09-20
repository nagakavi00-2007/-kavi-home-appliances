import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { useStore } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { getCategoryImage } from "@/lib/products";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart, subtotal, originalSubtotal, discount } = useStore();
  const deliveryCharge = subtotal >= 4999 || subtotal === 0 ? 0 : 199;
  const grandTotal = subtotal + deliveryCharge;

  if (cart.length === 0) {
    return (
      <div className="container-px mx-auto max-w-3xl py-24 text-center">
        <div className="grid place-items-center h-20 w-20 rounded-full bg-muted mx-auto mb-5"><ShoppingBag size={32} className="text-muted-foreground" /></div>
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Looks like you haven't added anything yet.</p>
        <Link to="/products"><Button className="mt-6 gap-1.5">Start shopping <ArrowRight size={16} /></Button></Link>
      </div>
    );
  }

  return (
    <div className="container-px mx-auto max-w-7xl py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item) => (
            <div key={item.key} className="flex gap-4 rounded-2xl border border-border p-4 bg-card">
              <Link to={`/product/${item.product_id}`} className="h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-muted">
                <Image src={item.image || getCategoryImage(item.category)} alt={item.name} fittingType="fill" className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{item.brand}</p>
                    <Link to={`/product/${item.product_id}`} className="font-semibold leading-snug hover:text-brand line-clamp-2">{item.name}</Link>
                    {item.color && <p className="text-xs text-muted-foreground mt-0.5">Colour: {item.color}</p>}
                  </div>
                  <button onClick={() => removeFromCart(item.key)} className="text-muted-foreground hover:text-red-500 h-fit"><Trash2 size={18} /></button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-lg">
                    <button onClick={() => updateQty(item.key, item.qty - 1)} className="px-2.5 py-1.5"><Minus size={14} /></button>
                    <span className="px-3 py-1.5 text-sm font-semibold min-w-8 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.key, item.qty + 1)} className="px-2.5 py-1.5"><Plus size={14} /></button>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatINR(item.price * item.qty)}</div>
                    {item.original_price > item.price && <div className="text-xs text-muted-foreground line-through">{formatINR(item.original_price * item.qty)}</div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-brand font-medium hover:gap-2.5 transition-all">← Continue shopping</Link>
        </div>

        {/* summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-44 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({cart.reduce((s,i)=>s+i.qty,0)} items)</span><span>{formatINR(originalSubtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span className="flex items-center gap-1"><Tag size={13} /> Discount</span><span>−{formatINR(discount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{deliveryCharge === 0 ? "FREE" : formatINR(deliveryCharge)}</span></div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-base"><span>Grand Total</span><span>{formatINR(grandTotal)}</span></div>
            </div>
            {subtotal < 4999 && (
              <p className="mt-3 text-xs text-muted-foreground bg-muted rounded-lg p-2.5">Add {formatINR(4999 - subtotal)} more for FREE delivery!</p>
            )}
            <Button onClick={() => navigate("/checkout")} className="w-full mt-5 h-12 gap-1.5">Proceed to Checkout <ArrowRight size={16} /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}