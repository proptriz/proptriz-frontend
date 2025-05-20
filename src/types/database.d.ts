


export interface Agent {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  company_name: string;
  description: string;
  license_number: string;
  experience_years: number;
  specializations: string[];
  areas_served: string[];
  average_rating: number;
  profile: Profile;
}

export interface Property {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  type: 'house' | 'apartment' | 'land' | 'office' | 'shop';
  price: number;
  location: string;
  city: string;
  state: string;
  beds: number | null;
  baths: number | null;
  area: number | null;
  image_url: string;
  featured: boolean;
  for_sale: boolean;
  for_rent: boolean;
  description: string;
  amenities: string[];
  agent_id: string;
  latitude: number;
  longitude: number;
}

export interface Inquiry {
  id: string;
  created_at: string;
  user_id: string;
  property_id: string;
  agent_id: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  property: Property;
  user: Profile;
}
