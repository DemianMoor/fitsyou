import { getSupplements, getFeatureFlags } from "@/lib/content";
import { SupplementsView, type SupplementCard } from "@/components/pages/SupplementsView";

export const metadata = {
  title: "Supplements — Fits You",
  description:
    "A personalized supplement stack derived from your intake, gaps, and goals. Third-party tested, dietitian-reviewed.",
};

export default async function SupplementsPage() {
  const flags = await getFeatureFlags();
  if (!flags.has_supplements) return <SupplementsView products={null} />;

  const supplements = await getSupplements();
  // null/empty → no catalog grid; the conceptual stack explainer always shows.
  const products: SupplementCard[] | null =
    supplements && supplements.length > 0
      ? supplements.map((s) => ({
          name: s.name,
          benefit: s.benefit_statement ?? "",
          category: s.category ?? "",
          img: s.image_url ?? "",
          requiresDisclaimer: s.requires_dshea_disclaimer,
        }))
      : null;
  return <SupplementsView products={products} />;
}
