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
  cda = "CDA",
  pi = "Pi"
}

export const CURRENCY_SYMBOL: Record<CurrencyEnum, string> = {
  [CurrencyEnum.ngn]:   "₦",
  [CurrencyEnum.usd]: "$",
  [CurrencyEnum.kes]: "KSh",
  [CurrencyEnum.cfa]: "FCFA",
  [CurrencyEnum.cda]: "CDA",
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
}

export interface PropertyType {
  _id: string;
  banner: string; // URL of the property image or image with index = 0
  title: string; // Title of the property (e.g. 3 bedroom flat, self contain, )
  slug: string;
  address: string; // Location of the property
  price: number; // Price per month
  currency: CurrencyEnum; // Currency type (e.g. NGN, USD, GBP)
  listed_for: string; // (e.g. "sell"/ "rent")
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
}


export type WizardStep = 1 | 2 | 3;

// ─── African bounding box with padding ────────────────────────────────────────
export const AFRICAN_BOUNDS: L.LatLngBoundsExpression = [
  [-40, -25], // SW
  [43, 60],   // NE
];