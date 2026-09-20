import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const CartWishlistContext = createContext(null);

const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

export function CartWishlistProvider({ children }) {
  const [cart, setCart] = useState(() => load("vc_cart", []));
  const [wishlist, setWishlist] = useState(() => load("vc_wishlist", []));
  const [recentlyViewed, setRecentlyViewed] = useState(() => load("vc_recent", []));
  const [addresses, setAddresses] = useState(() => load("vc_addresses", []));

  useEffect(() => localStorage.setItem("vc_cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("vc_wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("vc_recent", JSON.stringify(recentlyViewed)), [recentlyViewed]);
  useEffect(() => localStorage.setItem("vc_addresses", JSON.stringify(addresses)), [addresses]);

  const addToCart = useCallback((product, color, qty = 1) => {
    setCart((prev) => {
      const key = product.id + "|" + (color || "");
      const idx = prev.findIndex((i) => i.key === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [
        ...prev,
        {
          key,
          product_id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.discount_price,
          original_price: product.original_price,
          color: color || product.colors?.[0] || "",
          qty,
          stock: product.stock,
        },
      ];
    });
  }, []);

  const updateQty = (key, qty) =>
    setCart((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i)));

  const removeFromCart = (key) => setCart((prev) => prev.filter((i) => i.key !== key));
  const clearCart = () => setCart([]);

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev.filter((p) => p.id !== product.id);
      return [
        {
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.discount_price,
          original_price: product.original_price,
          rating: product.rating,
          stock: product.stock,
          colors: product.colors,
        },
        ...prev,
      ];
    });
  }, []);

  const inWishlist = (id) => wishlist.some((p) => p.id === id);

  const moveToCart = (product) => {
    addToCart(product, product.colors?.[0] || "", 1);
    setWishlist((prev) => prev.filter((p) => p.id !== product.id));
  };

  const addRecentlyViewed = (id) =>
    setRecentlyViewed((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 10));

  const saveAddress = (addr) => setAddresses((prev) => [{ ...addr, id: Date.now().toString() }, ...prev]);
  const removeAddress = (id) => setAddresses((prev) => prev.filter((a) => a.id !== id));

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const originalSubtotal = cart.reduce((s, i) => s + i.original_price * i.qty, 0);
  const discount = originalSubtotal - subtotal;

  return (
    <CartWishlistContext.Provider
      value={{
        cart, wishlist, recentlyViewed, addresses,
        addToCart, updateQty, removeFromCart, clearCart,
        toggleWishlist, inWishlist, moveToCart,
        addRecentlyViewed, saveAddress, removeAddress,
        cartCount, subtotal, originalSubtotal, discount,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
}

export const useStore = () => useContext(CartWishlistContext);