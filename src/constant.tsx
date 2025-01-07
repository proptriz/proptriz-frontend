import { LocationProps } from "./definitions";

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

export const apartments = [
    {
        id: '01pro',
        name: '3-Bedroom Apartment', 
        image: '/home/building1.png', 
        rating: 4.8, 
        address: 'Jimeta, Yola', 
        price: 10,
        period: 'month',
        type: "",
        // agent: agent,
    },
    {
        id: '02pro',
        name: 'Self Contain', 
        image: '/home/building2.png', 
        rating: 5.0, 
        address: 'Alagbado, Ilorin', 
        price: 100,
        period: 'year',
        type: "",
        // agent: agent,
    },
    {
        id: '03pro',
        name: 'Single Room', 
        image: '/apartment.png', 
        rating: 4.6, 
        address: 'Jimeta, Yola', 
        price: 250,
        period: 'year',
        type: "",
        // agent: agent,
    },
    {
        id: '04pro',
        name: '2-Bedroom Flat', 
        image: '/cover-1.png', 
        rating: 2.9, 
        address: 'Ikorodu, Lagos', 
        price: 250,
        period: 'year',
        type: "",
        // agent: agent,
    },
]

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
    GREENBTN: "bg-green",
    GRAYBUTTON: "card-bg"
}