import Link from "next/link";
import Swatch from "@/components/Swatch";
import { Reveal } from "@/components/Motion";
import { ArrowIcon } from "@/components/Icons";
import { boutiques, productsByBoutique } from "@/lib/catalog";

export const metadata = { title: "Boutiques" };

export default function BoutiquesPage() {
  return (
    <div className="pt-6">
      <Reveal>
        <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Boutiques of Calicut</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">Shop the city&apos;s favourites</h1>
        <p className="mt-3 max-w-xl text-sm text-muted">Every boutique packs your order itself, and we bring it to you the same day.</p>
      </Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {boutiques.map((b, i) => (
          <Reveal key={b.slug} delay={i * 0.06}>
            <Link href={`/boutique/${b.slug}`} className="group block overflow-hidden rounded-3xl bg-white ring-1 ring-linen transition hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(31,27,22,0.45)]">
              <div className="overflow-hidden">
                <Swatch palette={b.palette} monogram={b.name[0]} className="aspect-[16/10] transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex items-end justify-between gap-4 p-5">
                <div>
                  <p className="text-[11px] font-semibold tracking-wider text-muted uppercase">{b.area}</p>
                  <p className="mt-1 font-display text-2xl leading-tight">{b.name}</p>
                  <p className="mt-1 text-sm text-muted">{b.tagline}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-xs font-medium">
                  {productsByBoutique(b.slug).length} styles <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
