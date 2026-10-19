import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Swatch from "@/components/Swatch";
import { Reveal } from "@/components/Motion";
import { ArrowIcon, CashIcon, ReturnIcon, ScissorsIcon, TruckIcon } from "@/components/Icons";
import { boutiques, getBoutique, getProduct, productsInCollection, sample } from "@/lib/catalog";
import { deliveryPromise, formatINR, RETURN_WINDOW_HOURS, SITE_TAGLINE, whatsappLink } from "@/lib/config";

export const dynamic = "force-dynamic";

const categories = [
  { href: "/collection/kasavu", image: sample("1678705730064-a7ecbab4b3fb", 300), label: "Kasavu", palette: ["#f5e6c8", "#c9a227"] as [string, string] },
  { href: "/collection/wedding", image: sample("1610047614301-13c63f00c032", 300), label: "Wedding", palette: ["#f8d7da", "#9b2226"] as [string, string] },
  { href: "/collection/everyday-cotton", image: sample("1706943262459-3ef6ce03305c", 300), label: "Everyday", palette: ["#fde2e4", "#e76f51"] as [string, string] },
  { href: "/category/women", image: sample("1610030469839-f909584b43f1", 300), label: "Women", palette: ["#efe1d1", "#7a2e2a"] as [string, string] },
  { href: "/category/men", image: sample("1760080838961-4208536db385", 300), label: "Men", palette: ["#e0e7ff", "#3a5a9b"] as [string, string] },
  { href: "/category/kids", image: sample("1594135356513-14291e55162a", 300), label: "Kids", palette: ["#d8f3dc", "#2d6a4f"] as [string, string] },
];

const heroPicks = ["kh-kasavu-saree-peacock", "bb-lehenga-rose", "tt-kasavu-shirt-set"];

const steps = [
  { title: "Order by 4 pm", body: "Pick from boutiques across Kozhikode, pay online or cash on delivery." },
  { title: "Delivered by 9 pm", body: "Packed by the boutique and brought to your door the same evening." },
  { title: `Keep it or return in ${RETURN_WINDOW_HOURS}h`, body: "Not the right fit? We collect it back, no questions asked." },
];

export default function Home() {
  const trending = productsInCollection("trending").slice(0, 8);
  const picks = heroPicks.map((id) => getProduct(id)).filter((p) => p !== undefined);

  return (
    <div className="space-y-20 pt-2 sm:space-y-28">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] bg-sand px-6 py-12 sm:px-12 sm:py-16 lg:py-20">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold-soft/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-linen blur-3xl" />
        <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-ink/80 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-leaf" />
              {SITE_TAGLINE}
            </p>
            <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] font-medium tracking-tight sm:text-6xl lg:text-7xl">
              Wear Malabar
              <br />
              <span className="italic text-maroon">tonight.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-ink/70 sm:text-lg">
              Kasavu, wedding wear and everyday cotton from the city&apos;s favourite boutiques, at your door the same
              day.
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5 sm:gap-3">
              <Link
                href="/collection/trending"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-semibold text-ivory transition hover:bg-ink/90 sm:px-6"
              >
                Shop now
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/boutiques"
                className="inline-flex items-center rounded-full border border-ink/20 bg-white/50 px-5 py-3.5 sm:px-6 text-sm font-semibold transition hover:border-ink"
              >
                Explore boutiques
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-ink/10 pt-6 text-xs">
              <div>
                <TruckIcon className="h-5 w-5 text-leaf" />
                <dt className="mt-2 font-semibold">Same-day</dt>
                <dd className="text-muted">delivery</dd>
              </div>
              <div>
                <ReturnIcon className="h-5 w-5 text-leaf" />
                <dt className="mt-2 font-semibold">{RETURN_WINDOW_HOURS}-hour</dt>
                <dd className="text-muted">returns</dd>
              </div>
              <div>
                <CashIcon className="h-5 w-5 text-leaf" />
                <dt className="mt-2 font-semibold">Cash on</dt>
                <dd className="text-muted">delivery</dd>
              </div>
            </dl>
          </Reveal>

          <div className="relative mx-auto h-[360px] w-full max-w-sm sm:h-[440px]">
            {picks.map((p, i) => {
              const pos = [
                "left-0 top-6 w-[58%] -rotate-6",
                "right-0 top-0 w-[58%] rotate-3 [animation-delay:-2s]",
                "left-[21%] bottom-0 w-[58%] -rotate-1 [animation-delay:-4s]",
              ][i];
              return (
                <Reveal key={p.id} delay={0.15 + i * 0.12} className={`absolute ${pos}`}>
                  <Link href={`/product/${p.id}`} className="block animate-float rounded-3xl bg-white p-2 shadow-[0_30px_60px_-30px_rgba(31,27,22,0.45)] transition hover:-translate-y-1" style={{ animationDelay: `${-i * 2}s` }}>
                    <Swatch palette={p.palette} image={p.image} alt={p.name} monogram={getBoutique(p.boutique)?.name[0]} className="aspect-[4/5] rounded-2xl" />
                    <div className="flex items-center justify-between px-1.5 pb-1 pt-2 text-[11px]">
                      <span className="truncate font-medium">{p.name.split(",")[0]}</span>
                      <span className="ml-2 shrink-0 font-semibold">{formatINR(p.price)}</span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <Reveal className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Shop by mood</h2>
        </Reveal>
        <div className="no-scrollbar -mx-4 flex gap-5 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-6 sm:px-0">
          {categories.map((c, i) => (
            <Reveal key={c.href} delay={i * 0.05} className="shrink-0">
              <Link href={c.href} className="group block w-20 text-center sm:w-auto">
                <div className="overflow-hidden rounded-full ring-1 ring-linen transition group-hover:ring-2 group-hover:ring-gold">
                  <Swatch palette={c.palette} image={c.image} alt={c.label} className="aspect-square transition-transform duration-500 group-hover:scale-110" />
                </div>
                <p className="mt-2.5 text-sm font-medium">{c.label}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Boutique stories */}
      <section>
        <Reveal className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Boutiques of Calicut</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">Straight from the shop floor</h2>
          </div>
          <Link href="/boutiques" className="hidden shrink-0 items-center gap-1 text-sm font-medium sm:inline-flex">
            All boutiques <ArrowIcon />
          </Link>
        </Reveal>
        <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-5 sm:px-0">
          {boutiques.map((b, i) => (
            <Reveal key={b.slug} delay={i * 0.06} className="w-[70%] shrink-0 snap-start sm:w-auto">
              <Link href={`/boutique/${b.slug}`} className="group block overflow-hidden rounded-3xl bg-white ring-1 ring-linen transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-25px_rgba(31,27,22,0.4)]">
                <div className="relative">
                  <Swatch palette={b.palette} image={b.image} alt={b.name} monogram={b.name[0]} className="aspect-[4/3]" imageClassName="transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold backdrop-blur">
                    {b.area}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-display text-lg leading-tight">{b.name}</p>
                  <p className="mt-1 text-xs text-muted">{b.tagline}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section>
        <Reveal className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">This week</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">Trending in Calicut</h2>
          </div>
          <Link href="/collection/trending" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium">
            View all <ArrowIcon />
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Promo banners */}
      <section className="grid gap-4 md:grid-cols-2">
        <Reveal>
          <Link href="/collection/wedding" className="group relative block overflow-hidden rounded-[2rem] bg-maroon p-8 text-ivory sm:p-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sample("1684868268327-7e5590bcfbd6", 900)}
              alt=""
              loading="lazy"
              className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/2 object-cover opacity-90 transition-transform duration-700 [mask-image:linear-gradient(to_right,transparent,black_45%)] group-hover:scale-105"
            />
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[28px] border-gold/30 transition-transform duration-700 group-hover:scale-110" />
            <p className="relative text-xs font-semibold tracking-[0.2em] text-gold-soft uppercase">Wedding season</p>
            <h3 className="relative mt-3 max-w-[60%] font-display text-3xl leading-tight sm:text-4xl">Bridal, groom and guest wear</h3>
            <p className="relative mt-3 max-w-[55%] text-sm text-ivory/75">Sarees, lehengas and sherwanis from Calicut&apos;s bridal houses.</p>
            <span className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-ivory px-5 py-2.5 text-sm font-semibold text-ink">
              Shop wedding <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <Link href="/customise" className="group relative block overflow-hidden rounded-[2rem] bg-gold-soft p-8 sm:p-10">
            <ScissorsIcon className="pointer-events-none absolute right-8 top-8 h-24 w-24 text-gold/40 transition-transform duration-700 group-hover:rotate-12" />
            <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Made for you</p>
            <h3 className="mt-3 max-w-xs font-display text-3xl leading-tight sm:text-4xl">Customise any design</h3>
            <p className="mt-3 max-w-xs text-sm text-ink/70">Share your measurements and the boutique tailors it. Look for the Customisable tag.</p>
            <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ivory">
              See customisable styles <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </Reveal>
      </section>

      {/* How it works */}
      <section className="rounded-[2rem] bg-ink px-6 py-12 text-ivory sm:px-12">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">How it works</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">From boutique to you, today</h2>
          <p className="mt-2 text-sm text-ivory/60">Order now in Kozhikode city: {deliveryPromise()}.</p>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12}>
              <div>
                <span className="font-display text-5xl text-gold/80">0{i + 1}</span>
                <p className="mt-3 text-lg font-semibold">{s.title}</p>
                <p className="mt-1 text-sm text-ivory/65">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stylist */}
      <Reveal>
        <section className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border border-linen bg-white px-6 py-10 sm:flex-row sm:items-center sm:px-12">
          <div>
            <h2 className="font-display text-2xl tracking-tight sm:text-3xl">Not sure what to wear?</h2>
            <p className="mt-2 max-w-lg text-sm text-muted">
              Tell our stylist the occasion and your budget on WhatsApp. They&apos;ll send picks from every boutique.
            </p>
          </div>
          <a
            href={whatsappLink("Hi, I need help choosing an outfit.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-leaf px-6 py-3.5 text-sm font-semibold text-ivory transition hover:bg-leaf/90"
          >
            Talk to a stylist <ArrowIcon />
          </a>
        </section>
      </Reveal>
    </div>
  );
}
