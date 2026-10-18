import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import Swatch from "@/components/Swatch";
import { boutiques, getBoutique, productsByBoutique } from "@/lib/catalog";

export function generateStaticParams() {
  return boutiques.map((b) => ({ slug: b.slug }));
}

export default async function BoutiquePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const boutique = getBoutique(slug);
  if (!boutique) notFound();
  return (
    <div className="space-y-6 pt-4">
      <div className="grid items-center gap-6 sm:grid-cols-[200px_1fr]">
        <Swatch palette={boutique.palette} className="aspect-square rounded-2xl" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">{boutique.area}, Kozhikode</p>
          <h1 className="text-2xl font-bold">{boutique.name}</h1>
          <p className="text-neutral-700">{boutique.tagline}</p>
          <p className="mt-2 max-w-xl text-sm text-neutral-600">{boutique.story}</p>
        </div>
      </div>
      <ProductGrid products={productsByBoutique(boutique.slug)} />
    </div>
  );
}
