import type { Metadata } from "next";
import { Fraunces, Archivo } from "next/font/google";
import { Chrome } from "@/components/Chrome";
import "./globals.css";

// Brand fonts (replaces the Make export's Google Fonts @import).
// Fraunces = display / Fraunces voice; Archivo = UI / body / labels.
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "Fits You — Measured. Made for one.",
  description:
    "Personalized meal kits, supplements, and training — calibrated precisely to you. Delivered across the US.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${archivo.variable}`}>
      <body>
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
