export interface AuthUserType {
  _id: string;
  display_name: string;
  avatar?: string;
  primary_email?: string;
  role: "user" | "admin";
  last_login_at?: Date
  createdAt?: Date;
  updatedAt?: Date
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
  distance?: string;
  expired?: boolean
}

export type ReviewType = {
  _id: string;
  sender: Pick<AuthUserType, '_id' | 'display_name' | 'avatar'>;
  comment: string;
  rating: number;
  property: Pick<PropertyType, 'title' | 'banner' | 'address' | 'average_rating'>;
  createdAt?: Date;
  image?: string;
  reply_count?: number;
}

export type CursorResponse<T> = {
  items: T;
  nextCursor: string | null;
};


export enum RatingScaleEnum {
  DESPAIR = 0,
  SAD = 2,
  OKAY = 3,
  HAPPY = 4,
  DELIGHT = 5
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
  user_id: string;
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
  dollar="USD",
  pound = "GBP",
  euro = "EUR",
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
  weekly = "weekly"
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

export interface Landmark {
  id:       string;
  name:     string;
  lat:      number;
  lng:      number;
  category: LandmarkCategory;
}

export type LandmarkCategory =
  | "school" | "hospital" | "market"  | "transport"
  | "mall"   | "bank"     | "restaurant" | "park"
  | "place_of_worship"    | "other";

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

export type PaymentDataType = {
  amount: number;
  memo: string;
  metadata: {
  }
};

export interface ApiSuccess<T> {
  success: true;
  data:    T;
  count?:  number;
}