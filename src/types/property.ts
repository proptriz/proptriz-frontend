export enum CategoryEnum {
  house = "house",
  shortlet="shortlet",
  hotel = "hotel",
  office = "office",
  land = "land",
  shop = "shop",
  others = "others"
}

export enum ListForEnum {
  rent = "rent",
  sale = "sale",
}

export enum CurrencyEnum {
  naira = "₦",
  dollars = "$",
  euros = "€",
  pounds = "£",
}

export enum RenewalEnum {
  weekly = "weekly",
  monthly = "monthly",
  yearly = "yearly",
}

export enum PropertyStatusEnum {
  available = "available",
  reserved = "reserved",
  taken = "taken",
  expired = "expired",
}

export enum NegotiableEnum {
  Negotiable = "negotiable",
  NonNegotiable = "non-negotiable",
}

export interface Feature {
  name: string;
  quantity: number;
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
  features: Feature[];
  facilities: string[];
  coordinates: [number, number];
  photos: File[];
}

export type WizardStep = 1 | 2 | 3;
