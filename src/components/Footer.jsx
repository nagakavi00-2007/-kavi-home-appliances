import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Send, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CATEGORIES } from "@/lib/products";

export default function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const subscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "Subscribed!", description: "You'll receive our latest offers." });
    setEmail("");
  };

  return (
    <footer className="bg-primary text-primary-foreground/80 mt-16">
      {/* newsletter */}
      <div className="border-b border-white/10">
        <div className="container-px mx-auto max-w-7xl py-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-white text-xl font-bold">Get exclusive offers & deals</h3>
            <p className="text-sm text-primary-foreground/60 mt-1">Subscribe to our newsletter and never miss a sale.</p>
          </div>
          <form onSubmit={subscribe} className="flex gap-2 max-w-md md:ml-auto w-full">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5">
              <Send size={16} /> Subscribe
            </Button>
          </form>
        </div>
      </div>

      <div className="container-px mx-auto max-w-7xl py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="grid place-items-center h-10 w-10 rounded-xl bg-white text-primary font-bold text-lg">V</div>
            <div>
              <div className="font-heading font-bold text-white text-lg">Kavi</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Home Appliances</div>
            </div>
          </div>
          <p className="text-sm text-primary-foreground/60 max-w-sm">
            Your trusted destination for premium home appliances. Quality products, genuine warranty, and reliable service since 1985.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center gap-2"><MapPin size={15} className="text-accent" /> 42 MG Road, Bengaluru, Karnataka 560001</p>
            <p className="flex items-center gap-2"><Phone size={15} className="text-accent" /> 1800-3000-8282</p>
            <p className="flex items-center gap-2"><Mail size={15} className="text-accent" /> care@kavi.in</p>
          </div>
          <div className="flex gap-3 mt-5">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" aria-label="social" className="grid place-items-center h-9 w-9 rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground transition">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/products" className="hover:text-white">Products</Link></li>
            <li><Link to="/offers" className="hover:text-white">Offers</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/track" className="hover:text-white">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/warranty" className="hover:text-white">Warranty Registration</Link></li>
            <li><Link to="/profile" className="hover:text-white">My Account</Link></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-white">Return Policy</a></li>
            <li><a href="#" className="hover:text-white">Shipping Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Categories</h4>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c}><Link to={`/products?category=${encodeURIComponent(c)}`} className="hover:text-white">{c}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-px mx-auto max-w-7xl py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Kavi Home Appliances. All rights reserved.</p>
          <p>Secure payments · UPI · Cards · Net Banking · Cash on Delivery</p>
        </div>
      </div>
    </footer>
  );
}