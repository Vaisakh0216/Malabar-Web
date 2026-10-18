import Link from "next/link";
import { boutiques } from "@/lib/catalog";
import { GRIEVANCE_OFFICER, RETURN_WINDOW_HOURS, SITE_NAME, SITE_TAGLINE, whatsappLink } from "@/lib/config";

const shop = [
  { href: "/collection/trending", label: "New in" },
  { href: "/category/women", label: "Women" },
  { href: "/category/men", label: "Men" },
  { href: "/category/kids", label: "Kids" },
  { href: "/collection/wedding", label: "Wedding" },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-ivory/80">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-28 sm:pb-12">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <p className="font-display text-3xl text-ivory">
              {SITE_NAME}
              <span className="text-gold">.</span>
            </p>
            <p className="mt-3 max-w-xs text-sm">{SITE_TAGLINE}. Same-day delivery within Kozhikode city.</p>
            <a
              href={whatsappLink("Hi, I need help choosing an outfit.")}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm text-ivory transition hover:border-gold hover:text-gold"
            >
              Chat with a stylist on WhatsApp
            </a>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Shop</p>
            <ul className="mt-4 space-y-2 text-sm">
              {shop.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-ivory">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Boutiques</p>
            <ul className="mt-4 space-y-2 text-sm">
              {boutiques.map((b) => (
                <li key={b.slug}>
                  <Link href={`/boutique/${b.slug}`} className="hover:text-ivory">
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Help</p>
              <p className="mt-4">
                Returns within {RETURN_WINDOW_HOURS} hours of delivery. Customised items are made for you and cannot be
                returned.
              </p>
              <p className="mt-2">Cash on delivery, UPI and cards.</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Grievance officer</p>
              <p className="mt-2">{GRIEVANCE_OFFICER.name}</p>
              <p>
                {GRIEVANCE_OFFICER.email} · {GRIEVANCE_OFFICER.phone}
              </p>
            </div>
          </div>
        </div>
        <p className="pt-6 text-xs text-ivory/50">
          © {new Date().getFullYear()} {SITE_NAME}. Made in Kozhikode.
        </p>
      </div>
    </footer>
  );
}
