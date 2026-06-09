import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Fits You",
  description:
    "We got tired of generic. Fits You closes the gap between nutrition science and what actually reaches your kitchen.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
