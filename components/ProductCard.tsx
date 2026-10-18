"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getBoutique } from "@/lib/catalog";
import { formatINR } from "@/lib/config";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";
import { HeartIcon } from "./Icons";
import Swatch from "./Swatch";

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const boutique = getBoutique(product.boutique);
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [quick, setQuick] = useState(false);
  const saved = has(product.id);
  const off = Math.round((1 - product.price / product.mrp) * 100);

  return (
    <motion.div
      layout
      initial={priority ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
      onMouseEnter={() => setQuick(true)}
      onMouseLeave={() => setQuick(false)}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl">
          <Swatch
            palette={product.palette}
            image={product.image}
            alt={product.name}
            monogram={boutique?.name[0]}
            className="aspect-[3/4] transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1">
            {off > 0 && (
              <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold text-ivory">{off}% off</span>
            )}
            {product.customisable && (
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-ink backdrop-blur">
                Customisable
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 space-y-0.5 px-0.5">
          <p className="text-[11px] font-semibold tracking-wider text-muted uppercase">{boutique?.name}</p>
          <p className="truncate text-sm text-ink">{product.name}</p>
          <p className="text-sm">
            <span className="font-semibold">{formatINR(product.price)}</span>
            {off > 0 && <span className="ml-2 text-xs text-muted line-through">{formatINR(product.mrp)}</span>}
          </p>
        </div>
      </Link>

      <motion.button
        type="button"
        aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
        aria-pressed={saved}
        onClick={() => toggle(product.id)}
        whileTap={{ scale: 0.8 }}
        className={`absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 backdrop-blur transition ${
          saved ? "text-maroon" : "text-ink/70 hover:text-ink"
        }`}
      >
        <motion.span key={String(saved)} initial={{ scale: saved ? 0.4 : 1 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
          <HeartIcon filled={saved} className="h-[18px] w-[18px]" />
        </motion.span>
      </motion.button>

      {/* Quick add on desktop: pick a size straight from the grid. */}
      <QuickAdd product={product} visible={quick} onAdd={(size) => add({ productId: product.id, size, qty: 1 })} />
    </motion.div>
  );
}

function QuickAdd({ product, visible, onAdd }: { product: Product; visible: boolean; onAdd: (size: string) => void }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-2.5 hidden rounded-xl bg-white/90 p-2 shadow-lg backdrop-blur md:block"
          style={{ bottom: "calc(4.75rem + 0.625rem)" }}
        >
          <p className="mb-1.5 text-center text-[10px] font-semibold tracking-wider text-muted uppercase">Quick add</p>
          <div className="flex flex-wrap justify-center gap-1">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onAdd(s)}
                className="min-w-9 rounded-full border border-linen px-2 py-1 text-xs font-medium transition hover:border-ink hover:bg-ink hover:text-ivory"
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
