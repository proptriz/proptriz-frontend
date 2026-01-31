export interface AuthUserType {
  pi_uid: string;
  username: string;
  membership: {class:string, balance:number};
};

export interface IUser {
  _id: string;
  username: string; // unique identifyer
  pi_uid: string; // hashed user password
  brand?: string; // User Legal Name (e.g. Tony Adeola Ezenwa) (optional)
  image?: string; // URL to user profile pics (optional)
  email?: string; // for notification
  phone?: string; // user phone number (optional)
  provider?: string; // URLs of reviewer upload (optional)
};

export interface AgentProps { 
  id: string, 
  name: string, 
  rating: number, 
  sold: number, 
  image: string,
  reviews: number, 
  email: string,
  listing: number,
  properties?: PropertyProps[]
}

export interface PropertyProps {
  id: string,
  image: string; // URL of the property image
  name: string; // Title of the property
  rating: number; // Rating of the property
  address: string; // Location of the property
  price: number; // Price per month
  currency: CurrencyEnum;
  category: CategoryEnum; // Property type (e.g., "Apartment")
  period: string;
  listed_for: string;
  expired?: boolean
}

export type ReviewType = {
  id: string;
  reviewer: string;
  text: string;
  ratings: number;
  image: string;
  review_date: string; // ISO 8601 date string
  review_images?: string[];
  replies_count?: number;
}

export interface LocationProps {
  id: string;
  distance: number;
  address: string;
}

export interface UserType {
  _id: string;
  username: string; // 
  password: string; // Foreing key referencing property under review
  fullname?: string; // User Legal Name (e.g. Tony Adeola Ezenwa)
  image?: string; // URL to user profile pics (optional)
  email?: string; // for notification    
  phone?: string; // URLs of reviewer upload (optional)
  created_at: Date; // (auto)
};

export enum UserTypeEnum {
  Individual = 'individual',
  Company = 'company',
  Agent = 'agent',
}

export interface UserSettingsType {
  _id?: string;
  username: string; // 
  user_type: UserTypeEnum;
  brand?: string; // User Legal Name (e.g. Tony Adeola Ezenwa)
  image?: string; // URL to user profile pics (optional)
  email?: string; // for notification    
  phone?: string; // URLs of reviewer upload (optional)
  whatsapp?: string; // User whatsapp number
  social_handles?: {platform: string; handle: string}[]; // e.g [{platform: 'facebook', handle: 'fb.com/username'}]
};

export enum CurrencyEnum {
  naira = "NGN",
  dollars="USD",
  pounds = "GBP",
  euros = "EUR",
}

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
  sale = "sale"
}

export enum RenewalEnum {
  monthly = "monthly",
  yearly = "yearly",
  daily = "daily",
  weekely = "weekly"
}

export enum NegotiableEnum {
  Negotiable = "negotiable",
  NonNegotiable = "Non-negotiable",
}

export enum PropertyStatusEnum {
  available = "available",
  sold = "sold",
  rented = "rented",
  unavailable = "unavailable",
  expired = "expired",
}

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

export interface PropertyType {
  id: string;
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
  user: UserSettingsType; //foreign key representing agent that list the property
  latitude: number;
  longitude: number;
  features?: {
    name: string;
    quantity: number;
  }[];
  env_facilities?: string[];
  rating?: number;
  status: PropertyStatusEnum; // (available, sold, unavailable, rented)
  createdAt?: Date;
  updatedAt?: Date;
};

export interface Feature {
  name: string;
  quantity: number;
}

export interface AgentType { 
  id: string;
  user: string; //foreign key 
  brand_name: string; // User Legal Name (e.g. Tony Adeola Ezenwa)
  image: string; // URL to user profile pics (optional)
  fulfillment_terms: string;
  beacame_agent_date: Date; // (auto)
  modified_at: Date;
  address: string;
  map_location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  status: string; // (available, unavilable)
  social_handles: {}[];
};

export interface PropertyReviewType {
  id: string;
  rating: number; // Rating score (0.0 to 5.0)
  comment?: string; // user review text (optional)
  review_giver: string; // Foreing key referencing userId
  property: string; // Foreing key referencing property under review
  images?: string[]; // URLs of reviewer upload (optional)
  review_date: Date; // (auto)
};

export interface AgentReviewType {
  id: string;
  rating: number; // Rating score (0.0 to 5.0)
  comment?: string; // user review text (optional)
  review_giver: string; // Foreing key referencing userId
  review_receiver: string; // Foreing key referencing property under review
  images?: string[]; // URLs of reviewer upload (optional)
  review_date: Date; // (auto)
};

export interface LandmarkType {
  id: string;
  title: string // what the landmark is called
  property: string; // Foreing key referencing property
  image?: string,
  distance: number; // how far from referenced property (in km)
  position_description: string, // derived from LocationProps
  map_location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  created_at: Date;
  updated_at: Date
}

export type PaymentDataType = {
  amount: number;
  memo: string;
  metadata: {
  }
};