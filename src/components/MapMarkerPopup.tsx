import Image from 'next/image';
import Link from 'next/link';

import logger from '../../logger.config.mjs';
import { CurrencyEnum, PropertyType } from '@/types';
import Price from './shared/Price';
import formatPrice from '@/utils/formatPrice';

const MapMarkerPopup = ({ property }: { property: PropertyType }) => {

  const imageUrl =
    property.banner && property.banner.trim() !== ''
      ? property.banner
      : '/PropTriz.svg';

  const truncateChars = (text: string, maxChars: number): string => {
    return text.length > maxChars ? text.slice(0, maxChars) + '...' : text;
  };

  return (
    <div style={{ position: 'relative', zIndex: 20, padding: '10px' }}>
      {/* property image - Close to property category */}
      <div className="w-full bg-cover bg-center h-40 relative" style={{ backgroundImage: `url(${ imageUrl })`}}>
        {/* Listed For */}
        <div className="absolute top-2 left-2 font-bold bg-white bg-opacity-50 text-primary text-sm px-2 py-1 rounded-lg">
          For {property.listed_for}
        </div>
        {/* Property Type */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-lg">
          <span className="text-yellow-500">★</span>
          {property.rating} | {property.category}
        </div>
      </div>

      {/* property title - Close with a small gap */}
      <h2
        style={{
          fontWeight: 'bold',
          fontSize: '15px',
          marginTop: '10px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {truncateChars(property.title, 20)} 
      </h2>

      <p className="relative text-2xl font-semibold text-primary flex items-center">
        {property.currency===CurrencyEnum.naira ? "₦" : property.currency===CurrencyEnum.dollars ? "$" : property.currency===CurrencyEnum.pounds ? "£" : property.currency===CurrencyEnum.euros ? "€" : ""}
        { formatPrice(property.price) } 
        <span className="text-gray-600 text-sm text-right ms-1"> { property.period}</span>
      </p>
      
      {/* Link to Buy button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
        <Link
          href={`/property/details/${property.id}`}
          style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
        >
          <button
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary hover:text-primary transition-colors duration-300 w-full"
          >
            View
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MapMarkerPopup;

