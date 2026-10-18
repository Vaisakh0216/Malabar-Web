"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Wishlist = { ids: string[]; has: (id: string) => boolean; toggle: (id: string) => void };

const WishlistContext = createContext<Wishlist | null>(null);
const KEY = "wishlist-v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setIds(JSON.parse(saved));
    } catch {}
  }, []);

  function toggle(id: string) {
    const next = ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];
    setIds(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  }

  return (
    <WishlistContext.Provider value={{ ids, has: (id) => ids.includes(id), toggle }}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const wishlist = useContext(WishlistContext);
  if (!wishlist) throw new Error("useWishlist must be used inside WishlistProvider");
  return wishlist;
}
