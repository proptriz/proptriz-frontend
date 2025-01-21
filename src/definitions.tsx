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
    type: string; // Property type (e.g., "Apartment")
    period: string
  }

  export interface ReviewCardProps {
    id: string;
    reviewer: string;
    text: string;
    ratings: number;
    image: string;
    reviewImages?: string[];
    reviewDate: string; // ISO 8601 date string
  }

  export interface LocationProps {
    id: string;
    distance: number;
    address: string;
  }

  export interface LandmarkProps {
    id: string,
    property_id: string; // Referencing property
    image: string,
    distance: number; // how far from referenced property (in km)
    location: string, // derived from LocationProps
  }

  export interface CompleteAgentProps { 
    id: string
    fullname: string; // User Legal Name (e.g. Tony Adeola Ezenwa)
    image: string; // URL to user profile pics (optional)
    email: string; // for notification
    username: string; // 
    password: string; // Foreing key referencing property under review
    phone: string; // URLs of reviewer upload (optional)
    signup_date: Date; // (auto)
    map_location: {
      type: 'Point';
      coordinates: [number, number];
    };
    social_links?: string[]; // Agent social handles to share his listing Ads
    status: string; // (available, unavilable)
  }

  interface Feature {
    name: string;
    quantity: number;
  }

  export interface CompletePropertyProps {
    id: string,
    banner: string; // URL of the property image or image with index = 0
    title: string; // Title of the property (e.g. 3 bedroom flat, self contain, )
    address: string; // Location of the property
    price: number; // Price per month
    listed_for: string; // (e.g. "sell"/ "rent")
    category: string; // The class of property (e.g. house, land, shop, office, hotel )
    period?: string; // if is for rent, payment period (e.g monthly, yearly, daily)
    negotiable: boolean; // (true/false)
    images: string[]; //Other property images for gallery
    agentId: string; //foreign key representing agent that list the property
    map_location: {
      type: 'Point';
      coordinates: [number, number];
    };
    features?: Feature;
    env_falities?: string[];
    status: string; // (available, sold, unavailable, rented)
  };

  export interface PropertyReview {
    id: string
    rating: number; // Rating score (0.0 to 5.0)
    comment?: string; // user review text (optional)
    reviewer_id: string; // Foreing key referencing userId
    property_id: string; // Foreing key referencing property under review
    review_images?: string; // URLs of reviewer upload (optional)
    review_date: Date; // (auto)
  };

  export interface AgentReview {
    id: string
    rating: number; // Rating score (0.0 to 5.0)
    comment?: string; // user review text (optional)
    reviewer_id: string; // Foreing key referencing userId
    agent_id: string; // Foreing key referencing agent under review
    review_images?: string; // URLs of reviewer upload (optional)
    review_date: Date; // (auto)
  }

  export interface UserProfile {
    id: string
    fullname?: string; // User Legal Name (e.g. Tony Adeola Ezenwa)
    image?: string; // URL to user profile pics (optional)
    email?: string; // for notification
    username: string; // 
    password: string; // Foreing key referencing property under review
    phone?: string; // URLs of reviewer upload (optional)
    signup_date: Date; // (auto)
  }