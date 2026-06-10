// One-off: generate the Fits You marketing image slots via the Gemini image API,
// then crop/optimize each to its exact target dimensions with sharp.
//
// Usage:  node scripts/gen-images.mjs            (generates every slot)
//         node scripts/gen-images.mjs meal-kits  (one or more slot keys)
//
// Reads GEMINI_API_KEY from .env.local (gitignored). The raw key never leaves disk.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// ── load key from .env.local ────────────────────────────────────────────────
function loadKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  const envPath = path.resolve(".env.local");
  if (fs.existsSync(envPath)) {
    const line = fs.readFileSync(envPath, "utf8").split(/\r?\n/).find(l => l.startsWith("GEMINI_API_KEY="));
    if (line) return line.slice("GEMINI_API_KEY=".length).trim().replace(/^["']|["']$/g, "");
  }
  return null;
}
const API_KEY = loadKey();
if (!API_KEY) { console.error("No GEMINI_API_KEY in env or .env.local"); process.exit(1); }

const BASE = "https://generativelanguage.googleapis.com/v1beta";
const PUB = "public/images";

// Most Gemini API keys (incl. "AIza…" and "AQ.…") authenticate via ?key= ;
// only OAuth access tokens ("ya29.…") use an Authorization: Bearer header.
const USE_BEARER = API_KEY.startsWith("ya29.");
const authQuery = () => (USE_BEARER ? "" : `?key=${API_KEY}`);
const authHeaders = (h = {}) => (USE_BEARER ? { ...h, Authorization: `Bearer ${API_KEY}` } : h);

// ── brand recipe shared by every prompt ─────────────────────────────────────
const FOOD = "Premium editorial fine-dining food photography. Deep near-black obsidian (#101114) background with subtle pine-green (#2F3A30) tones, dramatic single-source side light with soft falloff and real shadows, warm appetizing tones, subtle steam and natural gloss, brass (#B79256) catchlights, generous negative space, shot ~50mm at f/2.8. No text, no logos, no white background, no bright fast-casual look.";
const PEOPLE = "Editorial photography of a strong, capable, confident adult — mature, diverse, premium athletic wear, natural directional light, moody dark backdrop with pine-green tones, cinematic, never grinning stock. No text, no logos.";

// genRatio = closest ratio the API supports; w/h = exact final crop.
const SLOTS = {
  "editorial-band": { out: "home/editorial-band.jpg", w: 2000, h: 760, genRatio: "16:9",
    prompt: `${FOOD} A beautifully plated fine-dining dish on the RIGHT third; the LEFT half is deep obsidian negative space (text overlays there). Cinematic ultra-wide composition.` },
  "meal-kits": { out: "home/meal-kits.jpg", w: 900, h: 1200, genRatio: "3:4",
    prompt: `${FOOD} A dark ceramic bowl of a vibrant macro-balanced meal — grains, roasted vegetables, lean protein — with a few fresh raw ingredients beside it to signal a meal kit. Vertical composition.` },
  "supplements-card": { out: "home/supplements.jpg", w: 900, h: 1200, genRatio: "3:4",
    prompt: `${FOOD} A curated arrangement of premium supplement capsules and a matte amber/dark glass bottle. Clinical-calm but warm. Vertical composition.` },
  "supplements-hero": { out: "supplements/hero.jpg", w: 1000, h: 1000, genRatio: "1:1",
    prompt: `${FOOD} A single premium supplement bottle and a small precise scatter of capsules. Clinical-calm, restrained, lots of negative space. Square composition.` },
  "training-card": { out: "home/training.jpg", w: 900, h: 1200, genRatio: "3:4",
    prompt: `${PEOPLE} Mid-training, controlled effort, real sweat, in a dark moody gym. Vertical composition.` },
  "training-hero": { out: "training/hero.jpg", w: 1000, h: 1250, genRatio: "3:4",
    prompt: `${PEOPLE} Mid-training with a kettlebell or barbell, controlled power, dark studio. Vertical composition.` },
  "about-team": { out: "about/team.jpg", w: 1400, h: 1200, genRatio: "4:3",
    prompt: `Editorial photo of a small professional team of registered dietitians and coaches collaborating in a warm, natural-lit modern workspace. Engaged, capable, diverse, premium-casual, documentary feel, muted warm palette. No text, no posed grins.` },
  "og-default": { out: "og-default.jpg", w: 1200, h: 630, genRatio: "16:9",
    prompt: `${FOOD} A single hero-quality plated dish on the right two-thirds; left third clean obsidian negative space for an overlaid logo. Wide social-card composition.` },
};

// ── discover an available image model on this key ───────────────────────────
async function pickModel() {
  const res = await fetch(`${BASE}/models${authQuery() ? authQuery() + "&" : "?"}pageSize=100`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`models list failed: ${res.status} ${await res.text()}`);
  const { models = [] } = await res.json();
  const names = models.map(m => m.name.replace("models/", ""));
  // Prefer Imagen (true aspectRatio control), then Gemini flash image.
  const prefer = [
    n => /^imagen-4/.test(n), n => /^imagen-3/.test(n),
    n => /gemini.*image/.test(n),
  ];
  for (const test of prefer) { const hit = names.find(test); if (hit) return hit; }
  throw new Error(`No image model on this key. Available: ${names.join(", ")}`);
}

// ── call the right endpoint for the chosen model, return a Buffer ───────────
async function generate(model, prompt, genRatio) {
  if (model.startsWith("imagen")) {
    const res = await fetch(`${BASE}/models/${model}:predict${authQuery()}`, {
      method: "POST", headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ instances: [{ prompt }], parameters: { sampleCount: 1, aspectRatio: genRatio } }),
    });
    if (!res.ok) throw new Error(`predict ${res.status}: ${await res.text()}`);
    const json = await res.json();
    const b64 = json?.predictions?.[0]?.bytesBase64Encoded;
    if (!b64) throw new Error(`no image in response: ${JSON.stringify(json).slice(0, 300)}`);
    return Buffer.from(b64, "base64");
  }
  // gemini *-image via generateContent (inline image part)
  const res = await fetch(`${BASE}/models/${model}:generateContent${authQuery()}`, {
    method: "POST", headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ contents: [{ parts: [{ text: `${prompt} Aspect ratio ${genRatio}.` }] }] }),
  });
  if (!res.ok) throw new Error(`generateContent ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const part = json?.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data);
  if (!part) throw new Error(`no image in response: ${JSON.stringify(json).slice(0, 300)}`);
  return Buffer.from(part.inlineData.data, "base64");
}

// ── main ────────────────────────────────────────────────────────────────────
const want = process.argv.slice(2);
const keys = want.length ? want : Object.keys(SLOTS);

const model = await pickModel();
console.log(`Using model: ${model}\n`);

for (const key of keys) {
  const s = SLOTS[key];
  if (!s) { console.error(`! unknown slot "${key}"`); continue; }
  const dst = path.join(PUB, s.out);
  try {
    process.stdout.write(`${key.padEnd(18)} generating… `);
    const raw = await generate(model, s.prompt, s.genRatio);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    await sharp(raw)
      .resize(s.w, s.h, { fit: "cover", position: "attention" })
      .jpeg({ quality: 82, progressive: true, mozjpeg: true })
      .toFile(dst);
    const kb = Math.round(fs.statSync(dst).size / 1024);
    console.log(`→ ${s.out}  ${s.w}x${s.h}  ${kb}KB`);
  } catch (e) {
    console.log(`FAILED: ${e.message}`);
  }
}
