import { notFound } from "next/navigation";
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
    <div className="space-y-6 pt-4">
      <div>
        <h1 className="text-2xl font-bold">{collection.name}</h1>
        <p className="text-neutral-600">{collection.description}</p>
      </div>
      <ProductGrid products={productsInCollection(collection.slug)} />
    </div>
  );
}
