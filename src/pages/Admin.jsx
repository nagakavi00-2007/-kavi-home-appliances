import React, { useEffect, useState } from "react";
import { LayoutDashboard, Package, ClipboardList, Star, ShieldCheck, Boxes, Plus, Pencil, Trash2, X, TrendingUp, AlertTriangle, Users } from "lucide-react";
import { appClient } from "@/api/appClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { formatINR } from "@/lib/format";
import { CATEGORIES, BRANDS } from "@/lib/products";

const empty = {
  name: "", brand: "Samsung", category: "Refrigerators", model: "",
  original_price: 0, discount_price: 0, rating: 4, review_count: 0, stock: 10,
  colors: ["Silver"], description: "", specifications: "{}",
  warranty_period: "1 Year", warranty_type: "Manufacturer", warranty_coverage: "",
  is_featured: false, is_new: false,
};

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [colorsText, setColorsText] = useState("Silver");
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadAll = () => {
    setLoading(true);
    Promise.all([
      appClient.entities.Product.list("-created_date", 200),
      appClient.entities.Order.list("-created_date", 200),
      appClient.entities.Review.list("-created_date", 200),
      appClient.entities.WarrantyRegistration.list("-created_date", 200),
    ]).then(([p, o, r, w]) => {
      setProducts(p || []); setOrders(o || []); setReviews(r || []); setWarranties(w || []);
    }).finally(() => setLoading(false));
  };
  useEffect(() => { loadAll(); }, []);

  if (user && user.role !== "admin") {
    return (
      <div className="container-px mx-auto max-w-3xl py-24 text-center">
        <AlertTriangle size={36} className="text-amber-500 mx-auto mb-3" />
        <h1 className="text-2xl font-bold">Admin access only</h1>
        <p className="text-muted-foreground mt-2">You don't have permission to view this page.</p>
      </div>
    );
  }

  const revenue = orders.reduce((s, o) => s + (o.grand_total || 0), 0);
  const lowStock = products.filter((p) => (p.stock ?? 0) <= 5);
  const stats = [
    { icon: Package, label: "Total Products", value: products.length, tone: "bg-blue-50 text-brand" },
    { icon: ClipboardList, label: "Total Orders", value: orders.length, tone: "bg-amber-50 text-amber-600" },
    { icon: Users, label: "Customers", value: new Set(orders.map((o) => o.email)).size, tone: "bg-green-50 text-green-600" },
    { icon: TrendingUp, label: "Revenue", value: formatINR(revenue), tone: "bg-purple-50 text-purple-600" },
    { icon: AlertTriangle, label: "Low Stock", value: lowStock.length, tone: "bg-red-50 text-red-600" },
  ];

  const openAdd = () => { setEditing(null); setForm(empty); setColorsText("Silver"); setDialogOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...p, specifications: p.specifications || "{}" });
    setColorsText((p.colors || []).join(", "));
    setDialogOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.discount_price) { toast({ title: "Name, brand and price are required", variant: "destructive" }); return; }
    setSaving(true);
    const colors = colorsText.split(",").map((c) => c.trim()).filter(Boolean);
    const discount_percentage = form.original_price > form.discount_price ? Math.round(((form.original_price - form.discount_price) / form.original_price) * 100) : 0;
    const payload = { ...form, colors, discount_percentage, original_price: Number(form.original_price), discount_price: Number(form.discount_price), rating: Number(form.rating), review_count: Number(form.review_count), stock: Number(form.stock) };
    try {
      if (editing) { await appClient.entities.Product.update(editing.id, payload); toast({ title: "Product updated" }); }
      else { await appClient.entities.Product.create(payload); toast({ title: "Product added" }); }
      setDialogOpen(false); setEditing(null); setForm(empty); loadAll();
    } catch { toast({ title: "Save failed", variant: "destructive" }); } finally { setSaving(false); }
  };

  const remove = async (p) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try { await appClient.entities.Product.delete(p.id); toast({ title: "Product deleted" }); loadAll(); }
    catch { toast({ title: "Delete failed", variant: "destructive" }); }
  };

  const updateOrderStatus = async (o, status) => {
    try { await appClient.entities.Order.update(o.id, { status }); loadAll(); toast({ title: "Order status updated" }); }
    catch { toast({ title: "Update failed", variant: "destructive" }); }
  };

  return (
    <div className="container-px mx-auto max-w-7xl py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div><h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2"><LayoutDashboard /> Admin Dashboard</h1><p className="text-muted-foreground text-sm mt-1">Manage your store</p></div>
        <Button onClick={openAdd} className="gap-1.5"><Plus size={16} /> Add Product</Button>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border p-4">
            <div className={`grid place-items-center h-10 w-10 rounded-xl ${s.tone}`}><s.icon size={20} /></div>
            <div className="text-2xl font-bold mt-3">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="products">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="products" className="gap-1.5"><Package size={15} /> Products</TabsTrigger>
          <TabsTrigger value="orders" className="gap-1.5"><ClipboardList size={15} /> Orders</TabsTrigger>
          <TabsTrigger value="inventory" className="gap-1.5"><Boxes size={15} /> Inventory</TabsTrigger>
          <TabsTrigger value="reviews" className="gap-1.5"><Star size={15} /> Reviews</TabsTrigger>
          <TabsTrigger value="warranty" className="gap-1.5"><ShieldCheck size={15} /> Warranty</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-4">
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr><th className="text-left px-4 py-3 font-medium">Product</th><th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Category</th><th className="text-left px-4 py-3 font-medium">Price</th><th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Stock</th><th className="px-4 py-3"></th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-4 py-3"><p className="font-medium line-clamp-1">{p.name}</p><p className="text-xs text-muted-foreground">{p.brand}</p></td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{p.category}</td>
                    <td className="px-4 py-3 font-medium">{formatINR(p.discount_price)}</td>
                    <td className="px-4 py-3 hidden sm:table-cell"><Badge variant={p.stock <= 5 ? "destructive" : "secondary"}>{p.stock}</Badge></td>
                    <td className="px-4 py-3 text-right"><div className="flex justify-end gap-1"><button onClick={() => openEdit(p)} className="p-1.5 hover:bg-muted rounded"><Pencil size={15} /></button><button onClick={() => remove(p)} className="p-1.5 hover:bg-muted rounded text-red-500"><Trash2 size={15} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-4 space-y-3">
          {orders.length === 0 ? <p className="text-muted-foreground py-10 text-center">No orders yet.</p> : orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-border p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <div><p className="font-semibold">{o.order_id}</p><p className="text-sm text-muted-foreground">{o.customer_name} · {o.email}</p></div>
                <div className="text-right"><p className="font-bold">{formatINR(o.grand_total)}</p><p className="text-xs text-muted-foreground">{o.payment_method}</p></div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Select value={o.status} onValueChange={(v) => updateOrderStatus(o, v)}>
                  <SelectTrigger className="w-44 h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["placed", "confirmed", "packed", "shipped", "out_for_delivery", "delivered"].map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="inventory" className="mt-4">
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground"><tr><th className="text-left px-4 py-3 font-medium">Product</th><th className="text-left px-4 py-3 font-medium">Stock</th><th className="text-left px-4 py-3 font-medium">Status</th></tr></thead>
              <tbody>
                {products.map((p) => {
                  const st = (p.stock ?? 0) <= 0 ? "Out of stock" : p.stock <= 5 ? "Low stock" : "In stock";
                  const tone = (p.stock ?? 0) <= 0 ? "text-red-600" : p.stock <= 5 ? "text-amber-600" : "text-green-600";
                  return (
                    <tr key={p.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3">{p.stock}</td>
                      <td className={`px-4 py-3 font-medium ${tone}`}>{st}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4 space-y-3">
          {reviews.length === 0 ? <p className="text-muted-foreground py-10 text-center">No reviews yet.</p> : reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border p-4">
              <div className="flex justify-between"><p className="font-medium">{r.title || "Review"}</p><span className="text-sm">{"★".repeat(r.rating)}</span></div>
              <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
              <p className="text-xs text-muted-foreground mt-2">{r.user_name} · {r.product_name}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="warranty" className="mt-4 space-y-3">
          {warranties.length === 0 ? <p className="text-muted-foreground py-10 text-center">No warranty registrations yet.</p> : warranties.map((w) => (
            <div key={w.id} className="rounded-2xl border border-border p-4">
              <p className="font-semibold">{w.product_name}</p>
              <p className="text-sm text-muted-foreground mt-1">{w.user_name} · {w.email} · {w.phone}</p>
              {w.serial_number && <p className="text-xs text-muted-foreground mt-1">Serial: {w.serial_number} · Purchased: {w.purchase_date}</p>}
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* product dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditing(null); setForm(empty); } }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div><Label className="mb-1.5 block">Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label className="mb-1.5 block">Brand *</Label>
                <Select value={form.brand} onValueChange={(v) => setForm({ ...form, brand: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{BRANDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="mb-1.5 block">Category *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label className="mb-1.5 block">Model</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></div>
              <div><Label className="mb-1.5 block">Colours (comma separated)</Label><Input value={colorsText} onChange={(e) => setColorsText(e.target.value)} /></div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div><Label className="mb-1.5 block">Original Price *</Label><Input type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} /></div>
              <div><Label className="mb-1.5 block">Discount Price *</Label><Input type="number" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} /></div>
              <div><Label className="mb-1.5 block">Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label className="mb-1.5 block">Rating (0-5)</Label><Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></div>
              <div><Label className="mb-1.5 block">Review Count</Label><Input type="number" value={form.review_count} onChange={(e) => setForm({ ...form, review_count: e.target.value })} /></div>
            </div>
            <div><Label className="mb-1.5 block">Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label className="mb-1.5 block">Specifications (JSON)</Label><Textarea rows={3} value={form.specifications} onChange={(e) => setForm({ ...form, specifications: e.target.value })} placeholder='{"Capacity":"265 L","Energy Rating":"5 Star"}' /></div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div><Label className="mb-1.5 block">Warranty Period</Label><Input value={form.warranty_period} onChange={(e) => setForm({ ...form, warranty_period: e.target.value })} /></div>
              <div><Label className="mb-1.5 block">Warranty Type</Label><Input value={form.warranty_type} onChange={(e) => setForm({ ...form, warranty_type: e.target.value })} /></div>
              <div><Label className="mb-1.5 block">Warranty Coverage</Label><Input value={form.warranty_coverage} onChange={(e) => setForm({ ...form, warranty_coverage: e.target.value })} /></div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} /> New Arrival</label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Product"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}