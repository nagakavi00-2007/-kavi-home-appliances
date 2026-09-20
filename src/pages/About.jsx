import React from "react";
import { Link } from "react-router-dom";
import { Target, Eye, Award, Users, Truck, ShieldCheck, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { HERO_IMAGE } from "@/lib/products";

const VALUES = [
  { icon: Award, title: "Product Quality", desc: "Only genuine, brand-authorised appliances with full warranty." },
  { icon: HeartHandshake, title: "Customer Service", desc: "Dedicated support before, during and after your purchase." },
  { icon: Truck, title: "Reliable Delivery", desc: "Fast, safe doorstep delivery across the country." },
  { icon: ShieldCheck, title: "Trust & Transparency", desc: "Fair prices, honest specs and no hidden charges." },
];

export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-[hsl(222_47%_18%)] text-white">
        <div className="container-px mx-auto max-w-7xl py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">Powering Indian homes since 1985</h1>
            <p className="text-white/70 mt-4 leading-relaxed">
              Kavi Home Appliances began as a single neighbourhood store with a simple promise — bring reliable, modern appliances to every home at honest prices. Four decades later, we're one of the most trusted names in home appliances, serving over two lakh happy customers across India.
            </p>
            <div className="flex gap-6 mt-6">
              <div><div className="text-3xl font-bold text-accent">40+</div><div className="text-white/60 text-sm">Years of trust</div></div>
              <div><div className="text-3xl font-bold text-accent">2L+</div><div className="text-white/60 text-sm">Customers</div></div>
              <div><div className="text-3xl font-bold text-accent">40+</div><div className="text-white/60 text-sm">Brands</div></div>
            </div>
          </div>
          <div className="aspect-[4/3] rounded-3xl overflow-hidden ring-1 ring-white/20 shadow-2xl">
            <Image src={HERO_IMAGE} alt="Our showroom" fittingType="fill" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl py-14 grid md:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-border p-8">
          <Target className="text-brand" size={28} />
          <h2 className="text-xl font-bold mt-3">Our Mission</h2>
          <p className="text-muted-foreground mt-2 leading-relaxed">To make modern, energy-efficient home appliances accessible to every Indian household — backed by genuine warranty and dependable service.</p>
        </div>
        <div className="rounded-2xl border border-border p-8">
          <Eye className="text-brand" size={28} />
          <h2 className="text-xl font-bold mt-3">Our Vision</h2>
          <p className="text-muted-foreground mt-2 leading-relaxed">To be India's most loved appliance retailer — where quality, affordability and customer care come together seamlessly, online and offline.</p>
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl pb-14">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Us</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-border p-6 text-center hover:shadow-lg transition">
              <div className="grid place-items-center h-14 w-14 rounded-2xl bg-brand/10 text-brand mx-auto mb-3"><v.icon size={26} /></div>
              <h3 className="font-semibold">{v.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 border-y border-border">
        <div className="container-px mx-auto max-w-7xl py-12 text-center">
          <h2 className="text-2xl font-bold">Have questions? We're here to help.</h2>
          <p className="text-muted-foreground mt-2">Reach out to our friendly team any day of the week.</p>
          <Link to="/contact"><Button className="mt-5">Contact Us</Button></Link>
        </div>
      </section>
    </div>
  );
}