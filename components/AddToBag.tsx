"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";

export default function AddToBag({ product }: { product: Product }) {
  const { add } = useCart();
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [added, setAdded] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-semibold">Select size</p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`min-w-12 rounded-full border px-4 py-2 text-sm ${
                size === s ? "border-brand bg-brand text-white" : "border-neutral-300 bg-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          disabled={!size}
          onClick={() => {
            add({ productId: product.id, size, qty: 1 });
            setAdded(true);
          }}
          className="flex-1 rounded-lg bg-brand py-3 font-semibold text-white disabled:opacity-40"
        >
          {size ? "Add to bag" : "Pick a size"}
        </button>
        {added && (
          <Link href="/cart" className="flex-1 rounded-lg border border-brand py-3 text-center font-semibold text-brand">
            Go to bag
          </Link>
        )}
      </div>
    </div>
  );
}
