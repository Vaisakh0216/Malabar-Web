"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getProduct } from "@/lib/catalog";
import { deliveryPromise, formatINR, FREE_DELIVERY_ABOVE } from "@/lib/config";
import { priceCart } from "@/lib/pricing";
import { useCart } from "./CartProvider";
import { BagIcon, CloseIcon, TruckIcon } from "./Icons";
import Swatch from "./Swatch";

export default function CartDrawer() {
  const { items, setQty, open, setOpen } = useCart();
  const { lines, subtotal, deliveryFee, total } = priceCart(items);
  const toFree = Math.max(0, FREE_DELIVERY_ABOVE - subtotal);
  const progress = Math.min(1, subtotal / FREE_DELIVERY_ABOVE);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Your bag"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-ivory shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between border-b border-linen px-5 py-4">
              <p className="font-display text-xl">Your bag</p>
              <button type="button" aria-label="Close bag" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-sand">
                <CloseIcon />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <BagIcon className="h-10 w-10 text-muted" />
                <p className="font-display text-xl">Your bag is empty</p>
                <button type="button" onClick={() => setOpen(false)} className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory">
                  Continue shopping
                </button>
              </div>
            ) : (
              <>
                <div className="border-b border-linen px-5 py-4">
                  <p className="text-sm">
                    {toFree > 0 ? (
                      <>
                        Add <strong>{formatINR(toFree)}</strong> more for free delivery
                      </>
                    ) : (
                      <strong className="text-leaf">You've unlocked free delivery</strong>
                    )}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-linen">
                    <motion.div
                      className="h-full rounded-full bg-gold"
                      initial={false}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => {
                      const p = getProduct(l.productId)!;
                      return (
                        <motion.div
                          key={`${l.productId}-${l.size}`}
                          layout
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 30, height: 0 }}
                          className="flex gap-4"
                        >
                          <Link href={`/product/${p.id}`} onClick={() => setOpen(false)}>
                            <Swatch palette={p.palette} image={p.image} className="h-28 w-20 shrink-0 rounded-lg" />
                          </Link>
                          <div className="flex flex-1 flex-col text-sm">
                            <p className="text-xs font-semibold tracking-wide text-muted uppercase">{l.boutique}</p>
                            <p className="font-medium">{l.name}</p>
                            <p className="text-muted">Size {l.size}</p>
                            <div className="mt-auto flex items-center justify-between">
                              <div className="flex items-center rounded-full border border-linen">
                                <button type="button" aria-label="Decrease" onClick={() => setQty(l.productId, l.size, l.qty - 1)} className="px-3 py-1">
                                  −
                                </button>
                                <span className="w-5 text-center">{l.qty}</span>
                                <button
                                  type="button"
                                  aria-label="Increase"
                                  onClick={() => setQty(l.productId, l.size, Math.min(10, l.qty + 1))}
                                  className="px-3 py-1"
                                >
                                  +
                                </button>
                              </div>
                              <p className="font-semibold">{formatINR(l.price * l.qty)}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                <div className="space-y-3 border-t border-linen bg-white px-5 py-4 text-sm">
                  <p className="flex items-center gap-2 text-leaf">
                    <TruckIcon className="h-4 w-4" /> {deliveryPromise()} in Kozhikode
                  </p>
                  <div className="flex justify-between text-muted">
                    <span>Delivery</span>
                    <span>{deliveryFee ? formatINR(deliveryFee) : "Free"}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>{formatINR(total)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setOpen(false)}
                    className="block rounded-full bg-ink py-3.5 text-center font-semibold text-ivory transition hover:bg-black"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
