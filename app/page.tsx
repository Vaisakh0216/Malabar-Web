import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Swatch from "@/components/Swatch";
import { boutiques, collections, productsInCollection } from "@/lib/catalog";
import { deliveryPromise } from "@/lib/config";

export const dynamic = "force-dynamic";

export default function Home() {
  const featured = collections[0];
  return (
    <div className="space-y-10 pt-4">
      <Link href={`/collection/${featured.slug}`} className="block">
        <div
          className="relative overflow-hidden rounded-2xl px-6 py-12 text-white sm:px-10 sm:py-16"
          style={{ background: `linear-gradient(120deg, ${featured.palette[0]} 40%, ${featured.palette[1]})` }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">Now live</p>
          <h1 className="mt-2 max-w-md text-3xl font-bold sm:text-4xl">{featured.name}</h1>
          <p className="mt-2 max-w-md text-white/80">{featured.description}</p>
          <span className="mt-6 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-neutral-900">
            Shop now
          </span>
        </div>
      </Link>

      <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
        Order now in Kozhikode city: <strong>{deliveryPromise()}</strong>.
      </p>

      <section>
        <h2 className="mb-4 text-lg font-bold">Boutiques of Calicut</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {boutiques.map((b) => (
            <Link key={b.slug} href={`/boutique/${b.slug}`} className="group block">
              <Swatch palette={b.palette} className="aspect-square rounded-xl group-hover:opacity-90" />
              <p className="mt-2 text-sm font-semibold">{b.name}</p>
              <p className="text-xs text-neutral-500">{b.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold">Collections</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {collections.slice(1).map((c) => (
            <Link key={c.slug} href={`/collection/${c.slug}`} className="group block">
              <Swatch palette={c.palette} className="h-36 rounded-xl group-hover:opacity-90" />
              <p className="mt-2 font-semibold">{c.name}</p>
              <p className="text-sm text-neutral-500">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-bold">Trending in Calicut</h2>
          <Link href={`/collection/${featured.slug}`} className="text-sm font-medium text-brand">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {productsInCollection(featured.slug)
            .slice(0, 8)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
    </div>
  );
}
