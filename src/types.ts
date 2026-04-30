import { PropertyType } from "./types/property";

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