import React from "react";
import { FaHeart, FaStar } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import Image from "next/image";

interface HorizontalCardProps {
  id: string,
  image: string; // URL of the property image
  name: string; // Title of the property
  rating: number; // Rating of the property
  address: string; // Location of the property
  price: number; // Price per month
  type: string; // Property type (e.g., "Apartment")
  period: string
}

const HorizontalCard: React.FC<HorizontalCardProps> = ({
  id,
  image,
  name,
  rating,
  address,
  price,
  type,
  period
}) => {
  return (
    <div className="flex items-center card-bg rounded-2xl shadow-md p-2 space-x-4 min-w-[70%] md:min-w-[40%] max-w-lg">
      {/* Image Section */}
      <div className="relative w-32 h-32 rounded-lg overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Favorite Icon */}
        <button className="absolute top-2 left-2 bg-white p-1 rounded-full shadow">
          <FaHeart className="text-green-500" />
        </button>
        {/* Property Type */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-lg">
          {type}
        </div>
      </div>

      {/* Details Section */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{name}</h3>
        <div className="flex items-center space-x-1 text-gray-500 text-sm mt-1">
          <FaStar className="text-yellow-400" />
          <span>{rating}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-500 text-sm mt-1">
          <HiOutlineLocationMarker />
          <span>{address}</span>
        </div>
        <div className="text-green-500 font-bold text-lg mt-2">${price}/{period}</div>
      </div>
    </div>
  );
};

export default HorizontalCard;


export const HorizontalCard2 = ({
    image,
    name,
    rating,
    address,
    price,
    type,
    period
  }: HorizontalCardProps)=>{
    return(
        <div className="grid grid-cols-2 min-w-[70%] md:min-w-[40%] space-x-3 bg-[#DCDFD9] p-2 rounded-lg shadow-md items-center" >
            <Image
            src={image}
            width={80}
            height={100}
            alt="Sky Apartment"
            className="w-[200px] rounded-lg h-full"
            />
            <div className="">
                <h3 className="text-sm font-semibold mb-2">
                    {name}
                </h3>
                <div>
                    <span className="text-red-500 me-1">★</span>
                    <span className="text-gray-500 text-sm">{rating}</span>
                </div>
                <div className="flex space-x-1">
                    <Image
                        src="/pin.png"
                        width={8}
                        height={7}
                        alt="loc"
                    />
                    <p className="text-gray-500 text-sm">{address}</p>
                </div>
                <p className="text-blue-600 font-bold mt-5 text-sm">N{price}/{period}</p>
            </div>
        </div>
    )
}
