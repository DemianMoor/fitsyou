import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Plan — Fits You",
  description:
    "A precise, ten-minute intake. Body, goals, food, and training — your plan calibrates around you.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
