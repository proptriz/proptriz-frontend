import { CurrencyEnum, PropertyProps } from "@/types";
import formatPrice from "@/utils/formatPrice";

const formatDistance = (distance?: string | number) => {
  if (!distance) return null;

  const meters = typeof distance === "string"
    ? Number(distance)
    : distance;

  if (Number.isNaN(meters)) return null;

  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  return `${(meters / 1000).toFixed(1)} km`;
};


export const VerticalCard = ({
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
  distance,
  expired
}: PropertyProps ) => {
  return (
    <div className="bg-white p-3 rounded-2xl shadow-md" key={id}>
      <div className="w-full bg-cover bg-center h-48 rounded-xl relative" style={{ backgroundImage: `url(${image})`}}>
        {/* Listed For */}
        <div className="absolute top-2 left-2 font-bold bg-white text-primary text-sm px-2 py-1 rounded-lg">
          For {listed_for}
        </div>
        
        {/* Property Type */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-lg">
          <span className="text-yellow-500">★</span>
          {rating} | {category}
        </div>
      </div>
      
      <div className="mt-3 gap-1">
        <p className="flex text-primary items-center text-lg">
          <span className=""> 
            {currency===CurrencyEnum.naira ? "₦" : currency===CurrencyEnum.dollars ? "$" : currency===CurrencyEnum.pounds ? "£" : currency===CurrencyEnum.euros ? "€" : ""}
          </span> 
          
          <span className="font-semibold"> 
            {formatPrice(price)}
          </span>
          
          <span className="text-xs ms-1">
            {period}
          </span>
          
          {expired && <span className="ms-auto bg-red-800 text-white text-sm p-1 rounded-md">
            Expired
          </span>}
        </p>                    
        
        <p className="text-md font-semibold">
          {name}
        </p>
        
        <div className="flex space-x-2">
          <p className="text-gray-500 text-sm">
            {address}
          </p>
        </div>

        {distance && (
          <div className="inline-flex items-center card-bg rounded-md text-xs px-2 py-1 mt-2 w-fit">
            {formatDistance(distance)}
          </div>
        )}
      </div>
    </div>
  )
}

