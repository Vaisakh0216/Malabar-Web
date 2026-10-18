"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem } from "@/lib/types";

type Cart = {
  items: CartItem[];
  add: (item: CartItem) => void;
  setQty: (productId: string, size: string, qty: number) => void;
  clear: () => void;
  count: number;
};

const CartContext = createContext<Cart | null>(null);
const KEY = "cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  function update(next: CartItem[]) {
    setItems(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  }

  const cart: Cart = {
    items,
    count: items.reduce((n, i) => n + i.qty, 0),
    add(item) {
      const existing = items.find((i) => i.productId === item.productId && i.size === item.size);
      update(
        existing
          ? items.map((i) => (i === existing ? { ...i, qty: i.qty + item.qty } : i))
          : [...items, item],
      );
    },
    setQty(productId, size, qty) {
      update(
        items
          .map((i) => (i.productId === productId && i.size === size ? { ...i, qty } : i))
          .filter((i) => i.qty > 0),
      );
    },
    clear() {
      update([]);
    },
  };

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside CartProvider");
  return cart;
}
