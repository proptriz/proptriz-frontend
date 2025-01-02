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
    image: string,
    location: string, // derived from LocationProps
  }