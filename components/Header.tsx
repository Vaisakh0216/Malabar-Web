"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SITE_NAME } from "@/lib/config";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";
import { BagIcon, HeartIcon, SearchIcon } from "./Icons";
import SearchOverlay from "./SearchOverlay";

const nav = [
  { href: "/collection/trending", label: "New in" },
  { href: "/category/women", label: "Women" },
  { href: "/category/men", label: "Men" },
  { href: "/category/kids", label: "Kids" },
  { href: "/collection/wedding", label: "Wedding" },
  { href: "/boutiques", label: "Boutiques" },
];

export default function Header() {
  const { count, setOpen } = useCart();
  const { ids } = useWishlist();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          scrolled ? "border-b border-linen/80 bg-ivory/85 shadow-[0_8px_30px_-20px_rgba(0,0,0,0.25)] backdrop-blur-md" : "bg-ivory"
        }`}
      >
        <div className={`mx-auto flex max-w-7xl items-center gap-8 px-4 transition-all duration-300 sm:px-6 ${scrolled ? "py-3" : "py-4"}`}>
          <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
            {SITE_NAME}
            <span className="text-gold">.</span>
          </Link>
          <nav className="hidden flex-1 justify-center gap-7 text-sm font-medium lg:flex">
            {nav.map((n) => {
              const active = pathname === n.href;
              return (
                <Link key={n.href} href={n.href} className="group relative py-1 text-ink/80 transition hover:text-ink">
                  {n.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-ink transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearching(true)}
              className="rounded-full p-2.5 transition hover:bg-sand"
            >
              <SearchIcon />
            </button>
            <Link href="/wishlist" aria-label="Wishlist" className="relative hidden rounded-full p-2.5 transition hover:bg-sand sm:block">
              <HeartIcon />
              {ids.length > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-maroon" />}
            </Link>
            <button
              type="button"
              aria-label="Open bag"
              onClick={() => setOpen(true)}
              className="relative hidden rounded-full p-2.5 transition hover:bg-sand sm:block"
            >
              <BagIcon />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-bold text-ivory"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
        <nav className="no-scrollbar flex gap-5 overflow-x-auto px-4 pb-3 text-sm font-medium text-ink/80 lg:hidden">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={`whitespace-nowrap ${pathname === n.href ? "text-ink underline underline-offset-8" : ""}`}>
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <SearchOverlay open={searching} onClose={() => setSearching(false)} />
    </>
  );
}
