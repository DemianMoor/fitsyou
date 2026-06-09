import { getMealKits, getFeatureFlags } from "@/lib/content";
import { MealKitsView, type MealCard } from "@/components/pages/MealKitsView";

export const metadata = {
  title: "Meal Kits — Fits You",
  description:
    "Personalized meal kits cooked for your numbers. Fresh ingredients, precise portions, calibrated to your plan.",
};

function num(n: unknown): number | null {
  return typeof n === "number" ? n : null;
}

export default async function MealKitsPage() {
  const flags = await getFeatureFlags();
  if (!flags.has_meal_kits) return <MealKitsView meals={[]} />;

  const kits = await getMealKits();
  const meals: MealCard[] | null =
    kits === null
      ? null
      : kits.map((k) => ({
          name: k.name,
          tag: k.tagline ?? k.dietary_tags.join(" · "),
          cal: num(k.nutrition?.calories),
          protein: num(k.nutrition?.protein_g),
          carb: num(k.nutrition?.carbs_g),
          fat: num(k.nutrition?.fat_g),
          img: k.image_url ?? "",
        }));
  return <MealKitsView meals={meals} />;
}
