import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import Swatch from "@/components/Swatch";
import { Reveal } from "@/components/Motion";
import { boutiques, getBoutique, productsByBoutique } from "@/lib/catalog";

export function generateStaticParams() {
  return boutiques.map((b) => ({ slug: b.slug }));
}

export default async function BoutiquePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const boutique = getBoutique(slug);
  if (!boutique) notFound();
  return (
    <div className="space-y-8 pt-4">
      <Reveal className="relative overflow-hidden rounded-[2rem] bg-sand">
        <div className="grid items-center gap-6 p-6 sm:grid-cols-[220px_1fr] sm:p-10">
          <div className="overflow-hidden rounded-3xl ring-4 ring-white">
            <Swatch palette={boutique.palette} monogram={boutique.name[0]} className="aspect-square" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">{boutique.area}, Kozhikode</p>
            <h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">{boutique.name}</h1>
            <p className="mt-2 text-ink/80">{boutique.tagline}</p>
            <p className="mt-3 max-w-xl text-sm text-muted">{boutique.story}</p>
          </div>
        </div>
      </Reveal>
      <ProductGrid products={productsByBoutique(boutique.slug)} />
    </div>
  );
}
