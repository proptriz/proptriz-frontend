'use client';

import React, { useState } from "react";
import { BackButton } from "@/components/shared/buttons";
import { VerticalCard } from "@/components/shared/VerticalCard";
import { agent } from "@/constant";
import Link from "next/link";
import { IoSettingsOutline } from "react-icons/io5";

const ProfileTransaction = () => {

    const statusCountStyle = 'border-2 border-white py-4 rounded-xl font-[Montserrat]'
    const [ listOrSold, setListOrSold ] = useState<string>('Transaction');
    const [ settingsMenu, setSettingsMenu ] = useState<string>('hidden');

    return (
        <div className="p-6 pb-24 relative">
            <div className={`fixed top-5 right-2 divide-y-2 space-y-5 px-4 py-8 bg-white ${settingsMenu}`}>  
                <button className="text-xl hover:card-bg hover:shadow-md block" >
                    <Link href={'/profile/edit'} >
                        Edit profile
                    </Link>
                </button> 
                <button className="text-xl hover:card-bg hover:shadow-md block" >    
                    <Link href={'/property/add'} >
                        List new property
                    </Link>
                </button>
                <button className="text-xl hover:card-bg hover:shadow-md block" >    
                    <Link href={'/property/edit'} >
                        Edit Property
                    </Link>
                </button> 
                <button className="text-xl hover:card-bg hover:shadow-md block" >    
                    <Link href={'/profile/reviews'} >
                        Check reviews 
                    </Link>
                </button>                
                <button className="text-xl hover:card-bg hover:shadow-md block" >    
                    <Link href={'/profile/faq'} >
                        FAQ
                    </Link>
                </button>
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
            <button className={`w-full py-2 rounded-full text-gray-600 text-center text-sm ${listOrSold==='Transaction'? 'bg-white text-[#61AF74]' : '' }`}
                    onClick={()=>setListOrSold('Transaction')}
                >
                    Transaction
                </button>
                <button className={`w-full py-1 rounded-full text-gray-600 text-center text-sm ${listOrSold==='Listings'? 'bg-white text-[#61AF74]' : '' }`}
                    onClick={()=>setListOrSold('Listings')}
                >
                    Listings
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
                    <p className="text-lg mb-4 font-[Raleway]"><span className="font-bold">3</span> {listOrSold}</p>
                    <button className="px-5 py-3 mb-6 rounded-full ml-auto bg-[#234F68] text-white">+</button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                {agent.properties.map((listing, key) => (
                    <Link href={'/property/details'} key={key}>
                        <VerticalCard
                            id={listing.id}
                            name={listing.name}
                            price={listing.price}
                            address={listing.address}
                            period={'month'}
                            rating={5.0}
                            type="apartment"
                            image={listing.image}
                        />
                    </Link>
                ))}
                </div>
            </section>

            <button className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-10 w-[80%] bg-green text-white text-lg font-bold py-3 rounded-xl">
                Start Chat
            </button>
        </div>
    );
};

export default ProfileTransaction;
