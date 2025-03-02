'use client';

import React, { useState, useRef, useEffect, use } from "react";
import useSWR from "swr";
import { ReviewCard } from "@/components/shared/Cards";
import { VerticalCard } from "@/components/shared/VerticalCard";
import { mockProperties } from "@/constant";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaHeart, FaShareAlt, FaStar, FaBed, FaAngleDown, } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoChatbubbleEllipsesOutline, IoChevronBack } from "react-icons/io5";
import { TbView360Number } from "react-icons/tb";
import Popup from "@/components/shared/Popup";
import { IoIosArrowForward } from "react-icons/io";
import { PropertyType } from "@/definitions";
import formatPrice from "@/utils/formatPrice";
import Link from "next/link";
import propertyService from "@/services/propertyApi";
import Skeleton from "@/components/skeleton/Skeleton";
import { propertyFetcher } from "@/services/propertyApi";

const PropertyDetail = ({
  params
}: {
  params: Promise<{ id: string }> 
}) => {
    const router = useRouter();
    const resolvedParams = use(params);
    const propertyId = resolvedParams.id;

    console.log("property id: ", propertyId)
    // console.log("property slug: ", propertySlug)

    const [property, setProperty] = useState<PropertyType | null>(mockProperties[0]);
    const [togglePopup, setTogglePopup] = useState(false);
    const [buyPopup, setBuyPopup] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    // const [error, setError] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState({
      distance: '2.5 km',
      address: 'from Srengseng, Kembangan, West Jakarta City, Jakarta 11630',
    });

    const { data, error, isLoading } = useSWR(`${propertyId}`, propertyFetcher);
    console.log("fetched data with swr: ", data);
    console.log("fetched data with swr: ", error);

    useEffect(() => {
      const fetchProperty = async () => {
        if (data) {
          setProperty(data);
          console.log("fetched property: ", data)
        } else {
          console.log("no property found: ", data)
        }
      };
      fetchProperty()
    }, [data]);
  

    const locations = [
        {
            distance: '2.5 km',
            address: 'from Srengseng, Kembangan, West Jakarta City, Jakarta 11630',
        },
        {
            distance: '3.2 km',
            address: 'from Kebon Jeruk, Jakarta 11530',
        },
        {
            distance: '5.0 km',
            address: 'from Tanah Abang, Central Jakarta 10250',
        },
        {
            distance: '5.0 km',
            address: 'from Tanah Abang, Central Jakarta 10250',
        },
    ];

    const handleLocationSelect = (location: { distance: string; address: string }) => {
        setSelectedLocation(location);
        setTogglePopup(false); // Close the popup after selecting
    };

    if(isLoading) return <Skeleton type="list-detail" />

    return (
      <div>
        {property &&
          <div className="flex flex-col pb-16 relative">
            <div className={`absolute top-0 left-0 w-full h-full z-0 bg-blue-200 opacity-75 ${
                    togglePopup ? '' : 'hidden'
                    }`}
                    onClick={()=>setTogglePopup(false)}
            ></div>
            {/* Header Section */}
            <div className="relative">
                    <img
                    src={property.banner || "/skyscraper.png"} 
                    alt="Property image"
                    className="w-full h-[350px] object-cover rounded-b-xl"
                    /> 
                    <button className=" absolute top-5 left-5 p-4 text-xl card-bg rounded-full shadow-md" onClick={()=>router.back()}>
                        <IoChevronBack />
                    </button>           
                    
                    <div className="absolute top-5 right-5 flex space-x-3">                
                        <button className="p-2 bg-white rounded-full shadow-md">
                            <FaShareAlt />
                        </button>
                        <button className="p-2 bg-white rounded-full shadow-md">
                            <FaHeart color="green" />
                        </button>
                    </div>
                    <div className="absolute bottom-5 left-5 bg-black bg-opacity-50 text-white px-4 py-1 rounded-full">
                        <span>4.9</span> | <span>{property?.category}</span>
                    </div>
            </div>

            {/* Title & Price */}
            <div className="p-5">
                    <div className="flex items-center justify-between mt-3">
                        <div>
                            <h1 className="text-2xl font-bold">{ property.title }</h1>
                            <div  className="flex">
                                <HiOutlineLocationMarker />
                                <p className="text-gray-500 text-sm"> { property.address }</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl text-right font-semibold text-green">N{ formatPrice(property.price) }</p>
                            <p className="text-gray-500 text-sm"> { property.period }</p>
                        </div>                
                    </div>
                    
                    <div className="flex items-center justify-between mt-5">
                        <div className="flex items-center space-x-3 text-sm">
                            <button 
                            className="px-5 py-3 bg-green text-white rounded-lg"
                            onClick={()=>{setBuyPopup(true)}}
                            > 
                              { property.listed_for }
                            </button>
                        </div>
                        <button className="text-xl font-semibold card-bg p-4 rounded-full">
                          <TbView360Number />
                        </button>                
                    </div>
            </div>

            {/* Agent Info */}
            <div className="px-5 py-3 flex items-center bg-gray-100 rounded-lg mx-5 card-bg">
              <img
                src="/avatar.png" // Replace with the actual agent image URL
                alt="Agent"
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-3">
                <h2 className="text-lg font-bold">Anderson</h2>
                <p className="text-gray-500 text-sm">Real Estate Agent</p>
              </div>
              <button className="ml-auto p-2 card-bg text-2xl rounded-lg">
                <IoChatbubbleEllipsesOutline />
              </button>
            </div>

            {/* Property Details */}
            <div className="px-5 py-3 flex overflow-x-auto space-x-6 mt-5">
              {property.features?.map((item, key)=>(
                <div className="card-bg flex p-3 rounded-full text-sm text-gray-500 items-center" key={key}>
                  <span className="me-2"><FaBed className="text-green"/></span>
                  <span className="text-nowrap">{item.quantity} {item.name}</span>
                </div>
              ))}               
            </div>
            {/* Map Section */}
            <div className="px-5 mt-10 space-y-3">
              <h2 className="text-lg font-bold mb-3">Location & Public Facilities</h2>
              <p className="mt-3 text-gray-500"></p>
            <div
              className="card-bg p-4 w-full flex justify-between items-center rounded-full"
              onClick={() => setTogglePopup(!togglePopup)}
            >
              <p className="text-gray-500">
                <span className="font-bold">{selectedLocation.distance} </span>
                  {selectedLocation.address}
              </p>
              <FaAngleDown className={`transform transition-transform ${togglePopup ? 'rotate-180' : 'rotate-0'}`} />
            </div>

            <div className="px-5 py-3 flex overflow-x-auto space-x-4 mt-3">
              {property.env_facilities?.map((item, key)=>(
                <div className="card-bg flex p-3 rounded-full text-sm text-gray-500 items-center" key={key}>
                  <span className="text-nowrap"> {item}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl shadow-md w-full">
              <Image
              src="/map-image.png" 
              alt="Map"
              width={200}
              height={200}
              className="w-full h-[200px] object-contain"
              />
              <Link href={`/property/detail-map/${propertyId}`}>
                <button className="w-full py-4 card-bg">
                  View on map
                </button>
              </Link>
              </div>
                    
          </div>

          {/* Reviews */}
          <div className="px-5 mt-10">
            <h2 className="text-lg font-bold mb-3">Reviews</h2>
            <div className="bg-gray-700 p-3 rounded-lg flex items-center">
                    <FaStar className="text-yellow-500" />
                    <span className="ml-2 text-lg text-gray-200 font-bold">4.9</span>
                    <span className="ml-2 text-gray-500">(12 reviews)</span>
            </div>
            <div className="mt-3 space-y-3">
                    {/* Review Item */}
                    <ReviewCard 
                    id='01'
                    reviewer="Kurt Mullins" 
                    image="/avatar.png" 
                    ratings={4.0}
                    text="Lorem ipsum dolor sit amet, consectetur 
                    adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    reviewDate="2025-01-01T10:00:00Z" // Example ISO 8601 date string
                    />
                    {/* Add more reviews here */}
            </div>
            <button className="mt-3 text-green" onClick={()=>router.push('/property/reviews')}>
              View all reviews
            </button>
          </div>

          {/* Nearby Properties */}
          <div className="px-5 mt-10">
                  <h2 className="text-lg font-bold mb-3">Nearby From this Location</h2>
                  <div className="flex space-x-3">
                    {/* Property Card */}
                    <div className="grid grid-cols-2 w-full space-x-3 ">
                      {mockProperties.slice(0,2).map(((info, key)=>(
                        <VerticalCard
                          id={info._id}
                          name={info.title} 
                          price={formatPrice(30)} 
                          type="" 
                          address={info.address} 
                          image={info.banner} 
                          period={info.period? info.period : ""} 
                          rating={20}
                          key={key}
                        />
                      )))}
                    </div>
                        
                    {/* Add more cards here */}
                  </div>
          </div>

          {/* Location popup */}
          <Popup header="Location Distance" 
            toggle={togglePopup} 
            setToggle={setTogglePopup} 
            useMask={true}
          >     
            <div>
              <div className="h-[80%] overflow-y-auto">
                {locations.map((location, index) => (
                  <div
                    key={index}
                    className="rounded-full p-4 border border-[#DCDFD9] my-4 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleLocationSelect(location)}
                    >
                      <div className="flex items-center">
                        <button className="card-bg rounded-full p-3 mr-2" disabled>
                            <HiOutlineLocationMarker />
                        </button>
                        <p className="text-gray-500">
                            <span className="font-bold">{location.distance} </span>
                            {location.address}
                        </p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </Popup> 

          {/* Buy popup */}
          <Popup header="Buy" 
            toggle={buyPopup} 
            setToggle={setBuyPopup} 
            useMask={true}
          >     
            <div>
              <div className="h-[80%] overflow-y-auto mt-5">
                <div className="space-y-4 divide-1">
                  <div className="flex">
                    <p>Delivery Method</p>
                    <IoIosArrowForward className="ms-auto" />
                  </div>                
                </div> 
              </div>
            </div>
          </Popup>
          </div>
        } 
      </div>
    );
};

export default PropertyDetail;
