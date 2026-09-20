export const formatINR = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export const discountPct = (original, price) =>
  original && original > price ? Math.round(((original - price) / original) * 100) : 0;

export const slugify = (s) =>
  String(s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");