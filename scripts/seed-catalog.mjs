// Seed a handful of PUBLISHED catalog rows so the public pages render real
// content before the 3b /studio editor exists. Idempotent (upsert on slug).
//
// Run against the Fits You project (needs the service-role key):
//   node --env-file=.env.local scripts/seed-catalog.mjs
//
// Wellbeing/compliance: nutrition is product info (not a personal target);
// supplement copy is structure/function only (no disease claims).

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Use: node --env-file=.env.local scripts/seed-catalog.mjs");
  process.exit(1);
}
const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const now = new Date().toISOString();
const pub = (extra) => ({ status: "published", published_at: now, ...extra });

const mealKits = [
  { slug: "seared-salmon-miso-greens", name: "Seared Salmon, Miso Braised Greens", tagline: "High protein · Omega-rich", dietary_tags: ["high-protein", "pescatarian"], nutrition: { calories: 520, protein_g: 46, carbs_g: 28, fat_g: 24 }, sort_order: 1 },
  { slug: "grass-fed-sirloin-root-veg", name: "Grass-Fed Sirloin, Roasted Root Veg", tagline: "Strength recovery · Iron-forward", dietary_tags: ["high-protein"], nutrition: { calories: 640, protein_g: 52, carbs_g: 38, fat_g: 22 }, sort_order: 2 },
  { slug: "lemongrass-chicken-forbidden-rice", name: "Lemongrass Chicken, Forbidden Rice", tagline: "Endurance focus · Complex carbs", dietary_tags: ["endurance"], nutrition: { calories: 580, protein_g: 44, carbs_g: 58, fat_g: 14 }, sort_order: 3 },
  { slug: "white-bean-stew-herb-oil", name: "White Bean Stew, Herb Oil, Sourdough", tagline: "Plant-forward · High fiber", dietary_tags: ["vegetarian", "plant-forward"], nutrition: { calories: 480, protein_g: 22, carbs_g: 68, fat_g: 16 }, sort_order: 4 },
];

const supplements = [
  { slug: "creatine-monohydrate", name: "Creatine Monohydrate", category: "Performance", benefit_statement: "Supports strength and power output during resistance training.", serving_size: "5 g daily", requires_dshea_disclaimer: true, sort_order: 1 },
  { slug: "omega-3-epa-dha", name: "Omega-3 (EPA/DHA)", category: "Foundation", benefit_statement: "Supports cardiovascular and joint health as part of a balanced diet.", serving_size: "2 softgels daily", requires_dshea_disclaimer: true, sort_order: 2 },
  { slug: "magnesium-glycinate", name: "Magnesium Glycinate", category: "Recovery", benefit_statement: "Supports normal muscle function and restful sleep.", serving_size: "300 mg before bed", requires_dshea_disclaimer: true, sort_order: 3 },
  { slug: "vitamin-d3-k2", name: "Vitamin D3 + K2", category: "Foundation", benefit_statement: "Supports bone health and immune function.", serving_size: "1 capsule daily", requires_dshea_disclaimer: true, sort_order: 4 },
];

const trainingPlans = [
  { slug: "strength-progressive", name: "Strength", focus: "strength", level: "All levels", weeks: 12, sessions_per_week: 4, equipment: ["barbell", "dumbbells", "bands"], description: "Progressive overload programs built around your frequency and equipment. Tied directly to your protein and caloric targets.", sort_order: 1 },
  { slug: "endurance-build", name: "Endurance", focus: "conditioning", level: "All levels", weeks: 8, sessions_per_week: 5, equipment: ["track", "trail"], description: "Running, cycling, or rowing programs calibrated to your aerobic base. Nutrition synced to session duration and intensity.", sort_order: 2 },
  { slug: "hybrid-adaptive", name: "Hybrid", focus: "hybrid", level: "Intermediate+", weeks: 10, sessions_per_week: 4, equipment: ["full gym"], description: "A combined protocol for those who train across modalities. Balances recovery, fuel, and output across all sessions.", sort_order: 3 },
  { slug: "mobility-continuous", name: "Mobility", focus: "mobility", level: "All levels", weeks: 4, sessions_per_week: 4, equipment: ["mat", "bands"], description: "Structured mobility and movement-quality work — complements any other training type or stands alone.", sort_order: 4 },
];

async function upsert(table, rows) {
  const { error } = await db.from(table).upsert(rows.map(pub), { onConflict: "slug" });
  if (error) { console.error(`${table}:`, error.message); process.exit(1); }
  console.log(`✓ ${table}: ${rows.length} rows`);
}

await upsert("meal_kits", mealKits);
await upsert("supplements", supplements);
await upsert("training_plans", trainingPlans);
console.log("Seed complete.");
