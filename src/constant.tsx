export const topLocation = [
    { image: '/avatar.png', name: 'Idumata Lagos' },
    { image: '/avatar.png', name: 'Tanke Ilorin' },
    { image: '/avatar.png', name: 'Garki Abuja' },
    { image: '/avatar.png', name: 'Jimeta Yola' },
]

export const apartments = [
    {
        name: '3-Bedroom Apartment', 
        image: '/home/building1.png', 
        rating: 4.8, 
        address: 'Jimeta, Yola', 
        price: '10k',
        period: 'month',
        type: ""
    },
    {
        name: 'Self Contain', 
        image: '/home/building2.png', 
        rating: 5.0, 
        address: 'Alagbado, Ilorin', 
        price: '100k',
        period: 'year',
        type: ""
    },
    {
        name: 'Single Room', 
        image: '/apartment.png', 
        rating: 4.6, 
        address: 'Jimeta, Yola', 
        price: '250k',
        period: 'year',
        type: ""
    },
    {
        name: '2-Bedroom Flat', 
        image: '/cover-1.png', 
        rating: 2.9, 
        address: 'Ikorodu, Lagos', 
        price: '250k',
        period: 'year',
        type: ""
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
    name: "Amanda",
    email: "amanda.trust@email.com",
    rating: 5.0,
    reviews: 235,
    sold: 112,
    listings: [
    {
        id: 1,
        name: "Brookvale Villa",
        price: 320,
        location: "Jakarta, Indonesia",
        image: "/home/building1.png",
    },
    {
        id: 2,
        name: "The Overdale Apartment",
        price: 290,
        location: "Jakarta, Indonesia",
        image: "/home/building2.png",
    },
    ],
};