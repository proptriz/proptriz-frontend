import React from "react";
import { FiHeart } from "react-icons/fi";

interface PropertyCardProps {
  title: string;
  price: string;
  location: string;
  image: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  title,
  price,
  location,
  image,
}) => {
  return (
    <div className="p-3 bg-white rounded-lg shadow-md">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-32 object-cover rounded-lg"
        />
        <FiHeart className="absolute top-2 right-2 text-gray-500" />
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-gray-500 text-xs">{location}</p>
        <p className="text-green-500 font-bold">{price}/month</p>
      </div>
    </div>
  );
};

export default PropertyCard;
