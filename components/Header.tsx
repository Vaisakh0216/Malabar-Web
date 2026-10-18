"use client";

import Link from "next/link";
import { SITE_NAME } from "@/lib/config";
import { useCart } from "./CartProvider";

export default function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight text-brand">
          {SITE_NAME}
        </Link>
        <nav className="hidden gap-5 text-sm font-medium sm:flex">
          <Link href="/category/women">Women</Link>
          <Link href="/category/men">Men</Link>
          <Link href="/category/kids">Kids</Link>
          <Link href="/collection/trending" className="text-brand">
            Trending
          </Link>
        </nav>
        <Link href="/cart" className="ml-auto text-sm font-medium">
          Bag{count > 0 && <span className="ml-1 rounded-full bg-brand px-2 py-0.5 text-xs text-white">{count}</span>}
        </Link>
      </div>
      <nav className="flex gap-5 overflow-x-auto px-4 pb-2 text-sm font-medium sm:hidden">
        <Link href="/category/women">Women</Link>
        <Link href="/category/men">Men</Link>
        <Link href="/category/kids">Kids</Link>
        <Link href="/collection/trending" className="text-brand">
          Trending
        </Link>
      </nav>
    </header>
  );
}
