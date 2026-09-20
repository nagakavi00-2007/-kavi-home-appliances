import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Package, Heart, MapPin, ShieldCheck, LogOut, ShoppingBag, Plus, Trash2 } from "lucide-react";
import { appClient } from "@/api/appClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/lib/AuthContext";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { formatINR } from "@/lib/format";

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlist, addresses, saveAddress, removeAddress, cartCount } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [addr, setAddr] = useState({ name: "", phone: "", line: "", city: "", state: "", pincode: "" });

  useEffect(() => {
    if (user?.email) appClient.entities.Order.filter({ email: user.email }).then(setOrders).catch(() => {});
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="container-px mx-auto max-w-3xl py-24 text-center">
        <div className="grid place-items-center h-20 w-20 rounded-full bg-muted mx-auto mb-5"><User size={32} className="text-muted-foreground" /></div>
        <h1 className="text-2xl font-bold">Please log in</h1>
        <p className="text-muted-foreground mt-2">Sign in to view your account, orders and wishlist.</p>
        <Link to="/login"><Button className="mt-6">Login / Register</Button></Link>
      </div>
    );
  }

  const addAddress = (e) => {
    e.preventDefault();
    if (!addr.name || !addr.line || !addr.pincode) { toast({ title: "Fill required address fields", variant: "destructive" }); return; }
    saveAddress(addr);
    setAddr({ name: "", phone: "", line: "", city: "", state: "", pincode: "" });
    toast({ title: "Address saved" });
  };

  const handleLogout = () => logout();

  return (
    <div className="container-px mx-auto max-w-7xl py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="grid place-items-center h-16 w-16 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold">{user?.full_name?.[0]?.toUpperCase() || "U"}</div>
          <div>
            <h1 className="text-2xl font-bold">{user?.full_name || "My Account"}</h1>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-1.5"><LogOut size={16} /> Logout</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { icon: ShoppingBag, label: "Cart Items", value: cartCount, to: "/cart" },
          { icon: Heart, label: "Wishlist", value: wishlist.length, to: "/wishlist" },
          { icon: Package, label: "Orders", value: orders.length, to: "#orders" },
          { icon: MapPin, label: "Addresses", value: addresses.length, to: "#addresses" },
        ].map((s) => (
          <Link key={s.label} to={s.to} className="rounded-2xl border border-border p-4 hover:shadow-md transition">
            <s.icon size={20} className="text-brand" />
            <div className="text-2xl font-bold mt-2">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </Link>
        ))}
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="orders" className="gap-1.5"><Package size={15} /> My Orders</TabsTrigger>
          <TabsTrigger value="wishlist" className="gap-1.5"><Heart size={15} /> Wishlist</TabsTrigger>
          <TabsTrigger value="addresses" className="gap-1.5"><MapPin size={15} /> Addresses</TabsTrigger>
          <TabsTrigger value="warranty" className="gap-1.5"><ShieldCheck size={15} /> Warranty</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" id="orders" className="mt-4 space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-border">
              <p className="text-muted-foreground">No orders yet.</p>
              <Link to="/products"><Button className="mt-4">Start shopping</Button></Link>
            </div>
          ) : orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-border p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <div><p className="text-sm text-muted-foreground">Order ID</p><p className="font-semibold">{o.order_id}</p></div>
                <div className="text-right"><p className="text-sm text-muted-foreground">Total</p><p className="font-bold">{formatINR(o.grand_total)}</p></div>
                <div className="text-right"><p className="text-sm text-muted-foreground">Status</p><span className="text-sm font-medium capitalize bg-muted px-2 py-0.5 rounded">{o.status?.replace(/_/g, " ")}</span></div>
              </div>
              <div className="mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
                {o.items?.map((i, idx) => <span key={idx}>{i.name} × {i.qty}{idx < o.items.length - 1 ? ", " : ""}</span>)}
              </div>
              <Link to="/track"><Button variant="outline" size="sm" className="mt-3">Track order</Button></Link>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="wishlist" className="mt-4">
          {wishlist.length === 0 ? <p className="text-muted-foreground py-10 text-center">Your wishlist is empty.</p> : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlist.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="rounded-2xl border border-border p-4 hover:shadow-md transition">
                  <p className="text-xs text-muted-foreground uppercase">{p.brand}</p>
                  <p className="font-semibold line-clamp-2">{p.name}</p>
                  <p className="font-bold mt-1">{formatINR(p.price)}</p>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="addresses" id="addresses" className="mt-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={addAddress} className="rounded-2xl border border-border p-6 space-y-3">
              <h3 className="font-semibold flex items-center gap-2"><Plus size={16} /> Add New Address</h3>
              <div><Label className="mb-1.5 block">Full Name *</Label><Input value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} /></div>
              <div><Label className="mb-1.5 block">Phone</Label><Input value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} maxLength={10} /></div>
              <div><Label className="mb-1.5 block">Address Line *</Label><Input value={addr.line} onChange={(e) => setAddr({ ...addr, line: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="mb-1.5 block">City</Label><Input value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} /></div>
                <div><Label className="mb-1.5 block">State</Label><Input value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} /></div>
              </div>
              <div><Label className="mb-1.5 block">Pincode *</Label><Input value={addr.pincode} onChange={(e) => setAddr({ ...addr, pincode: e.target.value })} maxLength={6} /></div>
              <Button type="submit">Save Address</Button>
            </form>
            <div className="space-y-3">
              {addresses.length === 0 ? <p className="text-muted-foreground">No saved addresses.</p> : addresses.map((a) => (
                <div key={a.id} className="rounded-2xl border border-border p-5">
                  <div className="flex justify-between">
                    <p className="font-semibold">{a.name}</p>
                    <button onClick={() => removeAddress(a.id)} className="text-muted-foreground hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{a.line}, {a.city}, {a.state} - {a.pincode}</p>
                  {a.phone && <p className="text-sm text-muted-foreground">{a.phone}</p>}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="warranty" className="mt-4">
          <div className="rounded-2xl border border-border p-8 text-center">
            <ShieldCheck size={32} className="text-brand mx-auto mb-3" />
            <h3 className="font-semibold">Register your product warranty</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-md mx-auto">Activate your warranty to enjoy free service and support during the warranty period.</p>
            <Link to="/warranty"><Button className="mt-4">Register Warranty</Button></Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}