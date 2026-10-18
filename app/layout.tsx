import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/manrope";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { WishlistProvider } from "@/components/WishlistProvider";
import { MotionProvider } from "@/components/Motion";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileTabBar from "@/components/MobileTabBar";
import ExpertButton from "@/components/ExpertButton";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/config";

export const metadata: Metadata = {
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description: "Shop Malabar clothing from Calicut's boutiques with same-day delivery.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = { themeColor: "#faf7f2", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ivory font-sans text-ink antialiased">
        <MotionProvider>
          <CartProvider>
            <WishlistProvider>
              <AnnouncementBar />
              <Header />
              <main className="mx-auto max-w-7xl px-4 pb-12">{children}</main>
              <Footer />
              <CartDrawer />
              <MobileTabBar />
              <ExpertButton />
            </WishlistProvider>
          </CartProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
