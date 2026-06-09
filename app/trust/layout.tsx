import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trust & FAQ — Fits You",
  description:
    "Plain answers on how Fits You works, your data, supplements, and results. Individual results vary.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
