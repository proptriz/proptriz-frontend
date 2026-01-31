'use client';

import Image from "next/image";
import React from "react";
import HorizontalCard from "../shared/HorizontalCard";
import Link from "next/link";
import { PropertyType } from "@/types";
import { VerticalCard } from "../shared/VerticalCard";

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

  return (
  <div className="relative">
    {/* Explore Nearby Property */}
    <section className="px-4 mb-10">
      <h2 className="text-lg font-semibold">Explore Nearby Property</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
                
        {properties.map(((property, key)=>(
          <Link href={`/property/details/${property.id}?slug=${property.slug}`} key={key}>
            <VerticalCard
              id={property.id}
              name={property.title} 
              price={property.price}
              currency={property.currency}
              category={property.category}
              address={property.address}
              image={property.banner}
              period={property.period ?? ''}
              listed_for={property.listed_for ?? ''}
              rating={property.average_rating ?? 5.0}
            />
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
        {properties.slice(0,3).map(((property, key) => (
          <HorizontalCard 
            id={property.id}
            name={property.title} 
            price={30} 
            currency={property.currency}
            category={property.category} 
            listed_for={property.listed_for}
            address={property.address} 
            image={property.banner} 
            period={property.period ?? ''} 
            rating={property.average_rating ?? 5.0}
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
