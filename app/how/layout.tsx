import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Fits — Fits You",
  description:
    "Measured, calibrated, delivered. How Fits You turns a precise intake into your meal kits, supplement stack, and training.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
