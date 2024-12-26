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

// export cont agent = {
//     name: "Amanda",
//     email: "amanda.trust@email.com",
//     rating: 5.0,
//     reviews: 235,
//     sold: 112,
//     listings: 