import { getBoutique, getProduct } from "./catalog";
import { deliveryFee } from "./config";
import type { CartItem, OrderLine } from "./types";

// Prices always come from the catalogue, never from the browser.
export function priceCart(items: CartItem[]) {
  const lines: OrderLine[] = [];
  for (const item of items) {
    const product = getProduct(item.productId);
    if (!product || !product.sizes.includes(item.size) || item.qty < 1) continue;
    lines.push({
      productId: product.id,
      name: product.name,
      boutique: getBoutique(product.boutique)?.name ?? product.boutique,
      size: item.size,
      qty: Math.min(Math.floor(item.qty), 10),
      price: product.price,
    });
  }
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const fee = lines.length ? deliveryFee(subtotal) : 0;
  return { lines, subtotal, deliveryFee: fee, total: subtotal + fee };
}
