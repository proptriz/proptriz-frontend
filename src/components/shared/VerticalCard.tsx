import { CategoryEnum, CURRENCY_SYMBOL, CurrencyEnum, ListForEnum, RenewalEnum } from "@/types/property";
import formatPrice from "@/utils/formatPrice";
import { translateCategoryOptions, translateListedForOptions, translateRenewalOptions } from "@/utils/translate";
import { useLanguage } from "@/i18n/LanguageContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDistance = (distance?: string | number): string | null => {
  if (distance === undefined || distance === null) return null;
  const meters = typeof distance === "string" ? Number(distance) : distance;
  if (Number.isNaN(meters)) return null;
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`;
};

const LISTED_FOR_STYLES: Record<string, string> = {
  rent:       "text-[#1e5f74] border-[#b8dde8] bg-white",
  sale:       "text-[#143d4d] border-[#e0f0f5] bg-[#e0f0f5]",
  commercial: "text-[#c88400] border-[#fef3cd] bg-[#fef3cd]",
};

interface VerticalCardProps {
  id: string,
  image: string; // URL of the property image
  name: string; // Title of the property
  rating: number; // Rating of the property
  address: string; // Location of the property
  price: number; // Price per month
  currency: CurrencyEnum;
  category: CategoryEnum; // Property type (e.g., "Apartment")
  period: RenewalEnum;
  listed_for: ListForEnum;
  distance?: string;
  expired?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export const VerticalCard = ({
  id,
  image,
  name,
  rating,
  address,
  price,
  currency,
  category,
  period,
  listed_for,
  distance,
  expired,
}: VerticalCardProps) => {
  const { t } = useLanguage();

  const symbol    = CURRENCY_SYMBOL[currency as CurrencyEnum] ?? "";
  const distLabel = formatDistance(distance);
  const badgeStyle =
    LISTED_FOR_STYLES[listed_for?.toLowerCase() ?? ""] ??
    LISTED_FOR_STYLES.rent;

  return (
    <div
      key={id}
      className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden
                 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
    >
      {/* ── Image area ─────────────────────────────────────────────────────── */}
      <div
        className="relative h-36 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        {/* Gradient scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-t-2xl" />

        {/* Listed-for badge */}
        {listed_for && (
          <span
            className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-1
                        rounded-[6px] border-[1.5px] leading-none ${badgeStyle}`}
          >
            {translateListedForOptions(listed_for, t)}
          </span>
        )}

        {/* Expired badge */}
        {expired && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[9px]
                           font-bold px-1.5 py-0.5 rounded-md leading-none">
            {t("status_expired")}
          </span>
        )}

        {/* Bottom-left: rating + category */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1
                        bg-black/55 backdrop-blur-[2px] text-white
                        text-[10px] font-medium px-2 py-1 rounded-md leading-none">
          <span className="text-[#f0a500]">★</span>
          {rating} · {translateCategoryOptions(category, t)}
        </div>

        {/* Bottom-right: distance */}
        {distLabel && (
          <span className="absolute bottom-2 right-2 bg-[#1e5f74]/90 text-white
                           text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none">
            {distLabel}
          </span>
        )}
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="px-3 pt-2.5 pb-3">
        {/* Price row */}
        <div className="flex items-baseline gap-1">
          <span
            className={`text-[15px] font-extrabold ${
              expired ? "text-red-500" : "text-[#1e5f74]"
            }`}
          >
            {symbol}{formatPrice(price)}
          </span>
          {period && (
            <span className="text-[10px] text-[#9ca3af] font-normal">
              / {translateRenewalOptions(period , t)}
            </span>
          )}
        </div>

        {/* Name */}
        <p className="text-[12px] font-semibold text-[#111827] mt-0.5
                      truncate leading-snug">
          {name}
        </p>

        {/* Address */}
        <p className="text-[10px] text-[#9ca3af] mt-1 truncate flex items-center gap-1">
          <span>📍</span>
          {address}
        </p>
      </div>
    </div>
  );
};