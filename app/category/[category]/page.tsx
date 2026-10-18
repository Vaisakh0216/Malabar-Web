import { notFound } from "next/navigation";
import { Reveal } from "@/components/Motion";
import ProductGrid from "@/components/ProductGrid";
import { products } from "@/lib/catalog";

const titles = { women: "Women", men: "Men", kids: "Kids" } as const;

export function generateStaticParams() {
  return Object.keys(titles).map((category) => ({ category }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!(category in titles)) notFound();
  const key = category as keyof typeof titles;
  return (
    <div className="space-y-8 pt-4">
      <Reveal className="rounded-[2rem] bg-sand px-6 py-10 sm:px-10 sm:py-14">
        <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Shop</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">{titles[key]}</h1>
        <p className="mt-2 text-sm text-muted">From every boutique in Calicut, delivered the same day.</p>
      </Reveal>
      <ProductGrid products={products.filter((p) => p.category === key)} />
    </div>
  );
}
