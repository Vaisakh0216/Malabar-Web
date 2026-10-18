"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

type Sort = "popular" | "price-asc" | "price-desc" | "discount";

const sorts: { key: Sort; label: string }[] = [
  { key: "popular", label: "Popular" },
  { key: "price-asc", label: "Price ↑" },
  { key: "price-desc", label: "Price ↓" },
  { key: "discount", label: "Best offers" },
];

const prices = [
  { max: 0, label: "Any price" },
  { max: 1000, label: "Under ₹1,000" },
  { max: 2500, label: "Under ₹2,500" },
  { max: 5000, label: "Under ₹5,000" },
];

function Chip({ active, onClick, children, id }: { active: boolean; onClick: () => void; children: React.ReactNode; id: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active ? "border-ink text-ivory" : "border-linen bg-white text-ink hover:border-ink/40"
      }`}
    >
      {active && <motion.span layoutId={id} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
      <span className="relative">{children}</span>
    </button>
  );
}

export default function ProductGrid({ products, customOnly: startCustom = false }: { products: Product[]; customOnly?: boolean }) {
  const [sort, setSort] = useState<Sort>("popular");
  const [maxPrice, setMaxPrice] = useState(0);
  const [customOnly, setCustomOnly] = useState(startCustom);

  const shown = useMemo(() => {
    let list = products.filter((p) => (!maxPrice || p.price <= maxPrice) && (!customOnly || p.customisable));
    const off = (p: Product) => 1 - p.price / p.mrp;
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "discount") list = [...list].sort((a, b) => off(b) - off(a));
    return list;
  }, [products, sort, maxPrice, customOnly]);

  return (
    <div>
      <div className="sticky top-[104px] lg:top-[61px] z-20 -mx-4 mb-5 border-b border-linen/70 bg-ivory/90 px-4 py-3 backdrop-blur">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
          <LayoutGroup id="sort">
            {sorts.map((s) => (
              <Chip key={s.key} id="sort-pill" active={sort === s.key} onClick={() => setSort(s.key)}>
                {s.label}
              </Chip>
            ))}
          </LayoutGroup>
          <span className="mx-1 h-5 w-px shrink-0 bg-linen" />
          <LayoutGroup id="price">
            {prices.map((p) => (
              <Chip key={p.max} id="price-pill" active={maxPrice === p.max} onClick={() => setMaxPrice(p.max)}>
                {p.label}
              </Chip>
            ))}
          </LayoutGroup>
          <span className="mx-1 h-5 w-px shrink-0 bg-linen" />
          <Chip id="custom-pill" active={customOnly} onClick={() => setCustomOnly(!customOnly)}>
            Customisable
          </Chip>
        </div>
      </div>
      <p className="mb-4 text-xs text-muted">{shown.length} styles</p>
      {shown.length === 0 ? (
        <p className="rounded-2xl bg-sand px-6 py-12 text-center text-sm text-muted">Nothing matches these filters yet. Try a wider price range.</p>
      ) : (
        <motion.div layout className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
