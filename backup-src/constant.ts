import { ListForEnum, LocationProps, CategoryEnum } from "./types";

export const categories: { title: string; value: CategoryEnum }[] =
    Object.entries(CategoryEnum)
        .filter(([key]) => isNaN(Number(key)))
        .map(([key, value]) => ({
            title: key.charAt(0).toUpperCase() + key.slice(1),
            value: value as CategoryEnum,
        }));


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
          category: "",
          listed_for:ListForEnum.rent
        },
        {
          id: '02pro',
          name: '2-Bedroom Flat', 
          image: '/apartment.png', 
          rating: 2.9, 
          address: 'Ikorodu, Lagos', 
          price: 250,
          period: 'year',
          category: "",
          listed_for:ListForEnum.rent
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
    H2: "mt-4 mb-1 border-gray-300",
    GREENBTN: "bg-green text-white px-5 py-4 rounded-lg",
    GRAYBUTTON: "card-bg px-5 py-4"
}

// export const mockProperties: PropertyType[] = [
//     {
//       id: "1",
//       banner: "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//       title: "3 Bedroom Flat in Lekki",
//       slug: "3-bedroom-flat-lekki",
//       address: "Lekki Phase 1, Lagos, Nigeria",
//       price: 2500000,
//       currency: CurrencyEnum.naira,
//       listed_for: ListForEnum.rent,
//       category: CategoryEnum.house,
//       period: RenewalEnum.yearly,
//       negotiable: true,
//       property_terms: "6 months advance payment required",
//       images: [
//         "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
//         "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//       ],
//       user: {username: "agent_101", _id:"", pi_uid: ""},
//       latitude: 6.4531,
//       longitude: 3.4505,
//       features: [
//         { name: "Bedroom", quantity: 3 },
//         { name: "Bathroom", quantity: 2 },
//         { name: "Kitchen", quantity: 1 }
//       ],
//       env_facilities: ["Swimming Pool", "24/7 Security", "Gym"],
//       rating: 4.0,
//       status: "available",
//       created_at: new Date(),
//       updated_at: new Date()
//     },
//     {
//       id: "2",
//       banner: "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//       title: "Luxury Office Space in Victoria Island",
//       slug: "luxury-office-victoria-island",
//       address: "Victoria Island, Lagos, Nigeria",
//       price: 15000000,
//       currency: CurrencyEnum.naira,
//       listed_for: ListForEnum.sale,
//       category: CategoryEnum.office,
//       negotiable: false,
//       images: [
//         "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//         "https://images.unsplash.com/photo-1604014237800-1c9102c219da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//       ],
//       user: {username: "agent_102", _id:"", pi_uid: ""},
//       latitude: 6.4531,
//       longitude: 3.4505,
//       env_facilities: ["Elevator", "Underground Parking"],
//       status: "available",
//       created_at: new Date(),
//       updated_at: new Date()
//     },
//     {
//       id: "3",
//       banner: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//       title: "Self Contain in Yaba",
//       slug: "self-contain-yaba",
//       address: "Yaba, Lagos, Nigeria",
//       price: 450000,
//       currency: CurrencyEnum.naira,
//       listed_for: ListForEnum.rent,
//       category: CategoryEnum.shop,
//       period: RenewalEnum.monthly,
//       negotiable: true,
//       latitude: 6.4331,
//       longitude: 3.7505,
//       images: [
//         "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//         "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
//       ],
//       user: {username: "agent_103", _id:"", pi_uid: ""},
//       status: "rented",
//       created_at: new Date(),
//       updated_at: new Date()
//     },
//     {
//       id: "4",
//       banner: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//       title: "5 Plots of Land in Ajah",
//       slug: "5-plots-land-ajah",
//       address: "Ajah, Lagos, Nigeria",
//       price: 30000000,
//       listed_for: ListForEnum.sale,
//       category: CategoryEnum.land,
//       negotiable: false,
//       latitude: 6.1531,
//       longitude: 3.2305,
//       property_terms: "Outright purchase only",
//       images: [
//         "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
//       ],
//       user: {username: "agent_104", _id:"", pi_uid: ""},
//       status: "available",
//       created_at: new Date(),
//       updated_at: new Date()
//     },
//     {
//       id: "5",
//       banner: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80",
//       title: "Hotel for Sale in Ikeja",
//       slug: "hotel-sale-ikeja",
//       address: "Ikeja GRA, Lagos, Nigeria",
//       price: 120000000,
//       listed_for: ListForEnum.sale,
//       category: CategoryEnum.hotel,
//       negotiable: true,
//       latitude: 6.4631,
//       longitude: 3.3505,
//       images: [
//         "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//         "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80",
//       ],
//       user: {username: "agent_105", _id:"", pi_uid: ""},
//       env_facilities: ["Swimming Pool", "Parking Space", "Wi-Fi"],
//       status: "available",
//       created_at: new Date(),
//       updated_at: new Date()
//     },
//     {
//       id: "6",
//       banner: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//       title: "2 Bedroom Apartment in Surulere",
//       slug: "2-bedroom-apartment-surulere",
//       address: "Surulere, Lagos, Nigeria",
//       price: 1800000,
//       listed_for: ListForEnum.sale,
//       category: CategoryEnum.house,
//       period: RenewalEnum.monthly,
//       negotiable: true,
//       latitude: 6.6531,
//       longitude: 3.6505,
//       images: [
//         "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//       ],
//       user: {username: "agent_106", _id:"", pi_uid: ""},
//       status: "unavailable",
//       created_at: new Date(),
//       updated_at: new Date()
//     },
//     {
//       id: "7",
//       banner: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//       title: "Commercial Shop in Oshodi",
//       slug: "commercial-shop-oshodi",
//       address: "Oshodi, Lagos, Nigeria",
//       price: 500000,
//       listed_for: ListForEnum.rent,
//       category: CategoryEnum.shop,
//       period: RenewalEnum.yearly,
//       negotiable: false,
//       latitude: 6.4531,
//       longitude: 3.4505,
//       images: [
//         "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//         "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//       ],
//       user: {username: "agent_107", _id:"", pi_uid: ""},
//       env_facilities: ["Security", "Good Road Network"],
//       status: "available",
//       created_at: new Date(),
//       updated_at: new Date()
//     }
//   ];
  