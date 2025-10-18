'use client';

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaAngleDown, FaRegBell } from "react-icons/fa6";
import dynamic from 'next/dynamic';
import Link from "next/link";
import { IoChevronBack } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaBullseye } from "react-icons/fa";
import { mockProperties } from "@/constant";
import { getPropertyById } from "@/services/propertyApi";
import { PropertyType } from "@/types";
import logger from "logger.config.mjs";
import Image from "next/image";
import getUserPosition from "@/utils/getUserPosition";

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function PropertyMap({
  params
}: {
  params: Promise<{ id: string }> 
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const propertyId = resolvedParams.id;

  const [property, setProperty] = useState<PropertyType | null>(null);
  const [propLoc, setPropLoc] = useState<[number, number]>([0.0, 0.0]);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(13);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId || property) return
    setLoading(true);
    const fetchProperty = async () => {
      try {
        const property = await getPropertyById(propertyId);
        if (property.id) {
          setProperty(property);
          setPropLoc([property.latitude, property.longitude])
          logger.info("fetched property: ", property);
        } else {
          setError('Failed to get property with ');
          logger.info("error fetching all property ");
        }
      } catch (error: any) {
        setError('Failed to get property with ');
        logger.info("error fetching all property ");
      } finally {
        setLoading(false);
      }
      
    };
        
    fetchProperty()
  }, [propertyId]);

  // Get user location
  const fetchLocation = async () => {    
    const [lat, lng] = await getUserPosition();
    // logger.debug("User location:", lat, lng);
    setMapCenter([lat, lng]);
    setZoomLevel(13);
  };
    
    
  return (
    <div className="flex flex-col">
      {/* Map Section */}
      <div className="">
        {/* Top Buttons */}
        <div className="absolute z-10 pt-2">
          <div className="flex overflow-x-auto space-x-4 px-5 relative">
            {property?.features && property.features.map((item, index) => (
              <div
                key={index}
                className="bg-white flex p-3 rounded-full text-sm text-gray-600 items-center shadow-md"
              >
                <span className="whitespace-nowrap mr-2">{item.quantity}</span>
                <span className="whitespace-nowrap">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Content */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full md:max-w-[650px] md:mx-auto px-4 z-10">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center bg-white p-3 rounded-full text-sm shadow-md">
              <HiOutlineLocationMarker className="mr-2" />
              <span>{property?.address}</span>
              <FaAngleDown />
            </div>
            <button
              className="bg-primary"
              style={{
                borderRadius: '50%',
                width: '55px',
                height: '55px',
                padding: '0px',
              }}
            //   onClick={()=>fetchLocation()}
            //   disabled={!isSigningInUser}
            >
              <Image
                className="mx-auto"
                src="/icon/my_location.png"
                width={40}
                height={40}
                alt="my location"
              />
            </button>
        </div>

        {/* Location Details */}
        <div className="bg-white w-full rounded-3xl p-4 shadow-lg">
          <h2 className="text-lg font-bold mb-3">Location Details</h2>
          <div className="max-h-[250px] overflow-y-auto">
            <div
            className="rounded-full p-4 border border-[#DCDFD9] my-4 cursor-pointer hover:bg-gray-100 flex items-center"
            >              
              <p className="text-gray-500">
                {property?.env_facilities?.map((item, index)=>(
                  <button className="card-bg rounded-full p-3 mr-2" disabled>
                    <HiOutlineLocationMarker />
                  </button>
                ))}
              </p>
            </div>
          </div>
        </div>
        </div>
        {property && <div className="relative flex-1">
          <Map 
          properties={[property]} 
          mapCenter={propLoc || mapCenter}
          initialZoom={zoomLevel}
          />
        </div>}
      </div>
    </div>
  );
}
