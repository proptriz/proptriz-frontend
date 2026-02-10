import React from "react";
import { FaStar } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import Image from "next/image";
import formatPrice from "@/utils/formatPrice";
import { CurrencyEnum, PropertyProps } from "@/types";

const getCurrencySymbol = (currency?: CurrencyEnum) => {
  switch (currency) {
    case CurrencyEnum.naira:
      return "₦";
    case CurrencyEnum.dollars:
      return "$";
    case CurrencyEnum.pounds:
      return "£";
    case CurrencyEnum.euros:
      return "€";
    default:
      return "";
  }
};

const HorizontalCard: React.FC<PropertyProps> = ({
  id,
  image,
  name,
  rating = 0,
  address,
  price,
  currency,
  category,
  period,
  listed_for,
  expired
}) => {
  return (
    <div
      key={id}
      className="
        flex gap-3 bg-white p-3 rounded-xl shadow-sm
        min-w-[85%] sm:min-w-[60%] md:min-w-[420px]
      "
    >
      {/* Image */}
      <div className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden">
        <Image
          src={image || "/logo.png"}
          alt={name}
          fill
          sizes="112px"
          className="object-cover"
        />

        {/* Listed for badge */}
        {listed_for && (
          <span className="absolute top-2 left-2 bg-white text-primary text-[10px] font-semibold px-2 py-[2px] rounded-md">
            For {listed_for}
          </span>
        )}

        {/* Category */}
        {category && (
          <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-[2px] rounded-md">
            {category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1">
        {/* Title */}
        <h3 className="font-semibold text-sm leading-tight line-clamp-2">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <FaStar className="text-yellow-400 mr-1" />
          <span>{rating.toFixed(1)}</span>
        </div>

        {/* Address */}
        <div className="flex items-start text-xs text-gray-500 mt-1">
          <HiOutlineLocationMarker className="mt-[1px] mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{address}</span>
        </div>

        {/* Price row */}
        <div className="flex items-center mt-2">
          <span className="text-primary font-semibold text-base">
            {getCurrencySymbol(currency)}
            {formatPrice(price)}
          </span>

          {period && (
            <span className="text-xs text-gray-500 ml-1">
              /{period}
            </span>
          )}

          {expired && (
            <span className="ml-auto bg-red-600 text-white text-[10px] px-2 py-[2px] rounded-md">
              Expired
            </span>
          )}
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
