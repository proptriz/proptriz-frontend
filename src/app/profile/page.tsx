'use client';

import React, { useContext, useEffect, useState } from "react";
import { BackButton } from "@/components/shared/buttons";
import { VerticalCard } from "@/components/shared/VerticalCard";
import { agent } from "@/constant";
import Link from "next/link";
import { IoSettingsOutline } from "react-icons/io5";
import { AppContext } from "../../context/AppContextProvider";
import { PropertyType } from "@/types";
import { getUserListedProp } from "@/services/propertyApi";
import logger from "../../../logger.config.mjs"
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

export default function ProfileTransaction () {
  const { authUser } = useContext(AppContext);
  const statusCountStyle = 'border-2 border-white py-4 rounded-xl font-[Montserrat]'
  const [ listOrSold, setListOrSold ] = useState<string>('Listings');
  const [ listedProperties, setListedProperties ] = useState<PropertyType[]>([]);
  const [ settingsMenu, setSettingsMenu ] = useState<string>('hidden');

  const menuItems = [
    {title: 'Edit profile', link: '/profile/edit'},
    {title: 'List new property', link: '/property/add'},
    {title: ' Check reviews ', link: '/property/edit'},
    {title: 'Become an Agent', link: '/profile/become-agent'},
    {title: 'FAQ', link: '/profile/faq'},
  ]

  useEffect(() => {
    const fetchListedProp = async () => {
      try {
        const properties = await getUserListedProp();
        setListedProperties(properties);
        } catch (error) {
          logger.error("❌ Error fetching listed properties:", error);
        }
    }
    fetchListedProp()
  }, [])

return (
  <div className="p-6 pb-24 relative">
    <div className={`absolute top-5 right-2 divide-y-2 space-y-2 px-4 py-8 bg-white text-sm ${settingsMenu}`}>  
      {menuItems.map((item, index) => (
        <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3" key={index}>
            <Link href={item.link} >
                {item.title}
            </Link>
        </button>
      )) }               
    </div>
    <div className="flex items-center justify-between mb-5">
      <BackButton />            
      <h1 className="text-2xl font-bold 2xl">Profile</h1>
      <button className="top-5 left-5 p-4 text-xl card-bg rounded-full shadow-md" 
      onClick={()=>setSettingsMenu('')}>
        <IoSettingsOutline />
      </button> 
                
    </div>
            
    <div className="mb-6 text-center">
      <div className="flex flex-col items-center mb-2">
        <div className="bg-white w-32 h-32 rounded-full p-1 mt-4">
          <img
            src="https://placehold.co/40"
            alt="profile"
            className="rounded-full w-full h-full object-cover"
          />                    
        </div>                    
        <div className="-mt-4 ml-12">
          <span className="bg-green text-white text-xs px-2 py-1 rounded-full">
            #1
          </span>
        </div>
      </div>
      <h2 className="font-bold text-2xl">{agent.name}</h2>
      <p className="text-gray-500 mb-3">{agent.email}</p>

      {/* Count Status */}
      <div className="grid grid-cols-3 space-x-6 text-center mb-5">
        <div className={statusCountStyle}>
            <p className="font-bold">{agent.rating}</p>
            <p className="text-gray-500 ">Rating</p>
        </div>
        <Link href={'/profile/reviews'} >
          <div className={statusCountStyle}>
            <p className="font-bold">{agent.reviews}</p>
            <p className="text-gray-500">Reviews</p>
          </div>
        </Link>
        <div className={statusCountStyle}>
          <p className="font-bold">{agent.sold}</p>
          <p className="text-gray-500">Sold</p>
        </div>
      </div>
    </div>

    {/* List or Sold Toggle button */}
    <div className="flex bg-gray-200 rounded-full shadow-lg text-white mb-7 p-4 space-x-4">
      <button className={`w-full py-1 rounded-full text-gray-600 text-center text-sm ${listOrSold==='Listings'? 'bg-white text-[#61AF74]' : '' }`}
        onClick={()=>setListOrSold('Listings')}
      >
        Listings
      </button>
      <button className={`w-full py-2 rounded-full text-gray-600 text-center text-sm ${listOrSold==='Transaction'? 'bg-white text-[#61AF74]' : '' }`}
        onClick={()=>setListOrSold('Transaction')}
      >
        Transaction
      </button>                
      <button className={`w-full py-2 rounded-full text-gray-600 text-center text-sm ${listOrSold==='Sold'? 'bg-white text-[#61AF74]' : '' }`}
        onClick={()=>setListOrSold('Sold')}
      >
        Sold
      </button>                
    </div>

    {/* Card List  */}
    <section>
      <div className="flex items-center">
        <p className="text-lg mb-4 font-[Raleway]">
          <span className="font-bold">
            {listedProperties.length}
          </span> 
          {listOrSold}
        </p>
        <button className="px-5 py-3 mb-6 rounded-full ml-auto bg-[#234F68] text-white">+</button>
      </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listedProperties.map((item: any) => (
        <div
          key={item.id}
          className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          {/* Property Card */}
          <VerticalCard
            id={item.id}
            name={item.title}
            price={item.price}
            type={item.category}
            address={item.address}
            image={item.banner}
            period={item.period || ""}
            rating={20}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex items-center gap-4 bg-white/90 rounded-full px-5 py-3 shadow-lg backdrop-blur-md">
              {/* Preview */}
              <Link
                href={`/property/details/${item.id}`}
                aria-label="Preview Property"
                className="p-3 rounded-full text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-all duration-200"
              >
                <FaEye size={18} />
              </Link>

              {/* Edit */}
              <Link
              href={`/property/edit/${item.id}`}
              aria-label="Edit Property"
              className="p-3 rounded-full text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-all duration-200"
              >
                <FaEdit size={18} />
              </Link>

              {/* Delete */}
              <button
                aria-label="Delete Property"
                // onClick={() => onDelete?.(item.id)}
                className="p-3 rounded-full text-red-600 hover:bg-gray-100 hover:text-red-700 transition-all duration-200"
              >
                <FaTrash size={18} />
              </button>
            </div>
          </div>
        </div>
        ))}
        </div>
    </section>

    <button className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-10 w-[80%] bg-green text-white text-lg font-bold py-3 rounded-xl md:w-[500px] md:mx-auto">
      Start Chat
    </button>
  </div>
);
};

