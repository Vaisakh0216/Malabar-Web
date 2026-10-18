"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import Swatch from "@/components/Swatch";
import { getProduct } from "@/lib/catalog";
import { formatINR, FREE_DELIVERY_ABOVE } from "@/lib/config";
import { priceCart } from "@/lib/pricing";

export default function CartPage() {
  const { items, setQty } = useCart();
  const { lines, subtotal, deliveryFee, total } = priceCart(items);

  if (!lines.length) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-3xl">Your bag is empty</p>
        <p className="mt-2 text-sm text-muted">Fill it with something from Calicut&apos;s boutiques.</p>
        <Link href="/" className="mt-4 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-ivory">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 pt-4 md:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <h1 className="font-display text-4xl tracking-tight">Your bag</h1>
        {lines.map((l) => {
          const product = getProduct(l.productId)!;
          return (
            <div key={`${l.productId}-${l.size}`} className="flex gap-4 rounded-3xl bg-white p-3 ring-1 ring-linen">
              <Swatch palette={product.palette} image={product.image} alt={product.name} className="h-28 w-20 shrink-0 rounded-2xl" />
              <div className="flex-1 text-sm">
                <p className="font-semibold">{l.boutique}</p>
                <p className="text-muted">{l.name}</p>
                <p className="mt-1">Size: {l.size}</p>
                <div className="mt-2 flex items-center gap-3">
                  <select
                    value={l.qty}
                    onChange={(e) => setQty(l.productId, l.size, Number(e.target.value))}
                    className="rounded-full border border-linen bg-ivory px-3 py-1"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        Qty {n}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={() => setQty(l.productId, l.size, 0)} className="text-muted underline">
                    Remove
                  </button>
                </div>
              </div>
              <p className="text-sm font-semibold">{formatINR(l.price * l.qty)}</p>
            </div>
          );
        })}
      </div>
      <aside className="h-fit space-y-2.5 rounded-3xl bg-sand p-5 text-sm md:sticky md:top-24">
        <p className="font-display text-xl">Price details</p>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatINR(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>{deliveryFee ? formatINR(deliveryFee) : "Free"}</span>
        </div>
        {deliveryFee > 0 && <p className="text-xs text-muted">Free delivery above {formatINR(FREE_DELIVERY_ABOVE)}</p>}
        <div className="flex justify-between border-t border-linen pt-3 text-base font-bold">
          <span>Total</span>
          <span>{formatINR(total)}</span>
        </div>
        <Link href="/checkout" className="mt-2 block rounded-full bg-ink py-3.5 text-center font-semibold text-ivory transition hover:bg-ink/90">
          Place order
        </Link>
      </aside>
    </div>
  );
}
