import { PropertyProps } from "@/types";
import formatPrice from "@/utils/formatPrice";
import { LuPi } from "react-icons/lu";

export const VerticalCard = ({
    id,
    image,
    name,
    rating,
    address,
    price,
    type,
    period
  }: PropertyProps ) => {
    return (
        <div className="bg-white p-3 rounded-2xl shadow-md">
            <div className="w-full bg-cover bg-center h-48 rounded-xl relative" style={{ backgroundImage: `url(${image})`}}>
                <div className="absolute bottom-2 right-2 bg-primary text-white p-1 rounded-xl">
                    <p className="flex items-center text-lg">
                        <LuPi className="text-sm"/> <span className="font-semibold"> {formatPrice(price)}</span>
                        <span className="text-xs ms-1">{period}</span>
                    </p>                    
                </div>
            </div>
            <div>
                <p className="text-md font-semibold my-2">{name}</p>
                <div className="flex space-x-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-gray-500 text-sm">{rating}</span>
                    <p className="text-gray-500 text-sm">{address}</p>
                </div>
            </div>
        </div>
    )
}

