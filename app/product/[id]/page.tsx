import Link from "next/link";
import { notFound } from "next/navigation";
import Accordion from "@/components/Accordion";
import AddToBag from "@/components/AddToBag";
import CustomRequestForm from "@/components/CustomRequestForm";
import DeliveryCountdown from "@/components/DeliveryCountdown";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { Reveal } from "@/components/Motion";
import { CashIcon, ReturnIcon } from "@/components/Icons";
import { getBoutique, getProduct, products } from "@/lib/catalog";
import { deliveryPromise, formatINR, RETURN_WINDOW_HOURS } from "@/lib/config";

// Rendered per request so the same-day delivery promise follows the clock.
export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  const boutique = getBoutique(product.boutique)!;
  const off = Math.round((1 - product.price / product.mrp) * 100);
  const related = products
    .filter((p) => p.id !== product.id && (p.boutique === product.boutique || p.category === product.category))
    .slice(0, 4);

  return (
    <div className="pt-4">
      <nav className="mb-5 flex gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href={`/category/${product.category}`} className="capitalize hover:text-ink">{product.category}</Link>
        <span>/</span>
        <span className="truncate text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-[1.15fr_1fr] lg:gap-14">
        <div className="md:sticky md:top-24 md:self-start">
          <ProductGallery product={product} monogram={boutique.name[0]} />
        </div>

        <div className="space-y-6">
          <div>
            <Link href={`/boutique/${boutique.slug}`} className="text-xs font-semibold tracking-[0.2em] text-gold uppercase hover:underline">
              {boutique.name} · {boutique.area}
            </Link>
            <h1 className="mt-2 font-display text-3xl leading-tight tracking-tight sm:text-4xl">{product.name}</h1>
            <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-2xl font-semibold">{formatINR(product.price)}</span>
              {off > 0 && (
                <>
                  <span className="text-sm text-muted line-through">MRP {formatINR(product.mrp)}</span>
                  <span className="rounded-full bg-maroon/10 px-2 py-0.5 text-xs font-semibold text-maroon">{off}% off</span>
                </>
              )}
            </p>
            <p className="mt-1 text-xs text-muted">Inclusive of all taxes</p>
          </div>

          <AddToBag product={product} />

          <DeliveryCountdown fallback={deliveryPromise()} />

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 rounded-2xl bg-white p-3 ring-1 ring-linen">
              <ReturnIcon className="h-5 w-5 shrink-0 text-gold" />
              {product.returnable ? `${RETURN_WINDOW_HOURS}-hour easy returns` : "Not returnable"}
            </div>
            <div className="flex items-center gap-2.5 rounded-2xl bg-white p-3 ring-1 ring-linen">
              <CashIcon className="h-5 w-5 shrink-0 text-gold" />
              Cash on delivery
            </div>
          </div>

          {product.customisable && <CustomRequestForm productId={product.id} />}

          <Accordion
            items={[
              {
                title: "Product details",
                body: (
                  <>
                    <p>{product.description}</p>
                    <p>Fabric: {product.fabric}</p>
                  </>
                ),
              },
              {
                title: "Delivery and returns",
                body: (
                  <>
                    <p>Order before 4 pm for delivery the same evening within Kozhikode city; later orders arrive the next day by 1 pm.</p>
                    <p>
                      {product.returnable
                        ? `Changed your mind? Request a return within ${RETURN_WINDOW_HOURS} hours of delivery and we collect it.`
                        : "This item cannot be returned."}{" "}
                      Customised items are made for you and cannot be returned.
                    </p>
                  </>
                ),
              },
              {
                title: "About the boutique",
                body: (
                  <>
                    <p>{boutique.story}</p>
                    <p className="text-xs">Sold by {boutique.name}, {boutique.area}, Kozhikode, Kerala.</p>
                    <Link href={`/boutique/${boutique.slug}`} className="inline-block pt-1 font-semibold text-ink underline underline-offset-4">
                      Visit {boutique.name}
                    </Link>
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <Reveal>
            <h2 className="mb-6 font-display text-3xl tracking-tight">You may also like</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
