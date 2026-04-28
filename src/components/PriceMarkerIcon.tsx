import { CURRENCY_SYMBOL, CurrencyEnum } from "@/types/property";
import L from "leaflet";

// ─── Brand color system ───────────────────────────────────────────────────────
//   Rent → teal  (#1e5f74)  — matches the app's primary brand color
//   Sale → gold  (#f0a500)  — matches the app's accent color
//
//   Selected state: white outer ring, scale-up, intensified shadow

type PriceMarkerOptions = {
  price:      number;
  currency?:  CurrencyEnum;      // e.g. "₦" "$" "£" "€"
  listedFor:  "rent" | "sale";
  isSelected?: boolean;
};

// ─── Color tokens ─────────────────────────────────────────────────────────────

const COLORS = {
  rent: {
    bg:        "#1e5f74",
    bgHover:   "#143d4d",
    text:      "#ffffff",
    shadow:    "rgba(30,95,116,0.45)",
    ring:      "rgba(30,95,116,0.3)",
    dot:       "#a8d8e8",
  },
  sale: {
    bg:        "#f0a500",
    bgHover:   "#c88400",
    text:      "#143d4d",
    shadow:    "rgba(240,165,0,0.45)",
    ring:      "rgba(240,165,0,0.3)",
    dot:       "#fff8e1",
  },
} as const;

// ─── Price formatter ──────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  if (price >= 1_000_000_000_000) return (price / 1_000_000_000_000).toFixed(1) + "T";
  if (price >= 1_000_000_000)     return (price / 1_000_000_000).toFixed(1) + "B";
  if (price >= 1_000_000)         return (price / 1_000_000).toFixed(1) + "M";
  if (price >= 1_000)             return (price / 1_000).toFixed(1) + "K";
  return String(price);
}

// ─── Icon factory ─────────────────────────────────────────────────────────────

export function createPriceIcon({
  price,
  currency   = CurrencyEnum.ngn,
  listedFor,
  isSelected = false,
}: PriceMarkerOptions): L.DivIcon {
  const c             = COLORS[listedFor];
  const label         = CURRENCY_SYMBOL[currency] + formatPrice(price);
  const charCount     = label.length;

  // Dynamically size the pill so long labels never truncate
  const pillW         = Math.max(64, charCount * 9 + 20); // px
  const pillH         = 30;                               // px
  const tailH         = 10;                               // px — teardrop point
  const totalH        = pillH + tailH;

  // Selected: white outline ring + stronger shadow
  const ringStyle = isSelected
    ? `box-shadow:0 0 0 3px white,0 6px 20px ${c.shadow};transform:scale(1.12);`
    : `box-shadow:0 3px 10px ${c.shadow};`;

  const fontSize = charCount > 8 ? "10px" : charCount > 6 ? "11px" : "12px";

  // The "tail" is a CSS triangle pointing downward, same background color
  const html = `
<div style="
  position:relative;
  display:inline-flex;
  flex-direction:column;
  align-items:center;
  cursor:pointer;
  filter:${isSelected ? "drop-shadow(0 8px 16px " + c.shadow + ")" : "drop-shadow(0 3px 8px " + c.shadow + ")"};
  transition:transform 0.15s ease,filter 0.15s ease;
">
  <!-- Pill bubble -->
  <div style="
    display:flex;
    align-items:center;
    justify-content:center;
    gap:3px;
    width:${pillW}px;
    height:${pillH}px;
    background:${c.bg};
    border-radius:${pillH / 2}px;
    color:${c.text};
    font-family:'Raleway',sans-serif;
    font-size:${fontSize};
    font-weight:800;
    letter-spacing:-0.01em;
    white-space:nowrap;
    position:relative;
    ${ringStyle}
    transition:transform 0.15s ease,box-shadow 0.15s ease;
  ">
    <!-- Rent/sale dot indicator -->
    <span style="
      width:5px;
      height:5px;
      border-radius:50%;
      background:${c.dot};
      opacity:0.85;
      flex-shrink:0;
    "></span>
    ${label}
  </div>

  <!-- Teardrop tail -->
  <div style="
    width:0;
    height:0;
    border-left:${tailH - 2}px solid transparent;
    border-right:${tailH - 2}px solid transparent;
    border-top:${tailH}px solid ${c.bg};
    margin-top:-1px;
    filter:none;
  "></div>
</div>
`;

  // iconSize must cover the full pin including the tail
  return L.divIcon({
    className: "",        // intentionally blank — no Leaflet default styles
    html,
    iconSize:   [pillW, totalH],
    iconAnchor: [pillW / 2, totalH],  // anchor at the very tip of the tail
    popupAnchor:[0, -(totalH + 4)],   // popup appears just above the pin
  });
}

// ─── CSS to inject once (add to your global stylesheet or call once on mount) ──
//
//  .leaflet-div-icon { background:none!important; border:none!important; }
//
//  This prevents Leaflet's default white-square div icon background from
//  showing through behind the custom pin shape.