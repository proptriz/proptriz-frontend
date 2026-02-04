import React from "react";
import { FaStar } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import Image from "next/image";
import formatPrice from "@/utils/formatPrice";
import { CurrencyEnum, PropertyProps } from "@/types";

const HorizontalCard: React.FC<PropertyProps> = ({
  id,
  image,
  name,
  rating,
  address,
  price,
  currency,
  category,
  period,
  listed_for,
  expired
}) => {
  return (
    <div className="flex items-center bg-white p-3 rounded-2xl shadow-md space-x-4 min-w-[70%] md:min-w-[40%] max-w-lg" key={id}>
      {/* Image Section */}
      <div className="relative w-32 h-32 rounded-lg overflow-hidden">
        <img
          src={image || "/logo.png"}
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Listed For */}
        <div className="absolute top-2 left-2 font-bold text-primary text-sm px-2 py-1 rounded-lg bg-white">
          For {listed_for}
        </div>
        {/* Property Type */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-lg">
          {category}
        </div>
      </div>

      {/* Details Section */}
      <div className="flex-1">
        <h3 className="font-semibold">{name}</h3>
        <div className="flex items-center space-x-1 text-gray-500 text-sm mt-1">
          <FaStar className="text-yellow-400" />
          <span>{rating}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-500 text-sm mt-1">
          <HiOutlineLocationMarker />
          <span>{address}</span>
        </div>
        <div className="text-primary font-bold mt-2">
          <p className="flex text-primary items-center text-lg">
            <span className=""> 
              {currency===CurrencyEnum.naira ? "₦" : currency===CurrencyEnum.dollars ? "$" : currency===CurrencyEnum.pounds ? "£" : currency===CurrencyEnum.euros ? "€" : ""}
            </span> <span className="font-semibold"> 
              {formatPrice(price)}
            </span>
            <span className="text-xs ms-1">{period}</span>
            {expired && <span className="ms-auto bg-red-800 text-white text-sm p-1 rounded-md">Expired</span>}
          </p>
        </div>
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
    currency,
    category,
    period
  }: PropertyProps)=>{
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
                <p className="text-blue-600 font-bold mt-5 text-sm">{currency}{formatPrice(price)} {period}</p>
            </div>
        </div>
    )
}
