import Link from "next/link";
import { CURRENCY_SYMBOL, CurrencyEnum, PropertyType } from "@/types/property";
import formatPrice from "@/utils/formatPrice";

// ─── category data ─────────────────────────────────────────────────

const CATEGORY_ICON: Record<string, string> = {
  house:    "🏠",
  shortlet: "🛎️",
  hotel:    "🏨",
  office:   "🏢",
  land:     "🏘️",
  shop:     "🏪",
  others:   "🏗️",
};

// ─── Listed-for color system  (matches createPriceIcon tokens) ────────────────
//   Rent → teal   Sale → gold/amber

const LISTED_FOR_CONFIG = {
  rent: {
    bg:   "#e0f0f5",
    text: "#1e5f74",
    dot:  "#1e5f74",
    label:"For Rent",
    icon: "🔑",
  },
  sale: {
    bg:   "#fef3c7",
    text: "#92400e",
    dot:  "#f0a500",
    label:"For Sale",
    icon: "🏷️",
  },
} as const;

// ─── Star renderer (compact inline SVG) ──────────────────────────────────────

function StarRating({ value }: { value: number }) {
  const filled = Math.min(5, Math.round(value));
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="9" height="9" viewBox="0 0 10 10" fill="none">
          <path
            d="M5 1l1.03 2.09L8.5 3.44l-1.75 1.7.41 2.4L5 6.25l-2.16 1.3.41-2.4L1.5 3.44l2.47-.35L5 1z"
            fill={i <= filled ? "#f0a500" : "#e5e7eb"}
          />
        </svg>
      ))}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

const MapMarkerPopup = ({ property }: { property: PropertyType }) => {
  const imageUrl =
    property.banner?.trim() ? property.banner : "/logo.png";

  const symbol     = CURRENCY_SYMBOL[property.currency] ?? "₦";
  const rating     = property.average_rating ?? 5.0;
  const catIcon    = CATEGORY_ICON[property.category] ?? "🏠";
  const lf         = (property.listed_for === "rent" ? "rent" : "sale") as "rent" | "sale";
  const lfConfig   = LISTED_FOR_CONFIG[lf];
  const isRent     = lf === "rent";

  return (
    // Leaflet strips most styles — use inline only
    <div
      style={{
        position:     "relative",
        width:        272,
        background:   "#ffffff",
        borderRadius: 16,
        overflow:     "hidden",
        boxShadow:
          "0 8px 30px rgba(20,61,77,0.18)," +
          "0 2px 8px rgba(0,0,0,0.08)," +
          "0 0 0 1px rgba(30,95,116,0.07)",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >

      {/* ── TOP SECTION: horizontal image + core info ──────────────────── */}
      <div style={{ display: "flex", height: 100 }}>

        {/* Left: square image strip */}
        <div
          style={{
            position:           "relative",
            width:              100,
            flexShrink:         0,
            backgroundImage:    `url(${imageUrl})`,
            backgroundSize:     "cover",
            backgroundPosition: "center",
            backgroundColor:    "#e0f0f5",
          }}
        >
          {/* Listed-for pill overlaid on image */}
          <div
            style={{
              position:     "absolute",
              top:          7,
              left:         7,
              display:      "flex",
              alignItems:   "center",
              gap:          3,
              padding:      "2px 7px 2px 5px",
              borderRadius: 99,
              background:   lfConfig.bg,
              color:        lfConfig.text,
              fontSize:     9,
              fontWeight:   800,
              letterSpacing:"0.03em",
              lineHeight:   "14px",
              border:       `1px solid ${isRent ? "rgba(30,95,116,0.18)" : "rgba(240,165,0,0.3)"}`,
              backdropFilter:"blur(4px)",
              WebkitBackdropFilter:"blur(4px)",
            }}
          >
            <span
              style={{
                width:        5,
                height:       5,
                borderRadius: "50%",
                background:   lfConfig.dot,
                display:      "inline-block",
                flexShrink:   0,
              }}
            />
            {lfConfig.label}
          </div>

          {/* Category + rating strip at bottom of image */}
          <div
            style={{
              position:       "absolute",
              bottom:         0,
              left:           0,
              right:          0,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              padding:        "4px 6px",
              background:     "linear-gradient(to top, rgba(0,0,0,0.62) 0%, transparent 100%)",
            }}
          >
            <span style={{ fontSize: 12 }}>{catIcon}</span>
            <span
              style={{
                fontSize:   9,
                fontWeight: 700,
                color:      "white",
                textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                display:    "flex",
                alignItems: "center",
                gap:        2,
              }}
            >
              <StarRating value={rating} />
              {rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Right: price + title + address */}
        <div
          style={{
            flex:        1,
            minWidth:    0,
            display:     "flex",
            flexDirection:"column",
            justifyContent:"space-between",
            padding:     "10px 12px",
            background:  "#ffffff",
          }}
        >
          {/* Price */}
          <div>
            <div
              style={{
                display:     "flex",
                alignItems:  "baseline",
                gap:         3,
                flexWrap:    "nowrap",
              }}
            >
              <span
                style={{
                  fontSize:    18,
                  fontWeight:  900,
                  color:       isRent ? "#1e5f74" : "#92400e",
                  lineHeight:  1,
                  fontFamily:  "'Raleway',sans-serif",
                  letterSpacing:"-0.02em",
                  whiteSpace:  "nowrap",
                }}
              >
                {symbol}{formatPrice(property.price)}
              </span>
              {property.period && (
                <span style={{ fontSize: 9, color: "#9ca3af", fontWeight: 500, flexShrink: 0 }}>
                  /{property.period}
                </span>
              )}
            </div>

            {/* Negotiable tag */}
            {property.negotiable && (
              <span
                style={{
                  display:      "inline-block",
                  marginTop:    3,
                  fontSize:     8,
                  fontWeight:   800,
                  color:        "#c88400",
                  background:   "#fef3c7",
                  border:       "1px solid rgba(240,165,0,0.25)",
                  padding:      "1px 5px",
                  borderRadius: 99,
                  letterSpacing:"0.04em",
                  textTransform:"uppercase",
                }}
              >
                Negotiable
              </span>
            )}
          </div>

          {/* Title */}
          <p
            style={{
              margin:       0,
              fontSize:     11,
              fontWeight:   700,
              color:        "#111827",
              lineHeight:   1.35,
              overflow:     "hidden",
              display:      "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {property.title}
          </p>

          {/* Address */}
          <p
            style={{
              margin:       0,
              fontSize:     10,
              color:        "#9ca3af",
              lineHeight:   1.3,
              overflow:     "hidden",
              whiteSpace:   "nowrap",
              textOverflow: "ellipsis",
              display:      "flex",
              alignItems:   "center",
              gap:          2,
            }}
          >
            <span style={{ fontSize: 9, flexShrink: 0 }}>📍</span>
            {property.address}
          </p>
        </div>
      </div>

      {/* ── DIVIDER ─────────────────────────────────────────────────────── */}
      <div
        style={{
          height:     1,
          background: "linear-gradient(to right,transparent,#e5e7eb 20%,#e5e7eb 80%,transparent)",
        }}
      />

      {/* ── BOTTOM: CTA bar ──────────────────────────────────────────────── */}
      <div
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "9px 12px",
          background:     "#fafafa",
          gap:            8,
        }}
      >
        {/* Category label */}
        <span
          style={{
            fontSize:    10,
            fontWeight:  600,
            color:       "#6b7280",
            textTransform:"capitalize",
            display:     "flex",
            alignItems:  "center",
            gap:         4,
          }}
        >
          {catIcon} {property.category}
        </span>

        {/* View Details CTA */}
        <Link href={`/property/details/${property._id}`} style={{ textDecoration: "none" }}>
          <button
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            5,
              padding:        "6px 14px",
              borderRadius:   10,
              background:     "linear-gradient(135deg,#143d4d,#1e5f74)",
              color:          "white",
              fontSize:       11,
              fontWeight:     800,
              border:         "none",
              cursor:         "pointer",
              letterSpacing:  "0.01em",
              fontFamily:     "'Raleway',sans-serif",
              whiteSpace:     "nowrap",
              boxShadow:      "0 3px 10px rgba(30,95,116,0.35)",
              transition:     "all 0.18s ease",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget;
              b.style.boxShadow  = "0 5px 16px rgba(30,95,116,0.5)";
              b.style.transform  = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget;
              b.style.boxShadow  = "0 3px 10px rgba(30,95,116,0.35)";
              b.style.transform  = "translateY(0)";
            }}
          >
            View
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path
                d="M2 5.5h7M6.5 2.5l3 3-3 3"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </Link>
      </div>

      {/* ── Tooltip arrow pointer ──────────────────────────────────────── */}
      <div
        style={{
          display:        "flex",
          justifyContent: "center",
          marginTop:      -1,
        }}
      >
        <div
          style={{
            width:       0,
            height:      0,
            borderLeft:  "9px solid transparent",
            borderRight: "9px solid transparent",
            borderTop:   "9px solid #fafafa",
            filter:      "drop-shadow(0 3px 4px rgba(20,61,77,0.1))",
          }}
        />
      </div>
    </div>
  );
};

export default MapMarkerPopup;