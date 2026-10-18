"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { formatINR } from "@/lib/config";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";
import { BagIcon, HeartIcon } from "./Icons";

export default function AddToBag({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [nudge, setNudge] = useState(0);
  const [inView, setInView] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const saved = has(product.id);

  // Show the sticky bar on phones once the main button scrolls away.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function addToBag() {
    if (!size) {
      setNudge((n) => n + 1);
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    add({ productId: product.id, size, qty: 1 });
  }

  return (
    <div ref={ref} className="space-y-5">
      <div>
        <div className="mb-2.5 flex items-baseline justify-between">
          <p className="text-sm font-semibold">Select size</p>
          <AnimatePresence>
            {nudge > 0 && !size && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-maroon">
                Pick a size first
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <motion.div key={nudge} animate={nudge ? { x: [0, -8, 8, -5, 5, 0] } : {}} transition={{ duration: 0.4 }} className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              aria-pressed={size === s}
              className={`relative min-w-12 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                size === s ? "border-ink text-ivory" : "border-linen bg-white hover:border-ink/50"
              }`}
            >
              {size === s && <motion.span layoutId="size-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 450, damping: 32 }} />}
              <span className="relative">{s}</span>
            </button>
          ))}
        </motion.div>
      </div>
      <div className="flex gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={addToBag}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-4 font-semibold text-ivory transition hover:bg-ink/90"
        >
          <BagIcon /> Add to bag
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={() => toggle(product.id)}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          className={`flex w-14 items-center justify-center rounded-full border transition ${saved ? "border-maroon text-maroon" : "border-linen bg-white"}`}
        >
          <HeartIcon filled={saved} />
        </motion.button>
      </div>

      <AnimatePresence>
        {!inView && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed inset-x-0 bottom-[60px] z-30 sm:bottom-0 border-t border-linen bg-ivory/95 px-4 py-3 backdrop-blur md:hidden"
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-muted">{product.name}</p>
                <p className="font-semibold">
                  {formatINR(product.price)}
                  {size && <span className="ml-2 text-xs font-normal text-muted">Size {size}</span>}
                </p>
              </div>
              <button type="button" onClick={addToBag} className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory">
                {size ? "Add to bag" : "Select size"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
