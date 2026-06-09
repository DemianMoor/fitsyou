import React from "react";

interface FitMarkProps {
  size?: number;
  children?: React.ReactNode;
  className?: string;
  padded?: boolean;
  dark?: boolean;
}

export function FitMark({ size = 24, children, className = "", padded = true, dark = false }: FitMarkProps) {
  const color = "#B79256";
  const arm = Math.round(size * 0.55);
  const gap = padded ? Math.round(size * 0.7) : 0;

  if (!children) {
    return (
      <span
        className={`inline-block relative ${className}`}
        style={{ width: size, height: size }}
        aria-hidden
      >
        <span style={{ position: "absolute", top: 0, left: 0, width: arm, height: 1, background: color }} />
        <span style={{ position: "absolute", top: 0, left: 0, width: 1, height: arm, background: color }} />
        <span style={{ position: "absolute", top: 0, right: 0, width: arm, height: 1, background: color }} />
        <span style={{ position: "absolute", top: 0, right: 0, width: 1, height: arm, background: color }} />
        <span style={{ position: "absolute", bottom: 0, left: 0, width: arm, height: 1, background: color }} />
        <span style={{ position: "absolute", bottom: 0, left: 0, width: 1, height: arm, background: color }} />
        <span style={{ position: "absolute", bottom: 0, right: 0, width: arm, height: 1, background: color }} />
        <span style={{ position: "absolute", bottom: 0, right: 0, width: 1, height: arm, background: color }} />
      </span>
    );
  }

  return (
    <div className={`relative inline-block ${className}`} style={{ padding: gap }}>
      <span style={{ position: "absolute", top: 0, left: 0, width: size, height: 1, background: color }} />
      <span style={{ position: "absolute", top: 0, left: 0, width: 1, height: size, background: color }} />
      <span style={{ position: "absolute", top: 0, right: 0, width: size, height: 1, background: color }} />
      <span style={{ position: "absolute", top: 0, right: 0, width: 1, height: size, background: color }} />
      <span style={{ position: "absolute", bottom: 0, left: 0, width: size, height: 1, background: color }} />
      <span style={{ position: "absolute", bottom: 0, left: 0, width: 1, height: size, background: color }} />
      <span style={{ position: "absolute", bottom: 0, right: 0, width: size, height: 1, background: color }} />
      <span style={{ position: "absolute", bottom: 0, right: 0, width: 1, height: size, background: color }} />
      {children}
    </div>
  );
}
