"use client";

import Link from "next/link";
import { AnimatePresence } from "motion/react";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/components/WishlistProvider";
import { HeartIcon } from "@/components/Icons";
import { products } from "@/lib/catalog";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const saved = products.filter((p) => ids.includes(p.id));

  return (
    <div className="pt-6">
      <h1 className="font-display text-4xl tracking-tight">Wishlist</h1>
      <p className="mt-1 text-sm text-muted">{saved.length ? `${saved.length} saved` : "Tap the heart on any style to save it here."}</p>
      {saved.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl bg-sand px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-maroon">
            <HeartIcon className="h-6 w-6" />
          </span>
          <p className="mt-4 font-display text-2xl">Nothing saved yet</p>
          <Link href="/collection/trending" className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory">
            See what&apos;s trending
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {saved.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
