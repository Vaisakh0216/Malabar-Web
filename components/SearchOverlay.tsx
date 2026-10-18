"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { boutiques, getBoutique, products } from "@/lib/catalog";
import { formatINR } from "@/lib/config";
import { CloseIcon, SearchIcon } from "./Icons";
import Swatch from "./Swatch";

const popular = ["Kasavu saree", "Set mundu", "Churidar", "Bridal", "Kids", "Linen shirt"];

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => input.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return products
      .filter((p) => {
        const text = `${p.name} ${p.fabric} ${p.category} ${getBoutique(p.boutique)?.name} ${p.description}`.toLowerCase();
        return words.every((w) => text.includes(w));
      })
      .slice(0, 8);
  }, [q]);

  const shops = q ? boutiques.filter((b) => b.name.toLowerCase().includes(q.toLowerCase())) : [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-ivory/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl px-4 pt-6 sm:pt-16"
          >
            <div className="flex items-center gap-3 border-b-2 border-ink pb-3">
              <SearchIcon className="h-6 w-6 shrink-0" />
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search sarees, kurtas, boutiques..."
                className="w-full bg-transparent font-display text-2xl outline-none placeholder:text-muted/60 sm:text-3xl"
              />
              <button type="button" aria-label="Close search" onClick={onClose} className="rounded-full p-2 hover:bg-sand">
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            {!q && (
              <div className="mt-8">
                <p className="text-xs font-semibold tracking-widest text-muted uppercase">Popular in Calicut</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {popular.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setQ(p)}
                      className="rounded-full border border-linen bg-white px-4 py-2 text-sm transition hover:border-ink"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {shops.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {shops.map((b) => (
                  <Link key={b.slug} href={`/boutique/${b.slug}`} onClick={onClose} className="rounded-full bg-ink px-4 py-2 text-sm text-ivory">
                    {b.name} boutique
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-6 max-h-[65vh] space-y-1 overflow-y-auto pb-10">
              {results.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Link href={`/product/${p.id}`} onClick={onClose} className="flex items-center gap-4 rounded-xl p-2 transition hover:bg-sand">
                    <Swatch palette={p.palette} image={p.image} className="h-16 w-12 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="text-sm text-muted">{getBoutique(p.boutique)?.name}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatINR(p.price)}</p>
                  </Link>
                </motion.div>
              ))}
              {q && !results.length && !shops.length && (
                <p className="py-8 text-center text-muted">Nothing matches "{q}" yet. Try "saree" or "kurta".</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
