import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const display = Baloo_2({ variable: "--font-display", subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const body = Nunito({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: {
    default: "Sunshine Valley School — Let's Learn, Play & Grow Together",
    template: "%s · Sunshine Valley School",
  },
  description:
    "A joyful, modern school where every child discovers curiosity, builds confidence and grows into their brightest self. Nursery to Grade 8 · Admissions open.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full scroll-smooth`}>
      <body className="flex min-h-full flex-col bg-cream text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-xl focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
