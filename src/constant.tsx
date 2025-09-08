import { LocationProps, PropertyType } from "./types";

export const categories = [
    { title: "House", value: "house" },
    { title: "Land", value: "land" },
    { title: "Shop", value: "shop" },
    { title: "Office", value: "office" },
    { title: "Hotel", value: "hotel" },
  ];


export const topLocation = [
    { image: '/avatar.png', name: 'Idumata Lagos' },
    { image: '/avatar.png', name: 'Tanke Ilorin' },
    { image: '/avatar.png', name: 'Garki Abuja' },
    { image: '/avatar.png', name: 'Jimeta Yola' },
]

export const locations: LocationProps[] = [
    {   
        id: '01',
        distance: 2.5,
        address: 'from Srengseng, Kembangan, West Jakarta City, Jakarta 11630',
    },
    {   
        id: '02',
        distance: 3.2,
        address: 'from Kebon Jeruk, Jakarta 11530',
    },
    {   
        id: '03',
        distance: 5.0,
        address: 'from Tanah Abang, Central Jakarta 10250',
    },
    {
        id: '04',
        distance: 5.0,
        address: 'from Tanah Abang, Central Jakarta 10250',
    },
];

export const mockProperties: PropertyType[] = [
    {
      _id: "1",
      banner: "https://example.com/image1.jpg",
      title: "3 Bedroom Flat in Lekki",
      slug: "3-bedroom-flat-lekki",
      address: "Lekki Phase 1, Lagos, Nigeria",
      price: 2500000,
      listed_for: "rent",
      category: "house",
      period: "yearly",
      negotiable: true,
      property_terms: "6 months advance payment required",
      images: [
        "https://example.com/image1a.jpg",
        "https://example.com/image1b.jpg"
      ],
      agent: "agent_101",
      map_location: {
        type: "Point",
        coordinates: [3.4505, 6.4531]
      },
      features: [
        { name: "Bedroom", quantity: 3 },
        { name: "Bathroom", quantity: 2 },
        { name: "Kitchen", quantity: 1 }
      ],
      env_facilities: ["Swimming Pool", "24/7 Security", "Gym"],
      status: "available",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: "2",
      banner: "https://example.com/image2.jpg",
      title: "Luxury Office Space in Victoria Island",
      slug: "luxury-office-victoria-island",
      address: "Victoria Island, Lagos, Nigeria",
      price: 15000000,
      listed_for: "sell",
      category: "office",
      negotiable: false,
      images: [
        "https://example.com/image2a.jpg",
        "https://example.com/image2b.jpg"
      ],
      agent: "agent_102",
      map_location: {
        type: "Point",
        coordinates: [3.4035, 6.4281]
      },
      env_facilities: ["Elevator", "Underground Parking"],
      status: "available",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: "3",
      banner: "https://example.com/image3.jpg",
      title: "Self Contain in Yaba",
      slug: "self-contain-yaba",
      address: "Yaba, Lagos, Nigeria",
      price: 450000,
      listed_for: "rent",
      category: "apartment",
      period: "monthly",
      negotiable: true,
      images: [
        "https://example.com/image3a.jpg",
        "https://example.com/image3b.jpg"
      ],
      agent: "agent_103",
      status: "rented",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: "4",
      banner: "https://example.com/image4.jpg",
      title: "5 Plots of Land in Ajah",
      slug: "5-plots-land-ajah",
      address: "Ajah, Lagos, Nigeria",
      price: 30000000,
      listed_for: "sell",
      category: "land",
      negotiable: false,
      property_terms: "Outright purchase only",
      images: [
        "https://example.com/image4a.jpg"
      ],
      agent: "agent_104",
      status: "available",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: "5",
      banner: "https://example.com/image5.jpg",
      title: "Hotel for Sale in Ikeja",
      slug: "hotel-sale-ikeja",
      address: "Ikeja GRA, Lagos, Nigeria",
      price: 120000000,
      listed_for: "sell",
      category: "hotel",
      negotiable: true,
      images: [
        "https://example.com/image5a.jpg",
        "https://example.com/image5b.jpg"
      ],
      agent: "agent_105",
      env_facilities: ["Swimming Pool", "Parking Space", "Wi-Fi"],
      status: "available",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: "6",
      banner: "https://example.com/image6.jpg",
      title: "2 Bedroom Apartment in Surulere",
      slug: "2-bedroom-apartment-surulere",
      address: "Surulere, Lagos, Nigeria",
      price: 1800000,
      listed_for: "rent",
      category: "apartment",
      period: "yearly",
      negotiable: true,
      images: [
        "https://example.com/image6a.jpg"
      ],
      agent: "agent_106",
      status: "unavailable",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: "7",
      banner: "https://example.com/image7.jpg",
      title: "Commercial Shop in Oshodi",
      slug: "commercial-shop-oshodi",
      address: "Oshodi, Lagos, Nigeria",
      price: 500000,
      listed_for: "rent",
      category: "shop",
      period: "monthly",
      negotiable: false,
      images: [
        "https://example.com/image7a.jpg",
        "https://example.com/image7b.jpg"
      ],
      agent: "agent_107",
      env_facilities: ["Security", "Good Road Network"],
      status: "available",
      created_at: new Date(),
      updated_at: new Date()
    }
  ];
  

export const reviews = [
    {reviewer: '', image: '/avatar.png', rating: 5.0, comment: ''},
]

export const agents = [
    { id: 1, name: "Amanda", rating: 5.0, sold: 112, image: "/avatar.png" },
    { id: 2, name: "Anderson", rating: 4.9, sold: 112, image: "/avatar.png" },
    { id: 3, name: "Samantha", rating: 4.9, sold: 112, image: "/avatar.png" },
    { id: 4, name: "Andrew", rating: 4.9, sold: 112, image: "/avatar.png" },
    { id: 5, name: "Michael", rating: 4.9, sold: 112, image: "/avatar.png" },
    { id: 6, name: "Tobi", rating: 4.9, sold: 112, image: "/avatar.png" },
  ];

export const agent = {
    id: '01',
    name: "Amanda",
    email: "amanda.trust@email.com",
    rating: 5.0,
    reviews: 235,
    sold: 112,
    listing: 140,
    image: 'https://placehold.co/40',
    properties: [
        {
            id: '04pro',
            name: '2-Bedroom Flat', 
            image: '/cover-1.png', 
            rating: 2.9, 
            address: 'Ikorodu, Lagos', 
            price: 250,
            period: 'year',
            type: ""
        },
        {
            id: '02pro',
            name: '2-Bedroom Flat', 
            image: '/apartment.png', 
            rating: 2.9, 
            address: 'Ikorodu, Lagos', 
            price: 250,
            period: 'year',
            type: ""
        }
    ]
};


export const Reviews = [
    {
        id: '01',
        reviewer: "Ekenta Martins",
        image: "/avatar.png",
        ratings: 2.5,
        comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        reviewImages:[
            "/apartment.png",
            "/home/building3.png",
            "/home/building4.png",
            "/home/house-with-pool.png",
        ],
        reviewDate: "2025-01-01T03:04:20Z" // Example ISO 8601 date string

    },
    {
        id: '02',
        reviewer: "Yusuf Adisa",
        image: "/avatar.png",
        ratings: 5.0,
        comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        reviewImages:[
            "/home/house-with-pool.png",
            "/apartment.png",
            "/home/building3.png",
            "/home/building4.png",            
        ],
        reviewDate: "2025-01-01T03:04:20Z" // Example ISO 8601 date string
    },
    {
        id: '03',
        reviewer: "Aliyu Adam",
        image: "/avatar.png",
        ratings: 4.0,
        comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        reviewImages:[
            "/home/building3.png",
            "/apartment.png",
            "/home/house-with-pool.png",          
            "/home/building4.png",            
        ],
        reviewDate: "2024-01-01T10:04:20Z" // Example ISO 8601 date string

    },
]


export const styles = {
    H2: "font-semibold mt-10 mb-3",
    GREENBTN: "bg-green text-white px-5 py-4 rounded-lg",
    GRAYBUTTON: "card-bg px-5 py-4"
}