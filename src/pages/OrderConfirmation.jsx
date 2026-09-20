import React from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle2, Package, Truck, MapPin, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/format";

export default function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <div className="container-px mx-auto max-w-3xl py-24 text-center">
        <h1 className="text-2xl font-bold">No recent order found</h1>
        <Link to="/products"><Button className="mt-4">Continue shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="container-px mx-auto max-w-3xl py-12">
      <div className="text-center mb-8">
        <div className="grid place-items-center h-20 w-20 rounded-full bg-green-100 mx-auto mb-4"><CheckCircle2 size={40} className="text-green-600" /></div>
        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground mt-2">Thank you for your purchase. Your order is being processed.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-border">
          <div><p className="text-sm text-muted-foreground">Order ID</p><p className="font-bold text-lg">{order.order_id}</p></div>
          <div className="text-right"><p className="text-sm text-muted-foreground">Estimated Delivery</p><p className="font-semibold">{order.estimated_delivery}</p></div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-2"><MapPin size={18} className="text-brand shrink-0" /><div><p className="font-medium">Delivery Address</p><p className="text-muted-foreground">{order.customer_name}, {order.address}, {order.city}, {order.state} - {order.pincode}</p><p className="text-muted-foreground">{order.phone}</p></div></div>
          <div className="flex gap-2"><CreditCard size={18} className="text-brand shrink-0" /><div><p className="font-medium">Payment Method</p><p className="text-muted-foreground">{order.payment_method}</p><p className="text-muted-foreground">{order.delivery_option}</p></div></div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="font-medium mb-3 flex items-center gap-2"><Package size={18} /> Items Ordered</p>
          <div className="space-y-2">
            {order.items.map((i, idx) => (
              <div key={idx} className="flex justify-between text-sm"><span className="text-muted-foreground">{i.name} ({i.color}) × {i.qty}</span><span className="font-medium">{formatINR(i.price * i.qty)}</span></div>
            ))}
          </div>
          <div className="space-y-1.5 text-sm border-t border-border mt-3 pt-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>−{formatINR(order.discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{order.delivery_charge === 0 ? "FREE" : formatINR(order.delivery_charge)}</span></div>
            <div className="flex justify-between font-bold text-base pt-1"><span>Grand Total</span><span>{formatINR(order.grand_total)}</span></div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mt-6">
        <Link to="/track"><Button variant="outline" className="gap-1.5"><Truck size={16} /> Track Order</Button></Link>
        <Link to="/products"><Button className="gap-1.5">Continue Shopping <ArrowRight size={16} /></Button></Link>
      </div>
    </div>
  );
}