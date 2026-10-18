import Link from "next/link";
import { getBoutique } from "@/lib/catalog";
import { formatINR } from "@/lib/config";
import type { Product } from "@/lib/types";
import Swatch from "./Swatch";

export default function ProductCard({ product }: { product: Product }) {
  const boutique = getBoutique(product.boutique);
  const off = Math.round((1 - product.price / product.mrp) * 100);
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <Swatch palette={product.palette} className="aspect-[3/4] rounded-lg transition group-hover:opacity-90" />
      <div className="mt-2 space-y-0.5">
        <p className="text-sm font-semibold">{boutique?.name}</p>
        <p className="truncate text-sm text-neutral-600">{product.name}</p>
        <p className="text-sm">
          <span className="font-semibold">{formatINR(product.price)}</span>
          {off > 0 && (
            <>
              <span className="ml-2 text-neutral-400 line-through">{formatINR(product.mrp)}</span>
              <span className="ml-2 text-orange-600">{off}% off</span>
            </>
          )}
        </p>
      </div>
    </Link>
  );
}
