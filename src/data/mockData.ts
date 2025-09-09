import { PropertyType, AgentType, Profile } from '@/types/property';

// Mock Property Data
export const mockProperties: PropertyType[] = [
  {
    id: "1",
    title: "Luxury 3 Bedroom Apartment",
    price: 850000,
    priceType: "rent",
    location: "Lekki, Lagos",
    city: "Lagos",
    state: "Lagos",
    type: "house",
    bedrooms: 3,
    bathrooms: 2,
    beds: 3,
    baths: 2,
    area: 150,
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    agentId: "1",
    featured: true,
    forSale: false,
    forRent: true,
    description: "A beautiful 3 bedroom apartment in the heart of Lekki",
    amenities: ["Air Conditioning", "Swimming Pool", "24/7 Security"],
    latitude: 6.4698,
    longitude: 3.5852
  },
  {
    id: "2",
    title: "Modern Office Space",
    price: 120000000,
    priceType: "sale",
    location: "Victoria Island, Lagos",
    city: "Lagos",
    state: "Lagos",
    type: "office",
    area: 200,
    imageUrl: "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    agentId: "2",
    featured: false,
    forSale: true,
    forRent: false,
    description: "Modern office space in Victoria Island",
    amenities: ["Parking", "Security", "Power Backup"],
    latitude: 6.4281,
    longitude: 3.4267
  },
  {
    id: "3",
    title: "Commercial Space in Mall",
    price: 500000,
    priceType: "rent",
    location: "Wuse, Abuja",
    city: "Abuja",
    state: "FCT",
    type: "shop",
    area: 85,
    imageUrl: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    agentId: "3",
    featured: false,
    forSale: false,
    forRent: true,
    description: "Prime commercial space in popular mall",
    amenities: ["High foot traffic", "Security", "Power Backup"],
    latitude: 9.0765,
    longitude: 7.4912
  },
  {
    id: "4",
    title: "Premium Hotel Property",
    price: 450000000,
    priceType: "sale",
    location: "Ikeja, Lagos",
    city: "Lagos",
    state: "Lagos",
    type: "house", // Changed from 'hotel' to match allowed types
    bedrooms: 35,
    bathrooms: 40,
    beds: 35,
    baths: 40,
    area: 1200,
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    agentId: "1",
    featured: true,
    forSale: true,
    forRent: false,
    description: "Premium hotel property in Ikeja",
    amenities: ["Swimming Pool", "Restaurant", "Conference Rooms"],
    latitude: 6.6018,
    longitude: 3.3515
  },
  {
    id: "5",
    title: "Waterfront Land",
    price: 75000000,
    priceType: "sale",
    location: "Banana Island, Lagos",
    city: "Lagos",
    state: "Lagos",
    type: "land",
    area: 500,
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
    agentId: "2",
    featured: false,
    forSale: true,
    forRent: false,
    description: "Beautiful waterfront land in Lagos",
    amenities: ["Swimming Pool", "Garden", "Security"],
    latitude: 6.4698,
    longitude: 3.5852
  },
  {
    id: "6",
    title: "Cozy 2 Bedroom Flat",
    price: 550000,
    priceType: "rent",
    location: "Maitama, Abuja",
    city: "Abuja",
    state: "FCT",
    type: "house",
    bedrooms: 2,
    bathrooms: 1,
    beds: 2,
    baths: 1,
    area: 95,
    imageUrl: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    agentId: "3",
    featured: false,
    forSale: false,
    forRent: true,
    description: "Cozy 2 bedroom flat in Maitama",
    amenities: ["Air Conditioning", "Swimming Pool", "24/7 Security"],
    latitude: 9.0765,
    longitude: 7.4912
  },
  {
    id: "7",
    title: "Luxury Penthouse",
    price: 2500000,
    priceType: "rent",
    location: "Ikoyi, Lagos",
    city: "Lagos",
    state: "Lagos",
    type: "house",
    bedrooms: 4,
    bathrooms: 3,
    beds: 4,
    baths: 3,
    area: 300,
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80",
    agentId: "1",
    featured: true,
    forSale: false,
    forRent: true,
    description: "Luxury penthouse in Ikoyi",
    amenities: ["Air Conditioning", "Swimming Pool", "24/7 Security"],
    latitude: 6.4698,
    longitude: 3.5852
  },
  {
    id: "8",
    title: "Office Building",
    price: 950000000,
    priceType: "sale",
    location: "GRA, Port Harcourt",
    city: "Port Harcourt",
    state: "Rivers",
    type: "office",
    area: 1800,
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    agentId: "2",
    featured: true,
    forSale: true,
    forRent: false,
    description: "Office building in GRA, Port Harcourt",
    amenities: ["Parking", "Security", "Power Backup"],
    latitude: 6.4698,
    longitude: 3.5852
  }
];

// Mock Agent Data
export const mockAgents: AgentType[] = [
  {
    id: "1",
    name: "Adebayo Johnson",
    title: "Senior Property Consultant",
    email: "adebayo@propertyhub.ng",
    phone: "+234 800 123 4567",
    location: "Lagos",
    rating: 4.8,
    propertiesCount: 32,
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    featured: true
  },
  {
    id: "2",
    name: "Chioma Okafor",
    title: "Commercial Property Specialist",
    email: "chioma@propertyhub.ng",
    phone: "+234 800 987 6543",
    location: "Abuja",
    rating: 4.5,
    propertiesCount: 24,
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
  },
  {
    id: "3",
    name: "Emmanuel Nwachukwu",
    title: "Luxury Real Estate Agent",
    email: "emmanuel@propertyhub.ng",
    phone: "+234 800 456 7890",
    location: "Port Harcourt",
    rating: 4.9,
    propertiesCount: 18,
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    featured: true
  },
  {
    id: "4",
    name: "Folake Adeleke",
    title: "Residential Property Expert",
    email: "folake@propertyhub.ng",
    phone: "+234 800 222 3333",
    location: "Ibadan",
    rating: 4.6,
    propertiesCount: 15,
    imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
  }
];

export const mockProfile: Profile[] =[
  {
    id: "1",
    updated_at: "2023-10-01T12:00:00Z",
    username: "adebayo_johnson",
    full_name: "Adebayo Johnson",
    avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    email: "adebayo@gmail.com",
    phone: "+234 800 123 4567",
    is_agent: true
  },
  {
    id: "2",
    updated_at: "2023-10-01T12:00:00Z",
    username: "chioma_okafor",
    full_name: "Chioma Okafor",
    avatar_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    email: "chioma@gmail.com",
    phone: "+12345",
    is_agent: false
  }
]

// Get properties by agent ID
export const getAgentProperties = (agentId: string): PropertyType[] => {
  return mockProperties.filter(property => property.agentId === agentId);
};

// Get agent by ID
export const getAgentById = (id: string): AgentType | undefined => {
  return mockAgents.find(agent => agent.id === id);
};

// Get property by ID
export const getPropertyById = (id: string): PropertyType | undefined => {
  return mockProperties.find(property => property.id === id);
};

// Get featured properties
export const getFeaturedProperties = (): PropertyType[] => {
  return mockProperties.filter(property => property.featured);
};

// Get featured agents
export const getFeaturedAgents = (): AgentType[] => {
  return mockAgents.filter(agent => agent.featured);
};

// Get profile by ID
export const getProfileById = (id: string): Profile | undefined => {
  return mockProfile.find(user => user.id === id);
};
