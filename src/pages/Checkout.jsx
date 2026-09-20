import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { appClient } from "@/api/appClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { formatINR } from "@/lib/format";
import { getCategoryImage } from "@/lib/products";
import { Image } from "@/components/ui/image";

const PAYMENTS = [
  { id: "COD", label: "Cash on Delivery", desc: "Pay when you receive" },
  { id: "UPI", label: "UPI", desc: "GPay, PhonePe, Paytm" },
  { id: "Credit Card", label: "Credit Card", desc: "Visa, Mastercard, RuPay" },
  { id: "Debit Card", label: "Debit Card", desc: "All major banks" },
  { id: "Net Banking", label: "Net Banking", desc: "All major banks" },
];

const DELIVERY = [
  { id: "Standard", label: "Standard Delivery (2-4 days)", desc: "Free for orders above ₹4,999", charge: 0 },
  { id: "Express", label: "Express Delivery (1-2 days)", desc: "Additional ₹299", charge: 299 },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, subtotal, originalSubtotal, discount, clearCart } = useStore();
  const { toast } = useToast();
  const [form, setForm] = useState({ customer_name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" });
  const [delivery, setDelivery] = useState("Standard");
  const [payment, setPayment] = useState("COD");
  const [placing, setPlacing] = useState(false);

  const deliveryCharge = delivery === "Express" ? 299 : subtotal >= 4999 ? 0 : 199;
  const grandTotal = subtotal + deliveryCharge;

  if (cart.length === 0) {
    return (
      <div className="container-px mx-auto max-w-3xl py-24 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link to="/products"><Button className="mt-4">Browse products</Button></Link>
      </div>
    );
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    const required = ["customer_name", "email", "phone", "address", "city", "state", "pincode"];
    for (const k of required) {
      if (!form[k]) { toast({ title: "Please fill all required fields", variant: "destructive" }); return; }
    }
    if (!/^\d{10}$/.test(form.phone)) { toast({ title: "Enter a valid 10-digit phone number", variant: "destructive" }); return; }
    if (!/^\d{6}$/.test(form.pincode)) { toast({ title: "Enter a valid 6-digit pincode", variant: "destructive" }); return; }

    setPlacing(true);
    const orderId = "VC" + Date.now().toString().slice(-8);
    const eta = new Date(); eta.setDate(eta.getDate() + (delivery === "Express" ? 2 : 4));
    try {
      const order = await appClient.entities.Order.create({
        order_id: orderId,
        customer_name: form.customer_name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        delivery_option: delivery,
        payment_method: payment,
        items: cart.map((i) => ({ name: i.name, brand: i.brand, color: i.color, qty: i.qty, price: i.price })),
        subtotal,
        discount,
        delivery_charge: deliveryCharge,
        grand_total: grandTotal,
        status: "placed",
        estimated_delivery: eta.toISOString().split("T")[0],
      });
      clearCart();
      navigate("/order-confirmation", { state: { order } });
    } catch (err) {
      toast({ title: "Could not place order. Please try again.", variant: "destructive" });
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container-px mx-auto max-w-7xl py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={placeOrder} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* contact */}
          <div className="rounded-2xl border border-border p-6">
            <h2 className="font-semibold mb-4">Contact Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label className="mb-1.5 block">Full Name *</Label><Input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} placeholder="John Doe" /></div>
              <div><Label className="mb-1.5 block">Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" /></div>
              <div><Label className="mb-1.5 block">Phone *</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile" maxLength={10} /></div>
            </div>
          </div>
          {/* address */}
          <div className="rounded-2xl border border-border p-6">
            <h2 className="font-semibold mb-4">Delivery Address</h2>
            <div className="grid gap-4">
              <div><Label className="mb-1.5 block">Address *</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House no, street, area" /></div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div><Label className="mb-1.5 block">City *</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                <div><Label className="mb-1.5 block">State *</Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
                <div><Label className="mb-1.5 block">Pincode *</Label><Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} maxLength={6} /></div>
              </div>
            </div>
          </div>
          {/* delivery */}
          <div className="rounded-2xl border border-border p-6">
            <h2 className="font-semibold mb-4">Delivery Option</h2>
            <RadioGroup value={delivery} onValueChange={setDelivery} className="space-y-3">
              {DELIVERY.map((d) => (
                <label key={d.id} className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition ${delivery === d.id ? "border-brand bg-brand/5" : "border-border"}`}>
                  <RadioGroupItem value={d.id} />
                  <div className="flex-1"><div className="font-medium">{d.label}</div><div className="text-xs text-muted-foreground">{d.desc}</div></div>
                </label>
              ))}
            </RadioGroup>
          </div>
          {/* payment */}
          <div className="rounded-2xl border border-border p-6">
            <h2 className="font-semibold mb-4">Payment Method</h2>
            <RadioGroup value={payment} onValueChange={setPayment} className="grid sm:grid-cols-2 gap-3">
              {PAYMENTS.map((p) => (
                <label key={p.id} className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition ${payment === p.id ? "border-brand bg-brand/5" : "border-border"}`}>
                  <RadioGroupItem value={p.id} />
                  <div><div className="font-medium text-sm">{p.label}</div><div className="text-xs text-muted-foreground">{p.desc}</div></div>
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-44 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar mb-4">
              {cart.map((i) => (
                <div key={i.key} className="flex gap-3 items-center">
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0"><Image src={i.image || getCategoryImage(i.category)} alt="" fittingType="fill" className="w-full h-full object-cover" /></div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium line-clamp-1">{i.name}</p><p className="text-xs text-muted-foreground">{i.color} · Qty {i.qty}</p></div>
                  <span className="text-sm font-semibold">{formatINR(i.price * i.qty)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t border-border pt-4">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(originalSubtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>−{formatINR(discount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{deliveryCharge === 0 ? "FREE" : formatINR(deliveryCharge)}</span></div>
              <div className="border-t border-border pt-2 flex justify-between font-bold text-base"><span>Grand Total</span><span>{formatINR(grandTotal)}</span></div>
            </div>
            <Button type="submit" disabled={placing} className="w-full mt-5 h-12 gap-1.5">
              {placing ? "Placing order…" : <>Place Order <ArrowRight size={16} /></>}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-3"><ShieldCheck size={14} /> Secure & encrypted checkout</p>
          </div>
        </div>
      </form>
    </div>
  );
}