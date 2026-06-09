import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Menu, X } from "lucide-react";

interface NavProps {
  dark?: boolean;
}

const links = [
  { path: "/how", label: "How It Fits" },
  { path: "/meal-kits", label: "Meal Kits" },
  { path: "/supplements", label: "Supplements" },
  { path: "/training", label: "Training" },
  { path: "/pricing", label: "Pricing" },
  { path: "/about", label: "About" },
];

export function Nav({ dark = false }: NavProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const fg = dark ? "#F5F2EB" : "#101114";
  const bg = dark ? "#101114" : "#F5F2EB";
  const bd = dark ? "rgba(245,242,235,0.1)" : "rgba(16,17,20,0.1)";

  const btnBase: React.CSSProperties = {
    background: "none", border: "none", cursor: "pointer", padding: 0,
    fontFamily: "Archivo, sans-serif", transition: "all 0.15s",
  };

  const go = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpen(false);
  };

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: bg, borderBottom: `1px solid ${bd}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => go("/")} style={{ ...btnBase, display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 600, color: fg, letterSpacing: "-0.02em" }}>Fits You</span>
          <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: "#B79256", textTransform: "uppercase" }}>®</span>
        </button>

        <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="hidden md:flex">
          {links.map(l => {
            const active = pathname === l.path;
            return (
              <button
                key={l.path}
                onClick={() => go(l.path)}
                style={{ ...btnBase, fontSize: 13, fontWeight: 500, letterSpacing: "0.04em", color: active ? "#D9603B" : fg, opacity: active ? 1 : 0.65 }}
              >
                {l.label}
              </button>
            );
          })}
          <button
            onClick={() => go("/plan")}
            style={{ ...btnBase, background: "#101114", color: "#F5F2EB", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 20px", borderRadius: 4 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#D9603B"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#101114"; }}
          >
            Build Your Plan
          </button>
        </div>

        <button className="flex md:hidden" onClick={() => setOpen(!open)} style={{ ...btnBase, color: fg, padding: 4 }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden" style={{ background: bg, borderTop: `1px solid ${bd}`, padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
          {links.map(l => (
            <button key={l.path} onClick={() => go(l.path)} style={{ ...btnBase, fontSize: 15, fontWeight: 500, color: pathname === l.path ? "#D9603B" : fg, textAlign: "left" }}>
              {l.label}
            </button>
          ))}
          <button onClick={() => go("/plan")} style={{ ...btnBase, alignSelf: "flex-start", background: "#101114", color: "#F5F2EB", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "12px 22px", borderRadius: 4 }}>
            Build Your Plan
          </button>
        </div>
      )}
    </nav>
  );
}
