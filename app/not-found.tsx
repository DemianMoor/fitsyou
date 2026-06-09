import Link from "next/link";
import { FitMark } from "@/components/FitMark";

const BRASS = "#B79256", OBSIDIAN = "#101114", BONE = "#F5F2EB";

export default function NotFound() {
  return (
    <div style={{ background: OBSIDIAN, minHeight: "100vh", paddingTop: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: "96px 32px" }}>
        <FitMark size={18} />
        <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: BRASS, margin: "28px 0 0" }}>
          404
        </p>
        <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 400, color: BONE, letterSpacing: "-0.025em", margin: "12px 0 14px", lineHeight: 1.05 }}>
          This page isn&apos;t on the menu.
        </h1>
        <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 15, color: "rgba(245,242,235,0.55)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 420 }}>
          The page you&apos;re looking for moved or never existed. Let&apos;s get you back to something that fits.
        </p>
        <Link href="/" style={{ display: "inline-block", background: BRASS, color: OBSIDIAN, fontFamily: "var(--font-archivo), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "14px 28px", borderRadius: 4, textDecoration: "none" }}>
          Back home
        </Link>
      </div>
    </div>
  );
}
