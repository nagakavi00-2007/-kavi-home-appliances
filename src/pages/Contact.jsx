import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast({ title: "Please fill required fields", variant: "destructive" }); return; }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
    }, 800);
  };

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold">Get in Touch</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Questions, feedback or need help choosing? Our team is happy to assist you.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={submit} className="rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label className="mb-1.5 block">Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></div>
              <div><Label className="mb-1.5 block">Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></div>
              <div><Label className="mb-1.5 block">Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile" /></div>
              <div><Label className="mb-1.5 block">Subject</Label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" /></div>
            </div>
            <div><Label className="mb-1.5 block">Message *</Label><Textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Write your message…" /></div>
            <Button type="submit" disabled={sending} className="gap-1.5">{sending ? "Sending…" : <><Send size={16} /> Send Message</>}</Button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border p-6 space-y-4">
            <h2 className="font-semibold">Store Information</h2>
            <div className="flex gap-3"><MapPin size={20} className="text-brand shrink-0" /><p className="text-sm text-muted-foreground">No. 25, Anna Nagar Main Road, Anna Nagar, Chennai, Tamil Nadu – 600040, India</p></div>
            <div className="flex gap-3"><Phone size={20} className="text-brand shrink-0" /><p className="text-sm text-muted-foreground">1800-3000-8282 (Toll Free)</p></div>
            <div className="flex gap-3"><Mail size={20} className="text-brand shrink-0" /><p className="text-sm text-muted-foreground">care@kavi.in</p></div>
            <div className="flex gap-3"><Clock size={20} className="text-brand shrink-0" /><div className="text-sm text-muted-foreground"><p>Mon – Sat: 9:30 AM – 8:30 PM</p><p>Sunday: 10:00 AM – 6:00 PM</p></div></div>
          </div>
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="aspect-[4/3] bg-muted grid place-items-center text-muted-foreground text-sm">
              <div className="text-center"><MapPin size={28} className="mx-auto mb-2" /> Google Maps placeholder</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}