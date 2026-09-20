import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search, Heart, ShoppingCart, Menu, User, X, ChevronDown, Zap, Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/AuthContext";
import { CATEGORIES } from "@/lib/products";

const NAV = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Offers", path: "/offers" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0">
      <div className="grid place-items-center h-10 w-10 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-md">
        K
      </div>
      <div className="leading-tight">
        <div className="font-heading font-bold text-base sm:text-lg tracking-tight">Kavi</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Home Appliances</div>
      </div>
    </Link>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, wishlist } = useStore();
  const { isAuthenticated, user } = useAuth();
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(q)}`);
    setMobileOpen(false);
  };

  const isActive = (p) => (p === "/" ? location.pathname === "/" : location.pathname.startsWith(p));

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* top bar */}
      <div className="hidden md:block bg-primary text-primary-foreground/90 text-xs">
        <div className="container-px mx-auto max-w-7xl flex items-center justify-between h-9">
          <span className="flex items-center gap-2"><Phone size={12} /> 1800-3000-8282 · Free delivery on orders above ₹4,999</span>
          <div className="flex items-center gap-4">
            <Link to="/track" className="hover:text-white">Track Order</Link>
            <Link to="/warranty" className="hover:text-white">Warranty</Link>
          </div>
        </div>
      </div>

      <div className="bg-background/95 backdrop-blur border-b border-border shadow-sm">
        <div className="container-px mx-auto max-w-7xl flex items-center gap-4 h-16 sm:h-20">
          {/* mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="p-5 border-b">
                <SheetTitle className="text-left"><Logo /></SheetTitle>
              </SheetHeader>
              <div className="p-4 flex flex-col gap-1">
                {NAV.map((n) => (
                  <Link key={n.path} to={n.path} onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-muted font-medium">{n.label}</Link>
                ))}
                <div className="px-3 pt-2 pb-1 text-xs uppercase tracking-wide text-muted-foreground">Categories</div>
                <div className="max-h-64 overflow-y-auto no-scrollbar flex flex-col">
                  {CATEGORIES.map((c) => (
                    <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg hover:bg-muted text-sm">{c}</Link>
                  ))}
                </div>
                <div className="border-t mt-2 pt-3 flex flex-col gap-1">
                  <Link to="/track" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg hover:bg-muted text-sm">Track Order</Link>
                  <Link to="/warranty" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg hover:bg-muted text-sm">Warranty Registration</Link>
                  {isAuthenticated ? (
                    <Link to="/profile" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg hover:bg-muted text-sm font-medium">My Account</Link>
                  ) : (
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg hover:bg-muted text-sm font-medium">Login / Register</Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Logo />

          {/* categories dropdown (desktop) */}
          <div className="hidden lg:block relative"
            onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium hover:text-brand transition">
              Categories <ChevronDown size={15} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 pt-2 w-64 z-50">
                <div className="bg-white border border-border rounded-xl shadow-xl p-2 grid grid-cols-1">
                  {CATEGORIES.map((c) => (
                    <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} className="px-3 py-2 rounded-lg hover:bg-muted text-sm flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand" /> {c}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* search */}
          <form onSubmit={submitSearch} className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search appliances, brands, models…" className="pl-10 rounded-full bg-muted/60 border-0 focus-visible:ring-brand" />
            </div>
          </form>

          {/* right actions */}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            {isAuthenticated ? (
              <Link to="/profile" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-muted text-sm font-medium">
                <User size={18} /> <span className="hidden lg:inline">{user?.full_name?.split(" ")[0] || "Account"}</span>
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-muted text-sm font-medium">
                <User size={18} /> <span className="hidden lg:inline">Login</span>
              </Link>
            )}
            <Link to="/wishlist" className="relative grid place-items-center h-10 w-10 rounded-lg hover:bg-muted transition">
              <Heart size={20} />
              {wishlist.length > 0 && <Badge className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 grid place-items-center bg-accent text-accent-foreground">{wishlist.length}</Badge>}
            </Link>
            <Link to="/cart" className="relative grid place-items-center h-10 w-10 rounded-lg hover:bg-muted transition">
              <ShoppingCart size={20} />
              {cartCount > 0 && <Badge className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 grid place-items-center bg-brand text-white">{cartCount}</Badge>}
            </Link>
          </div>
        </div>

        {/* mobile search */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={submitSearch}>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search appliances…" className="pl-10 rounded-full bg-muted/60 border-0" />
            </div>
          </form>
        </div>

        {/* desktop nav row */}
        <nav className="hidden lg:flex border-t border-border">
          <div className="container-px mx-auto max-w-7xl flex items-center gap-1 h-11">
            {NAV.map((n) => (
              <Link key={n.path} to={n.path} className={`px-4 h-full flex items-center text-sm font-medium transition ${isActive(n.path) ? "text-brand" : "hover:text-brand"}`}>
                {n.label}
              </Link>
            ))}
            <Link to="/products?sort=newest" className="px-4 h-full flex items-center text-sm font-medium text-accent-foreground/80 hover:text-accent-foreground transition flex items-center gap-1.5 ml-auto">
              <Zap size={14} className="text-accent-foreground" /> New Arrivals
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}