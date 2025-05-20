
export interface PropertyType {
  id: string;
  title: string;
  type: 'house' | 'apartment' | 'land' | 'office' | 'shop' | 'hotel';
  price: number;
  location: string;
  city: string;
  state: string;
  beds?: number;
  baths?: number;
  area?: number;
  imageUrl: string;
  featured: boolean;
  forSale: boolean;
  forRent: boolean;
  description: string;
  amenities: string[];
  agentId: string;
  latitude: number;
  longitude: number;
  // Add additional fields used in PropertyDetail
  bedrooms?: number;
  bathrooms?: number;
  priceType?: 'sale' | 'rent';
  // Add features field
  features?: PropertyFeature[];
  // Add support for multiple images
  imageUrls?: string[];
}

export interface PropertyFeature {
  name: string;
  quantity: number;
}

export interface AgentType {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  rating: number;
  propertiesCount: number;
  imageUrl: string;
  featured?: boolean;
}

export interface ReviewType {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  userAvatar?: string;
}

export interface Profile {
  id: string;
  updated_at: string;
  username: string;
  full_name: string;
  avatar_url: string;
  email: string;
  phone: string;
  is_agent: boolean;
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