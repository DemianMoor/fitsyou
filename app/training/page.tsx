import { getTrainingPlans, getFeatureFlags } from "@/lib/content";
import { TrainingView, type Protocol } from "@/components/pages/TrainingView";

export const metadata = {
  title: "Training — Fits You",
  description:
    "Custom training protocols derived from the same intake as your nutrition plan. Movement built for your body.",
};

function cap(s: string | null): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

export default async function TrainingPage() {
  const flags = await getFeatureFlags();
  if (!flags.has_training) return <TrainingView protocols={[]} />;

  const plans = await getTrainingPlans();
  const protocols: Protocol[] | null =
    plans === null
      ? null
      : plans.map((p) => ({
          name: p.name,
          tag: [cap(p.focus), p.level].filter(Boolean).join(" · "),
          desc: p.description ?? "",
          weeks: p.weeks ? `${p.weeks}-week cycles` : "",
          sessions: p.sessions_per_week ? `${p.sessions_per_week}× / week` : "",
          equipment: p.equipment.join(", "),
        }));
  return <TrainingView protocols={protocols} />;
}
