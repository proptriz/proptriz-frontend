import React from "react";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";

interface ReviewCardProps {
    reviewer: string;
    text: string;
    ratings: number;
    image: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
    reviewer,
    text,
    ratings,
    image,
}) => {
  return (
    <div className="flex items-start space-x-3 space-y-3 card-bg p-3 text-sm rounded-xl mt-5">
        <img
        src={image} // Replace with the actual reviewer image URL
        alt={image}
        className="w-10 h-10 rounded-full"
        />
        <div>
            <div className="flex">
                <h3 className="text-sm font-bold">{reviewer}</h3>
                <div className="flex ml-auto text-yellow-500"><FaStar className="" /><FaStar className="" /><FaRegStar /><FaRegStar /></div>
            </div>
            
            <p className="text-sm text-gray-500">{text}
            </p>
        </div>
    </div>
  );
};

;
