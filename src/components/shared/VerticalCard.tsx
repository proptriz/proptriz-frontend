import { PropertyProps } from "@/definitions";


interface VerticalCardProps {
    id: string;
    image: string; // URL of the property image
    name: string; // Title of the property
    rating: number; // Rating of the property
    address: string; // Location of the property
    price: number; // Price per month
    type: string; // Property type (e.g., "Apartment")
    period: string
  }

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
                <div className="absolute bottom-2 right-2 bg-gray-700 text-white font-bold p-1 rounded-xl">
                    N{price}
                    <span className="text-xs">{period}</span>
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

