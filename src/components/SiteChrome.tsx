"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

/** Public site chrome (navbar + footer).
 *  Hidden inside the ERP (/admin/*) which has its own shell. */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPortal = pathname?.startsWith("/admin") || pathname?.startsWith("/student") || false;

  if (isPortal) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
