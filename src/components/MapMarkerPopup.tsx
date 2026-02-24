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
      : '/logo.png';

  return (
    <div style={{ position: 'relative', zIndex: 20 }} className='p-1 bg-wite'>
      {/* property image - Close to property category */}
      <div className="w-full bg-cover bg-center h-40 relative" style={{ backgroundImage: `url(${ imageUrl })`}}>
        {/* Listed For */}
        <div className="absolute top-2 left-2 font-bold bg-white text-primary text-sm px-2 py-1 rounded-lg">
          For {property.listed_for}
        </div>
        {/* Property Type */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1
                        bg-black/55 backdrop-blur-[2px] text-white
                        text-[10px] font-medium px-2 py-1 rounded-md leading-none">
          <span className="text-[#f5a623]">★</span>
          {property.average_rating || 5.0} · {property.category}
        </div>
      </div>

      {/* property title - Close with a small gap */}
      <div className="p-3 space-y-1.5">
        {/* Price row */}
        <div className="flex items-baseline gap-1">
          <span
            className={`text-[18px] font-extrabold ${
              "text-primary"
            }`}
          >
            {currencySymbol[property.currency]}{formatPrice(property.price)}
          </span>
          {property.period && (
            <span className="text-[10px] text-[#9ca3af] font-normal">
              /{property.period}
            </span>
          )}
        </div>

        {/* Name */}
        <p className="text-[12px] font-semibold text-[#111827]
                      truncate leading-snug">
          {property.title}
        </p>

        {/* Address */}
        <p className="text-[10px] text-[#9ca3af] truncate flex items-center gap-1">
          <span>📍</span>
          {property.address}
        </p>

        {/* CTA */}
        <Link href={`/property/details/${property._id}`}>
          <button className="w-full mt-3 rounded-lg bg-primary text-white py-1.5 text-sm font-medium hover:bg-secondary hover:text-primary transition">
            View Details
          </button>
        </Link>
      </div>

    </div>
  );
};

export default MapMarkerPopup;

