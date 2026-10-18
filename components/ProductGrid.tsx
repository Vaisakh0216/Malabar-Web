"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

type Sort = "popular" | "price-asc" | "price-desc";

export default function ProductGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<Sort>("popular");
  const [maxPrice, setMaxPrice] = useState<number>(0);

  const shown = useMemo(() => {
    const filtered = maxPrice ? products.filter((p) => p.price <= maxPrice) : products;
    if (sort === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [products, sort, maxPrice]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3 text-sm">
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-md border bg-white px-3 py-2">
          <option value="popular">Popular</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
        <select value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="rounded-md border bg-white px-3 py-2">
          <option value={0}>Any price</option>
          <option value={1000}>Under ₹1,000</option>
          <option value={2500}>Under ₹2,500</option>
          <option value={5000}>Under ₹5,000</option>
        </select>
        <span className="self-center text-neutral-500">{shown.length} items</span>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {shown.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
