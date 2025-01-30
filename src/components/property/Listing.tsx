
import Image from "next/image";
import React from "react";
import HorizontalCard from "../shared/HorizontalCard";
import Link from "next/link";
import { PropertyType } from "@/definitions";

interface PropertyListingProps {
    properties: PropertyType[];
  }
  
  const PropertyListing: React.FC<PropertyListingProps> = ({ properties }) => {
    const topLocation = [
        { image: '/avatar.png', name: 'Idumata Lagos' },
        { image: '/avatar.png', name: 'Tanke Ilorin' },
        { image: '/avatar.png', name: 'Garki Abuja' },
        { image: '/avatar.png', name: 'Jimeta Yola' },
    ]

    const apartments = [
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

  return (
    <div className="relative mt-14">
        {/* Explore Nearby Property */}
        <section className="px-4 mb-10">
            <h2 className="text-lg font-semibold">Explore Nearby Property</h2>
            <div className="grid grid-cols-2 gap-4 mt-4">
                
                {properties.map(((info, key)=>(
                    <Link href={'/property/details'} key={key}>
                        <div className="bg-white p-3 rounded-2xl  shadow-md">
                            <div className="w-full bg-cover bg-center h-48 rounded-xl relative" style={{ backgroundImage: `url(${info.banner})`}}>
                                <div className="absolute bottom-2 right-2 bg-gray-700 text-white font-bold p-1 rounded-xl">
                                    N{info.price}
                                    <span className="text-xs">{info.period}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-md font-semibold my-2">{info.title}</p>
                                <div className="flex space-x-2">
                                    <span className="text-yellow-500">★</span>
                                    <span className="text-gray-500 text-sm">{5.0}</span>
                                    <p className="text-gray-500 text-sm">{info.address}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                )))}
            </div>
            <Link href={'/property/list'}>
            <button className="mt-4 text-green">View all properties</button>
            </Link>
            
        </section>

        {/* Featured Estates */}
        <section className="px-4 mb-10">
            <h2 className="text-lg font-semibold">Featured Properties</h2>
            <div className="flex space-x-4 mt-4 overflow-x-auto">

                {/* Card */}
                {apartments.slice(0,3).map(((info, key)=>(
                    <HorizontalCard 
                        id={''}
                        name={info.name} 
                        price={30} 
                        type="" 
                        address={info.address} 
                        image={info.image} 
                        period={info.period} 
                        rating={info.rating}
                        key={key}
                    />
                )))}
            </div>
        </section>

        {/* Top Locations */}
        <section className="px-4 mb-10">
            <h2 className="text-lg font-semibold">Top Locations</h2>
            <div className="flex mt-4 overflow-x-auto space-x-6">
                
                {topLocation.map(((location, key)=>(
                    <Link href={'/location/list'} key={key}>
                        <div className="flex items-center bg-[#DCDFD9] space-x-2 rounded-full p-2" key={key}>
                            <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center ">
                                <Image src={location.image} width={14} height={14} alt={'image button'} className="w-full h-full object-cover rounded-full"/>
                            </div>
                            <p className="text-sm no-wrap">{location.name}</p>
                        </div>
                    </Link>
                )))}
            </div>
            <Link href={'/location/list'}>
            <button className="mt-4 text-green">More locations</button>
            </Link>
        </section>

        {/* Promotions */}
        <div className="px-4 mb-10">
            <div className="flex space-x-4">
                <div className="w-1/2 bg-cover bg-center h-40 rounded-xl relative" style={{ backgroundImage: "url('/cover-1.png')" }}>
                    <div className="absolute bottom-2 left-2 text-white font-bold">
                    Halloween Sale! <br />
                    <span className="text-xs">Up to 66%</span>
                    </div>
                </div>
                <div className="w-1/2 bg-cover bg-center h-40 rounded-xl relative" style={{ backgroundImage: "url('/apartment.png')" }}>
                    <div className="absolute bottom-2 left-2 text-white font-bold">
                    Summer Vacation <br />
                    <span className="text-xs">Discounts await</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Estate Agents */}
        <section className="px-4 mb-10">
            <h2 className="text-lg font-semibold">Top Estate Agents</h2>
            <div className="overflow-x-auto text-sm text-center text-gray-500">
                <div className="flex space-x-8">
                    <div>
                        <div className="bg-white w-20 h-20 rounded-full p-1 mt-4">
                            <img
                                src="https://placehold.co/40"
                                alt="profile"
                                className="rounded-full w-full h-full object-cover"
                            />                    
                        </div>
                        <p className="mt-1">Mr. Yusuf</p>
                    </div>                
                    <div>
                        <div className="bg-white w-20 h-20 rounded-full p-1 mt-4">
                            <img
                                src="https://placehold.co/40"
                                alt="profile"
                                className="rounded-full w-full h-full object-cover"
                            />                    
                        </div>
                        <p className="mt-1">Mrs. Oladosu</p>
                    </div>
                    <div>
                        <div className="bg-white w-20 h-20 rounded-full p-1 mt-4">
                            <img
                                src="https://placehold.co/40"
                                alt="profile"
                                className="rounded-full w-full h-full object-cover"
                            />                    
                        </div>
                        <p className="mt-1">Engr. Kola</p>
                    </div>
                    <div>
                        <div className="bg-white w-20 h-20 rounded-full p-1 mt-4">
                            <img
                                src="https://placehold.co/40"
                                alt="profile"
                                className="rounded-full w-full h-full object-cover"
                            />                    
                        </div>
                        <p className="mt-1">Engr. Kola</p>
                    </div>
                </div>
            </div>
            <Link href={'/agent/list'}>
            <button className="mt-4 text-green">View all agents</button>
            </Link>            
        </section>
    </div>
  );
}

export default PropertyListing;
