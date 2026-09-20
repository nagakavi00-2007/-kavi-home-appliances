import React, { useEffect, useState } from "react";
import { Search, PackageCheck, ClipboardCheck, Boxes, Truck, DoorOpen, CheckCircle2 } from "lucide-react";
import { appClient } from "@/api/appClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatINR } from "@/lib/format";

const STEPS = [
  { key: "placed", label: "Order Placed", icon: PackageCheck },
  { key: "confirmed", label: "Confirmed", icon: ClipboardCheck },
  { key: "packed", label: "Packed", icon: Boxes },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery", icon: DoorOpen },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const track = async (e) => {
    e.preventDefault();
    if (!orderId) return;
    setLoading(true); setError(""); setOrder(null);
    try {
      const res = await appClient.entities.Order.filter({ order_id: orderId.trim() });
      if (res && res.length) setOrder(res[0]);
      else setError("No order found with that ID.");
    } catch {
      setError("Could not fetch order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentIdx = order ? STEPS.findIndex((s) => s.key === order.status) : -1;

  return (
    <div className="container-px mx-auto max-w-3xl py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Track Your Order</h1>
        <p className="text-muted-foreground mt-2">Enter your order ID to see the latest status.</p>
      </div>

      <form onSubmit={track} className="flex gap-2 max-w-md mx-auto">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="e.g. VC12345678" className="pl-10" />
        </div>
        <Button type="submit" disabled={loading}>{loading ? "Tracking…" : "Track"}</Button>
      </form>

      {error && <p className="text-center text-red-500 mt-6">{error}</p>}

      {order && (
        <div className="mt-10">
          <div className="rounded-2xl border border-border p-6 mb-8">
            <div className="flex flex-wrap justify-between gap-2">
              <div><p className="text-sm text-muted-foreground">Order ID</p><p className="font-bold text-lg">{order.order_id}</p></div>
              <div className="text-right"><p className="text-sm text-muted-foreground">Estimated Delivery</p><p className="font-semibold">{order.estimated_delivery}</p></div>
            </div>
            <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-sm">
              {order.items?.map((i, idx) => (
                <div key={idx} className="flex justify-between"><span className="text-muted-foreground">{i.name} × {i.qty}</span><span>{formatINR(i.price * i.qty)}</span></div>
              ))}
              <div className="flex justify-between font-bold pt-1.5"><span>Grand Total</span><span>{formatINR(order.grand_total)}</span></div>
            </div>
          </div>

          {/* progress */}
          <div className="relative">
            <div className="hidden sm:block absolute top-7 left-7 right-7 h-1 bg-border rounded">
              <div className="h-full bg-brand rounded transition-all duration-500" style={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }} />
            </div>
            <ol className="relative grid grid-cols-2 sm:grid-cols-6 gap-6 sm:gap-2">
              {STEPS.map((s, i) => {
                const done = i <= currentIdx;
                return (
                  <li key={s.key} className="flex sm:flex-col items-center sm:items-center gap-3 sm:text-center">
                    <div className={`grid place-items-center h-14 w-14 rounded-full z-10 transition shrink-0 ${done ? "bg-brand text-white" : "bg-muted text-muted-foreground"}`}>
                      <s.icon size={22} />
                    </div>
                    <span className={`text-sm font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}