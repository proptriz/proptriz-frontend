import { Translations } from "@/i18n/translations";
import { UserSettingsType } from "@/types";

export enum CategoryEnum {
  house = "house",
  shortlet="shortlet",
  hotel = "hotel",
  office = "office",
  land = "land",
  shop = "shop",
  others = "others"
}

export const TRANS_CATEGORIES: {
  labelKey: keyof Translations;
  value:    CategoryEnum;
  icon:     string;
}[] = [
  { labelKey: "cat_apartment", value: CategoryEnum.house,    icon: "🏠" },
  { labelKey: "cat_land",      value: CategoryEnum.land,     icon: "🏘️" },
  { labelKey: "cat_shortlet",  value: CategoryEnum.shortlet, icon: "🌙" },
  { labelKey: "cat_hotel",     value: CategoryEnum.hotel,    icon: "🏨" },
  { labelKey: "cat_shop",      value: CategoryEnum.shop,     icon: "🏪" },
  { labelKey: "cat_office",    value: CategoryEnum.office,   icon: "🏢" },
  { labelKey: "cat_others",    value: CategoryEnum.others,   icon: "•••" },
];

export enum ListForEnum {
  rent = "rent",
  sale = "sale",
}

export enum CurrencyEnum {
  ngn = "NGN",
  usd ="USD",
  kes = "KES",
  cfa = "CFA",
  cdf = "CDF",
  pi = "Pi"
}

export const CURRENCY_SYMBOL: Record<CurrencyEnum, string> = {
  [CurrencyEnum.ngn]:   "₦",
  [CurrencyEnum.usd]: "$",
  [CurrencyEnum.kes]: "KSh",
  [CurrencyEnum.cfa]: "FCFA",
  [CurrencyEnum.cdf]: "CDF",
  [CurrencyEnum.pi]: "Pi"
};

export enum RenewalEnum {
  monthly = "monthly",
  yearly = "yearly",
  daily = "daily",
  weekly = "weekly"
}

export const RENEWAL_ENUM_TRANSLATIONS: Record<RenewalEnum, string> = {
  [RenewalEnum.monthly]: "Monthly",
  [RenewalEnum.yearly]: "Yearly",
  [RenewalEnum.daily]: "Daily",
  [RenewalEnum.weekly]: "Weekly"
};

export enum PropertyStatusEnum {
  available = "available",
  sold = "sold",
  rented = "rented",
  unavailable = "unavailable",
  expired = "expired",
}

export enum NegotiableEnum {
  Negotiable = "negotiable",
  NonNegotiable = "non-negotiable",
}

export interface PropertyFormData {
  title: string;
  description: string;
  address: string;
  price: string;
  currency: CurrencyEnum;
  listedFor: ListForEnum;
  category: CategoryEnum;
  status: PropertyStatusEnum;
  renewPeriod: RenewalEnum;
  negotiable: NegotiableEnum;
  duration: number;
  features: string[];
  coordinates: [number, number];
  photos: File[];
  /** Nigeria postcode typed by the agent (optional). Sent as `postcode_input`. */
  postcodeInput?: string;
}

/** Public view of a listing's NIPOST postcode. The full code comes from /property/:id/postcode. */
export interface PropertyPostcode {
  public_code?: string; // LA-11-U34-••-••
  verified?: boolean;
  confidence?: "high" | "medium" | "low";
}

/** State / LGA / area names for the pin (any country). NG: region = state, subregion = LGA. */
export interface PropertyPlace {
  country_name?: string;
  region?: string;
  subregion?: string;
  area?: string;
  verified?: boolean;
}

export interface PropertyType {
  _id: string;
  banner: string; // URL of the property image or image with index = 0
  title: string; // Title of the property (e.g. 3 bedroom flat, self contain, )
  slug: string;
  address: string; // Location of the property
  price: number; // Price per month
  currency: CurrencyEnum; // Currency type (e.g. NGN, USD, GBP)
  listed_for: ListForEnum; // (e.g. "sell"/ "rent")
  category: CategoryEnum; // The class of property (e.g. house, land, shop, office, hotel )
  period?: RenewalEnum; // if is for rent, payment period (e.g monthly, yearly, daily)
  negotiable: boolean; // (true/false)
  description?: string // agent's term cond
  duration?: number;
  expired_by?: Date;
  images: string[]; //Other property images for gallery
  user: UserSettingsType;
  latitude: number;
  longitude: number;
  features?: string[];
  distance?: string;
  average_rating?: number;
  review_count?: number;
  landmarks?: any[];
  status: PropertyStatusEnum; // (available, sold, unavailable, rented)
  country?: string; // ISO 3166-1 alpha-2 of the pin
  postcode?: PropertyPostcode; // NIPOST postcode (Nigeria only)
  place?: PropertyPlace; // state / LGA / area names for the pin
  match_tier?: "area" | "district" | "subregion" | "region" | "distance";
  createdAt?: Date;
  updatedAt?: Date;
};

export interface PropertyFilterPayload {
  location?: {
    query: string;
    lat: number;
    lng: number;
    name: string;
    lga?: string;
    state?: string;
  };
  propertyType: CategoryEnum;
  listedFor: "all" | "sale" | "rent";
  priceMin: number | null;
  priceMax: number | null;
  description?: string;
  /** A postcode prefix (Nigeria) or named place chosen from the suggestions. */
  place?: PlaceFilter;
  /** When the chosen place has no listings, fall back to the next wider level. */
  widen?: boolean;
}

export type PlaceTier = "area" | "district" | "subregion" | "region";

export type PlaceFilter =
  | { kind: "postcode"; code: string; tier: PlaceTier; label: string; country: "NG" }
  | { kind: "place"; country: string; region?: string; subregion?: string; area?: string; tier: PlaceTier; label: string };

/** The `applied` object returned by GET /property/all, as query params for the next page. */
export const appliedPlaceParams = (applied?: Record<string, string | undefined | null>): Record<string, string> =>
  Object.fromEntries(Object.entries(applied ?? {}).filter((e): e is [string, string] => typeof e[1] === "string" && e[1] !== ""));

/** Query params for GET /property/all that correspond to a PlaceFilter. */
export const placeFilterParams = (place?: PlaceFilter, widen = true): Record<string, string> => {
  if (!place) return {};
  const out: Record<string, string> = widen ? { widen: "1" } : {};
  if (place.kind === "postcode") return { ...out, postcode: place.code };
  out.place_country = place.country;
  if (place.region) out.place_region = place.region;
  if (place.subregion) out.place_subregion = place.subregion;
  if (place.area) out.place_area = place.area;
  return out;
};


export type WizardStep = 1 | 2 | 3;

// ─── African bounding box with padding ────────────────────────────────────────
export const AFRICAN_BOUNDS: L.LatLngBoundsExpression = [
  [-40, -25], // SW
  [43, 60],   // NE
];

// All 54 African countries (ISO 3166-1 alpha-2).
// Passed to Nominatim's countrycodes param to restrict results to the continent.

export const AFRICA_COUNTRY_CODES =
  "dz,ao,bj,bw,bf,bi,cm,cv,cf,td,km,cd,cg,ci,dj,eg,gq,er,sz,et," +
  "ga,gm,gh,gn,gw,ke,ls,lr,ly,mg,mw,ml,mr,mu,yt,ma,mz,na,ne,ng," +
  "rw,re,sh,st,sn,sl,so,za,ss,sd,tz,tg,tn,ug,eh,zm,zw";

// Africa bounding box for Nominatim viewbox (west, north, east, south).
// Keeps bounded=1 so results never escape the continent.
export const AFRICA_VIEWBOX = "-17.5,37.5,51.5,-35.0";