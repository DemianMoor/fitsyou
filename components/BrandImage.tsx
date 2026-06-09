"use client";

import Image from "next/image";
import { useState } from "react";
import { FitMark } from "@/components/FitMark";

/**
 * next/image wrapper with a graceful brand fallback (replaces the old
 * ImageWithFallback onError behavior). When `src` is missing or fails to load
 * — e.g. before the operator has produced an asset, or a catalog row has no
 * image yet — it renders a tasteful obsidian placeholder with the Fit Mark
 * instead of a broken image. Always use inside a positioned, sized container
 * (the `fill` pattern); pass `priority` for the LCP/hero image only.
 */
export function BrandImage({
  src,
  alt,
  fill = true,
  width,
  height,
  sizes,
  priority = false,
  style,
  className,
  placeholderLabel,
}: {
  src?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  style?: React.CSSProperties;
  className?: string;
  placeholderLabel?: string;
}) {
  const [errored, setErrored] = useState(false);
  const showImage = !!src && !errored;

  if (!showImage) {
    const box: React.CSSProperties = fill
      ? { position: "absolute", inset: 0 }
      : { width: width ?? "100%", height: height ?? "100%" };
    return (
      <div
        role="img"
        aria-label={alt}
        style={{ ...box, background: "#101114", display: "flex", alignItems: "center", justifyContent: "center", ...style }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: 0.5 }}>
          <FitMark size={20} />
          <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#B79256" }}>
            {placeholderLabel ?? "Image coming"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src as string}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      style={style}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}
