import ProductGrid from "@/components/ProductGrid";
import { products } from "@/lib/catalog";

export const metadata = { title: "Made for you" };

export default function CustomisePage() {
  return (
    <div className="space-y-6 pt-6">
      <div className="rounded-[2rem] bg-gold-soft px-6 py-10 sm:px-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Made for you</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Customise any design</h1>
        <p className="mt-2 max-w-xl text-sm text-ink/70">
          Open a style, tap &ldquo;Request a custom design&rdquo; and share your measurements. The boutique confirms the price
          and timeline on WhatsApp. Custom orders are prepaid and cannot be returned.
        </p>
      </div>
      <ProductGrid products={products} customOnly />
    </div>
  );
}
