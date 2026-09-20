import React, { useEffect, useState } from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { appClient } from "@/api/appClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { CATEGORIES } from "@/lib/products";

export default function Warranty() {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ product_name: "", user_name: "", email: "", phone: "", purchase_date: "", serial_number: "", address: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => { appClient.entities.Product.list("-created_date", 50).then(setProducts); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.product_name || !form.user_name || !form.email) { toast({ title: "Please fill required fields", variant: "destructive" }); return; }
    setSubmitting(true);
    try {
      await appClient.entities.WarrantyRegistration.create(form);
      setDone(true);
      setForm({ product_name: "", user_name: "", email: "", phone: "", purchase_date: "", serial_number: "", address: "" });
      toast({ title: "Warranty registered successfully!" });
    } catch {
      toast({ title: "Could not register. Try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-px mx-auto max-w-3xl py-10">
      <div className="text-center mb-8">
        <div className="grid place-items-center h-16 w-16 rounded-2xl bg-brand/10 text-brand mx-auto mb-3"><ShieldCheck size={30} /></div>
        <h1 className="text-3xl font-bold">Warranty Registration</h1>
        <p className="text-muted-foreground mt-2">Register your product to activate warranty and enjoy hassle-free service.</p>
      </div>

      {done ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
          <CheckCircle2 size={40} className="text-green-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-green-700">Registration Successful!</h2>
          <p className="text-muted-foreground mt-2">Your warranty has been registered. You'll receive a confirmation email shortly.</p>
          <Button variant="outline" className="mt-5" onClick={() => setDone(false)}>Register Another Product</Button>
        </div>
      ) : (
        <form onSubmit={submit} className="rounded-2xl border border-border p-6 sm:p-8 space-y-4">
          <div>
            <Label className="mb-1.5 block">Product *</Label>
            <Select value={form.product_name} onValueChange={(v) => setForm({ ...form, product_name: v })}>
              <SelectTrigger><SelectValue placeholder="Select your product" /></SelectTrigger>
              <SelectContent>
                {products.map((p) => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c} (generic)</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label className="mb-1.5 block">Full Name *</Label><Input value={form.user_name} onChange={(e) => setForm({ ...form, user_name: e.target.value })} /></div>
            <div><Label className="mb-1.5 block">Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label className="mb-1.5 block">Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={10} /></div>
            <div><Label className="mb-1.5 block">Purchase Date</Label><Input type="date" value={form.purchase_date} onChange={(e) => setForm({ ...form, purchase_date: e.target.value })} /></div>
            <div><Label className="mb-1.5 block">Serial Number</Label><Input value={form.serial_number} onChange={(e) => setForm({ ...form, serial_number: e.target.value })} placeholder="Found on product / invoice" /></div>
          </div>
          <div><Label className="mb-1.5 block">Address</Label><Textarea rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <Button type="submit" disabled={submitting} className="w-full sm:w-auto">{submitting ? "Registering…" : "Register Warranty"}</Button>
        </form>
      )}
    </div>
  );
}