"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";
import { BagIcon, GridIcon, HeartIcon, HomeIcon } from "./Icons";

// App-style bottom navigation on phones.
export default function MobileTabBar() {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const { ids } = useWishlist();
  if (pathname.startsWith("/admin") || pathname.startsWith("/checkout")) return null;

  const item = "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium";
  const on = (href: string) => (pathname === href ? "text-ink" : "text-muted");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-linen bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden">
      <div className="flex">
        <Link href="/" className={`${item} ${on("/")}`}>
          <HomeIcon />
          Home
        </Link>
        <Link href="/boutiques" className={`${item} ${on("/boutiques")}`}>
          <GridIcon />
          Boutiques
        </Link>
        <Link href="/wishlist" className={`${item} ${on("/wishlist")} relative`}>
          <HeartIcon />
          Wishlist
          {ids.length > 0 && <span className="absolute right-[30%] top-1.5 h-2 w-2 rounded-full bg-maroon" />}
        </Link>
        <button type="button" onClick={() => setOpen(true)} className={`${item} relative text-muted`}>
          <BagIcon />
          Bag
          {count > 0 && (
            <span className="absolute right-[26%] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-bold text-ivory">
              {count}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
