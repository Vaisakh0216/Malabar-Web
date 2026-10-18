import { notFound } from "next/navigation";
import { Reveal } from "@/components/Motion";
import ProductGrid from "@/components/ProductGrid";
import { collections, getCollection, productsInCollection } from "@/lib/catalog";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  return (
    <div className="space-y-8 pt-4">
      <Reveal className="relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14" style={{ background: `linear-gradient(120deg, ${collection.slug === "trending" ? "#e9d9b6" : collection.palette[0]}, ${collection.palette[1]}55)` }}>
        <p className="text-xs font-semibold tracking-[0.2em] text-ink/60 uppercase">Collection</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">{collection.name}</h1>
        <p className="mt-2 max-w-xl text-sm text-ink/70">{collection.description}</p>
      </Reveal>
      <ProductGrid products={productsInCollection(collection.slug)} />
    </div>
  );
}
