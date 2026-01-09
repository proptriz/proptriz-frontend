'use client';

import React, { useState, useEffect, use } from "react";
import { ReviewCard } from "@/components/shared/Cards";
import { VerticalCard } from "@/components/shared/VerticalCard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar, FaBed, FaRegHeart, FaArrowLeft } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { PropertyType } from "@/types";
import Link from "next/link";
import { getNearestProperties, getPropertyById } from "@/services/propertyApi";
import logger from '../../../../../logger.config.mjs';
import Price from "@/components/shared/Price";
import GalleryModal from "@/components/shared/GalleryModal";
import { BiShareAlt } from "react-icons/bi";
import StickyAgentInfo from "@/components/StickyAgent";
import PropertyDescription from "@/components/shared/Description";

const PropertyDetail = ({
  params
}: {
  params: Promise<{ id: string }> 
}) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const propertyId = resolvedParams.id;
  logger.info("property id: ", propertyId)

  const [property, setProperty] = useState<PropertyType | null>(null);
  const [nearestProperty, setNearestProperty] = useState<PropertyType[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [togglePopup, setTogglePopup] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId || property) return
    setLoading(true);
    setError(null);
    const fetchProperty = async () => {
      try {
        const property = await getPropertyById(propertyId);
        if (property.id) {
          setProperty(property);
          logger.info("fetched property: ", property);
        } else {
          setError('Failed to get property with ');
          logger.info("error fetching all property ");
        }
      } catch (error:any){

      } finally {
        setLoading(false);
      }      
    };
      
    fetchProperty()
  }, [propertyId]);

  useEffect(() => {
    if (!propertyId || nearestProperty.length>0) return
    const fetchProperty = async () => {
      try {
        const properties = await getNearestProperties(propertyId);
        if (properties && properties.length>0) {
          setNearestProperty(properties);
          logger.info("fetched properties: ", properties);
        } else {
          logger.info("unable to fetch nearest properties ");
        }
      } catch (error:any){
        logger.info("error fetching nearest properties ");
      }
    };
      
    fetchProperty()
  }, [propertyId,]);

  if (loading){
    return (
      <div>Loading property details</div>
    )
  }

  if (error){
    return (
      <div>Error Loading property details</div>
    )
  }

  return (
    <div>
      {property && (
        <>
          {/* Scrollable content */}
          <div className="flex flex-col pb-[96px] relative">
            <div className={`absolute top-0 left-0 w-full h-full z-0 card-bg opacity-75 ${
              togglePopup ? '' : 'hidden'
              }`}
              onClick={()=>setTogglePopup(false)}
            ></div>

            {/* Header Section */}
            <div className="relative">
              <Image
                // loader={customImageLoader}
                src={property.banner || "/skyscraper.png"} 
                alt="Property image"
                width={1000}
                height={700}
                className="w-full h-[400px] object-cover rounded-b-lg"
              /> 

              <button
                className="absolute top-5 left-3 p-2 text-xl hover:bg-gray-100 rounded-full shadow-md"
                onClick={() => router.back()}
              >
                <FaArrowLeft className="text-xl" />
              </button>           
                    
              <div className="absolute top-5 right-5 flex space-x-3">                
                <button className="p-2 hover:bg-gray-100 rounded-full shadow-md">
                  <BiShareAlt />
                </button>
                <button className="p-2 hover:bg-gray-100 hover:text-red-800 rounded-full shadow-md">
                  <FaRegHeart />
                </button>
              </div>

              {/* Bottom-left rating and category */}
              <div className="absolute bottom-5 left-5 bg-black bg-opacity-50 text-white px-4 py-1 rounded-full">
                <span className="text-yellow-500">★</span>
                <span>5.0</span> | <span>{property?.category}</span>
              </div>

              {/* Thumbnail link (replaces bottom-right overlay) */}
              <div
                className="absolute bottom-5 right-5 cursor-pointer"
                onClick={() => setShowGallery(true)} // assuming you’ll use state to open a modal/gallery
              >
                <img
                  src={property?.images?.[1] || "/placeholder-thumb.jpg"}
                  alt="View more images"
                  className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-lg hover:opacity-90 transition"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg text-white text-sm font-medium">
                  +{property?.images?.length || 0}
                </div>
              </div>
            </div>

            {/* Title & Price */}
            <div className="p-5">
              <div className="flex items-center justify-between">
                <p>
                  Updated on: {property.updatedAt && new Date(property.updatedAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                  })}
                </p>
                <p className="bg-primary text-secondary px-3 py-1 rounded-sm text-sm">
                  For {property.listed_for.charAt(0).toUpperCase() + property.listed_for.slice(1)}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <h1 className="text-lg font-bold">{ property.title }</h1>
                  <div  className="flex">
                    <HiOutlineLocationMarker />
                    <p className="text-gray-500 text-sm"> { property.address }</p>
                  </div>
                  
                </div>
                <Price price={property.price} currency={property.currency} tenancyPeriod={property.period} />               
              </div>
            </div>

            {/* Property Features */}
            <div className="px-5 mb-7 flex overflow-x-auto space-x-6">
              {property.features?.map((item, key)=>(
                <div className="card-bg flex p-3 rounded-lg text-sm text-primary items-center" key={key}>
                  <span className="me-2"><FaBed className="text-green"/></span>
                  <span className="text-nowrap">{item.quantity} {item.name}</span>
                </div>
              ))}               
            </div>

            {/* Property Description */}
            <div className="px-5">
              <PropertyDescription description={property.description} />
            </div>

            {/* Map Section */}
            <div className="px-5 mt-5">
              <Link href={`/property/detail-map/${propertyId}`}>
                <div className="relative w-full h-48 rounded-lg overflow-hidden cursor-pointer shadow-lg">
                  
                  {/* Background Image */}
                  <Image
                    src="/map-image.png"
                    alt="Map"
                    fill
                    className="object-cover"
                    style={{ objectFit: "cover" }}
                  />

                  {/* Overlay mask */}
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>

                  {/* Header text */}
                  <h2 className="absolute bottom-4 left-4 text-white font-bold text-lg">
                    Click to view more location details
                  </h2>

                </div>
              </Link>
            </div>

            {/* Reviews */}
            <Link href={`/property/reviews/${property.id}`}>
              <div className="px-5 mt-10">
                <h2 className="text-lg font-bold mb-3">Reviews</h2>
                <div className="bg-primary p-3 rounded-lg flex items-center">
                  <FaStar className="text-secondary" />
                  <span className="ml-2 text-lg text-gray-200 font-bold">5.0</span>
                  <span className="ml-2 text-gray-400">(6 reviews)</span>
                </div>
                <div className="mt-3 space-y-3">
                  {/* Review Item */}
                  <ReviewCard 
                    review={{
                      id:'01', 
                      reviewer:"Kurt Mullins", 
                      image:"/avatar.png", 
                      ratings:4.0,
                      text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                      review_date:"2025-01-01T10:00:00Z", // Example ISO 8601 date string
                      replies_count: 3,
                      review_images: [],
                    }}
                  />
                  {/* Add more reviews here */}
                </div>
                <button className="mt-3 text-green" onClick={()=>router.push('/property/reviews')}>
                  View all reviews
                </button>
              </div>
            </Link>

          {/* Nearby Properties */}
          {nearestProperty && nearestProperty.length>0 && <div className="px-5 mt-10">
            <h2 className="text-lg font-bold mb-3">Properties from same location (Nearby)</h2>
            <div className="flex space-x-3">
              {/* Property Card */}
              <div className="grid grid-cols-2 w-full gap-3 ">
                {nearestProperty.slice(0,4).map(((item, key)=>(
                  <Link href={`/property/details/${item.id}`} key={key}>
                    <VerticalCard
                      id={item.id}
                      name={item.title} 
                      currency={item.currency}
                      price={item.price} 
                      category={item.category} 
                      listed_for={item.listed_for}
                      address={item.address} 
                      image={item.banner} 
                      period={item.period? item.period : ""} 
                      rating={20}                      
                    />
                  </Link>
                )))}
              </div>
                  
              {/* Add more cards here */}
            </div>
          </div>}
        </div>
        {/* Sticky bottom agent bar */}
        <StickyAgentInfo user={property.user} />
        </>
      )} 
      
      {/* Gallery Modal */}
      {property &&  (
        <GalleryModal
          images={property.images}
          show={showGallery}
          startIndex={0}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
};

export default PropertyDetail;
