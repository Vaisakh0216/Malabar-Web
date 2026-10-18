import { notFound } from "next/navigation";
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
    <div className="space-y-6 pt-4">
      <h1 className="text-2xl font-bold">{titles[key]}</h1>
      <ProductGrid products={products.filter((p) => p.category === key)} />
    </div>
  );
}
