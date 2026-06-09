import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Fits You",
  description:
    "Clear, confident pricing for personalized meal kits, supplements, and training. No lock-in — pause or cancel anytime.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
