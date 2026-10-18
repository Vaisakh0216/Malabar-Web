import Link from "next/link";
import { notFound } from "next/navigation";
import AddToBag from "@/components/AddToBag";
import CustomRequestForm from "@/components/CustomRequestForm";
import Swatch from "@/components/Swatch";
import { getBoutique, getProduct } from "@/lib/catalog";
import { deliveryPromise, formatINR, RETURN_WINDOW_HOURS } from "@/lib/config";

// Rendered per request so the same-day delivery promise follows the clock.
export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  const boutique = getBoutique(product.boutique)!;
  const off = Math.round((1 - product.price / product.mrp) * 100);

  return (
    <div className="grid gap-8 pt-4 md:grid-cols-2">
      <Swatch palette={product.palette} label="Photo coming soon" className="aspect-[3/4] rounded-2xl" />
      <div className="space-y-5">
        <div>
          <Link href={`/boutique/${boutique.slug}`} className="text-lg font-bold hover:underline">
            {boutique.name}
          </Link>
          <h1 className="text-xl text-neutral-700">{product.name}</h1>
        </div>
        <p className="text-2xl font-bold">
          {formatINR(product.price)}
          {off > 0 && (
            <span className="ml-3 text-base font-normal">
              <span className="text-neutral-400 line-through">MRP {formatINR(product.mrp)}</span>
              <span className="ml-2 text-orange-600">{off}% off</span>
            </span>
          )}
        </p>
        <p className="text-xs text-neutral-500">Inclusive of all taxes</p>

        <AddToBag product={product} />

        <ul className="space-y-1 text-sm">
          <li className="text-green-700">{deliveryPromise()} within Kozhikode city</li>
          <li>{product.returnable ? `Easy returns within ${RETURN_WINDOW_HOURS} hours of delivery` : "This item cannot be returned"}</li>
          <li>Cash on delivery available</li>
        </ul>

        {product.customisable && <CustomRequestForm productId={product.id} />}

        <div className="space-y-1 border-t pt-4 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">Product details</p>
          <p>{product.description}</p>
          <p>Fabric: {product.fabric}</p>
          <p className="pt-2 text-xs text-neutral-500">
            Sold by {boutique.name}, {boutique.area}, Kozhikode, Kerala
          </p>
        </div>
      </div>
    </div>
  );
}
