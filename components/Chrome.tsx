"use client";

import { usePathname } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

// Ports Root.tsx: /plan gets a dark nav and no footer.
const DARK_NAV_PATHS = ["/plan"];
const NO_FOOTER_PATHS = ["/plan"];

export function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDark = DARK_NAV_PATHS.includes(pathname);
  const showFooter = !NO_FOOTER_PATHS.includes(pathname);

  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <Nav dark={isDark} />
      <main>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
