"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Product } from "@/lib/types";
import Swatch from "./Swatch";

// Until boutiques send photos, each view is a variation of the product's colours.
export default function ProductGallery({ product, monogram }: { product: Product; monogram?: string }) {
  const [base, accent] = product.palette;
  const views: { label: string; palette: [string, string]; monogram?: string }[] = product.image
    ? [{ label: "Photo", palette: product.palette }]
    : [
        { label: "Front", palette: [base, accent], monogram },
        { label: "Detail", palette: [accent, base] },
        { label: "Border", palette: [base, accent] },
      ];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {views.length > 1 && (
        <div className="flex gap-2 md:flex-col">
          {views.map((v, i) => (
            <button
              key={v.label}
              type="button"
              aria-label={`Show ${v.label.toLowerCase()} view`}
              onClick={() => setActive(i)}
              className={`w-16 overflow-hidden rounded-xl ring-offset-2 ring-offset-ivory transition md:w-20 ${
                active === i ? "ring-2 ring-ink" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Swatch palette={v.palette} className="aspect-[3/4]" />
            </button>
          ))}
        </div>
      )}
      <div className="relative flex-1 overflow-hidden rounded-3xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Swatch
              palette={views[active].palette}
              image={product.image}
              alt={product.name}
              monogram={views[active].monogram}
              label={product.image ? undefined : "Photo coming soon"}
              className="aspect-[3/4]"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
