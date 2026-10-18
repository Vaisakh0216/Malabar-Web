import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import ExpertButton from "@/components/ExpertButton";
import { GRIEVANCE_OFFICER, RETURN_WINDOW_HOURS, SITE_NAME, SITE_TAGLINE } from "@/lib/config";

export const metadata: Metadata = {
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description: "Shop Malabar clothing from Calicut's boutiques with same-day delivery.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = { themeColor: "#9b2226", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <CartProvider>
          <Header />
          <main className="mx-auto max-w-6xl px-4 pb-24">{children}</main>
          <footer className="border-t border-black/5 bg-white">
            <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm text-neutral-600 sm:grid-cols-3">
              <div>
                <p className="font-semibold text-neutral-900">{SITE_NAME}</p>
                <p>{SITE_TAGLINE}. Same-day delivery within Kozhikode city.</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-neutral-900">Help</p>
                <p>Returns accepted within {RETURN_WINDOW_HOURS} hours of delivery. Customised items cannot be returned.</p>
                <Link href="/cart" className="underline">
                  Your bag
                </Link>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-neutral-900">Grievance officer</p>
                <p>{GRIEVANCE_OFFICER.name}</p>
                <p>
                  {GRIEVANCE_OFFICER.email} · {GRIEVANCE_OFFICER.phone}
                </p>
              </div>
            </div>
          </footer>
          <ExpertButton />
        </CartProvider>
      </body>
    </html>
  );
}
