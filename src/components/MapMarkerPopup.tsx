import Link from 'next/link';

import { CurrencyEnum, PropertyType } from '@/types';
import formatPrice from '@/utils/formatPrice';

const currencySymbol: Record<CurrencyEnum, string> = {
  [CurrencyEnum.naira]: "₦",
  [CurrencyEnum.dollars]: "$",
  [CurrencyEnum.pounds]: "£",
  [CurrencyEnum.euros]: "€",
};


const MapMarkerPopup = ({ property }: { property: PropertyType }) => {

  const imageUrl =
    property.banner && property.banner.trim() !== ''
      ? property.banner
      : '/PropTriz.svg';

  const truncateChars = (text: string, maxChars: number): string => {
    return text.length > maxChars ? text.slice(0, maxChars) + '...' : text;
  };

  return (
    <div style={{ position: 'relative', zIndex: 20 }} className='p-1'>
      {/* property image - Close to property category */}
      <div className="w-full bg-cover bg-center h-40 relative" style={{ backgroundImage: `url(${ imageUrl })`}}>
        {/* Listed For */}
        <div className="absolute top-2 left-2 font-bold bg-white text-primary text-sm px-2 py-1 rounded-lg">
          For {property.listed_for}
        </div>
        {/* Property Type */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-lg">
          <span className="text-yellow-500">★</span>
          {property.average_rating || 5.0} | {property.category}
        </div>
      </div>

      {/* property title - Close with a small gap */}
      <div className="p-3 space-y-1.5">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 truncate leading-tight">
          {truncateChars(property.title, 20)}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-1 leading-none">
          <span className="text-base text-xl font-bold text-primary">
            {currencySymbol[property.currency]}
            {formatPrice(property.price)}
          </span>

          {property.period && (
            <span className="text-sm text-gray-700">
              /{property.period}
            </span>
          )}
        </div>

        {/* CTA */}
        <Link href={`/property/details/${property.id}`}>
          <button className="w-full mt-3 rounded-lg bg-primary text-white py-1.5 text-sm font-medium hover:bg-secondary hover:text-primary transition">
            View Details
          </button>
        </Link>
      </div>

    </div>
  );
};

export default MapMarkerPopup;

