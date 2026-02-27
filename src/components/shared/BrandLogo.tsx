import Image from "next/image";
import Link from "next/link";

// ─── Brand palette ────────────────────────────────────────────────────────────
// Teal dark:#143d4d  Teal:#1e5f74  Gold:#f0a500
// ─────────────────────────────────────────────────────────────────────────────

/**
 * BrandLogo — unified logo component used across all screens.
 *
 * Variants:
 *  • "mark"      — circular logo mark only (no wordmark). Use in tight spaces.
 *  • "full"      — logo mark + "PropTriz" wordmark side-by-side. Use in headers.
 *  • "stacked"   — logo mark above wordmark + tagline. Use on splash / auth screens.
 *
 * Theme:
 *  • "light"     — white wordmark (for use on teal / dark backgrounds)
 *  • "dark"      — dark teal wordmark (for use on white / light backgrounds)
 *
 * linkTo:
 *  • If provided, wraps the logo in a Next.js <Link>. Pass "/" for the home link.
 *  • If omitted, renders as a plain <div> (useful inside headings or popups).
 */

interface BrandLogoProps {
  /** Visual layout variant */
  variant?: "mark" | "full" | "stacked";
  /** Color theme — matches the background it sits on */
  theme?: "light" | "dark";
  /** Diameter of the logo circle in px */
  size?: number;
  /** If set, wraps the whole component in a Next.js Link */
  linkTo?: string;
  /** Optional extra className on the outer wrapper */
  className?: string;
}

export function BrandLogo({
  variant = "full",
  theme = "light",
  size = 36,
  linkTo,
  className = "",
}: BrandLogoProps) {
  const wordmarkColor  = theme === "light" ? "white"    : "#143d4d";
  const accentColor    = "#f0a500";                // gold — always the same
  const taglineColor   = theme === "light" ? "rgba(255,255,255,0.65)" : "#9ca3af";

  // ── Logo mark circle ────────────────────────────────────────────────────────
  const Mark = () => (
    <div
      style={{
        width:  size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        // Gold glow halo that works on both light and dark backgrounds
        boxShadow: "0 2px 10px rgba(240,165,0,0.45), 0 0 0 2px rgba(240,165,0,0.18)",
        background: "white",          // fallback if image fails to load
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        src="/logo.png"
        alt="PropTriz"
        width={size}
        height={size}
        priority                     // always eager — it's a brand element
        style={{ objectFit: "cover", width: size, height: size }}
      />
    </div>
  );

  // ── Wordmark text ───────────────────────────────────────────────────────────
  const Wordmark = ({ fontSize }: { fontSize: number }) => (
    <span
      style={{
        fontFamily: "'Raleway', sans-serif",
        fontSize,
        fontWeight: 900,
        color: wordmarkColor,
        letterSpacing: "-0.02em",
        lineHeight: 1,
      }}
    >
      <span style={{ color: accentColor }}>Prop</span>Triz
    </span>
  );

  // ── Variant layouts ─────────────────────────────────────────────────────────
  const Inner = () => {
    if (variant === "mark") {
      return <Mark />;
    }

    if (variant === "full") {
      // Side-by-side: mark + wordmark
      return (
        <div style={{ display: "flex", alignItems: "center", gap: size * 0.28 }}>
          <Mark />
          <Wordmark fontSize={Math.round(size * 0.5)} />
        </div>
      );
    }

    // variant === "stacked" — mark centered above wordmark + tagline
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: size * 0.2 }}>
        <Mark />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <Wordmark fontSize={Math.round(size * 0.32)} />
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: Math.round(size * 0.155),
              color: taglineColor,
              letterSpacing: "0.01em",
              lineHeight: 1,
            }}
          >
            Discover trusted properties
          </span>
        </div>
      </div>
    );
  };

  // ── Wrapper: Link or div ────────────────────────────────────────────────────
  if (linkTo) {
    return (
      <Link
        href={linkTo}
        aria-label="PropTriz Home"
        className={className}
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        <Inner />
      </Link>
    );
  }

  return (
    <div
      className={className}
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      <Inner />
    </div>
  );
}

export default BrandLogo;
