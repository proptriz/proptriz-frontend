'use client';

import React, { useContext, useEffect, useState } from "react";
import { BackButton } from "@/components/shared/buttons";
import { VerticalCard } from "@/components/shared/VerticalCard";
import { agent } from "@/constant";
import Link from "next/link";
import { IoSettingsOutline } from "react-icons/io5";
import { AppContext } from "../../context/AppContextProvider";
import { PropertyType, UserSettingsType } from "@/types";
import { deleteUserProperty, getUserListedProp } from "@/services/propertyApi";
import logger from "../../../logger.config.mjs"
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Popup from "@/components/shared/Popup";
import { getUserSettings } from "@/services/settingsApi";
import Image from "next/image";
import { ReviewCard } from "@/components/shared/Cards";
import Splash from "@/components/shared/Splash";
import ReplyReview from "@/components/ReplyReview";

export default function ProfileTransaction () {
  const { authUser } = useContext(AppContext);
  const statusCountStyle = 'border-2 border-white py-4 rounded-xl font-[Montserrat]'
  const [listOrSold, setListOrSold] = useState<string>('Listings');
  const [listedProperties, setListedProperties] = useState<PropertyType[]>([]);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [userSettings, setUserSettings] = useState<UserSettingsType | null>(null);
  const [isReplyPop, setIsReplyPop] = useState<boolean>(false);
  const [replyId, setReplyId] = useState<string>('');

  const menuItems = [
    {title: 'Edit profile', link: '/profile/edit'},
    {title: 'List new property', link: '/property/add'},
    {title: ' Check reviews ', link: '/property/edit'},
    {title: 'Become an Agent', link: '/profile/become-agent'},
    {title: 'FAQ', link: '/profile/faq'},
  ];
  
  useEffect(() => {
    if (!authUser) return;
    
    // Fetch existing user settings if needed
    const fetchUserSettings = async () => {
      try {
        // fetching user settings logic
        const settings = await getUserSettings();
        if (!settings) {
          logger.warn("unable to fetch user settings")
          return;
        }

        setUserSettings(settings);          

      } catch (err) {
        logger.error('Error fetching user settings', err);
      }
    };

    if (authUser) {
      fetchUserSettings();
    }
  }, [authUser]);

  useEffect(() => {
    if (!authUser) return;

    const fetchListedProp = async () => {
      try {
      const properties = await getUserListedProp();
      setListedProperties(properties);
      } catch (error) {
        logger.error("❌ Error fetching listed properties:", error);
      }
    }
    fetchListedProp()
  }, [authUser])

  const handleDelete = async (id: string) => {
    const res = await deleteUserProperty(id);
    if (!res.success) {
      logger.error("Error deleting property:", res.message);
      toast.error("Failed to delete property");
      return;
    }
    const updatedProperties = listedProperties.filter(prop => prop.id !== id);
    setListedProperties(updatedProperties);
    toast.success("Property deleted successfully");
    return
  };

  const showReply = (id:string)=>{
    setIsReplyPop(!isReplyPop)
    setReplyId(id)
  }

  if (!authUser) {
    return <Splash />;
  }

  return (
  <>
    <div className="p-6 pb-24 relative">
      <div className="flex items-center justify-between">
        <BackButton />            
        <h1 className="text-2xl font-bold 2xl">Profile</h1>
        <button className="top-5 left-5 px-4 py-4 text-xl rounded-full" 
        onClick={()=>setShowSettingsMenu(!showSettingsMenu)}>
          <IoSettingsOutline />
        </button> 
                  
      </div>
              
      <div className="mb-4 text-center">
        <div className="flex flex-col items-center mb-2">
          <div className="bg-white w-32 h-32 rounded-full p-1 mt-4">
            <Image
              src={userSettings?.image || "/logo.png"}
              height={32}
              width={32}
              alt="profile"
              className="rounded-full w-full h-full object-cover"
            />                    
          </div>                    
          <div className="-mt-4 ml-12">
            <span className="bg-green text-white text-xs px-2 py-1 rounded-full">
              #1
            </span>
          </div>
        </div>
        <h2 className="font-bold text-2xl">{userSettings?.brand || authUser?.username}</h2>
        <p className="text-gray-500 mb-3">{userSettings?.email}</p>

        {/* Count Status */}
        <div className="grid grid-cols-3 space-x-6 text-center mb-2">
          <div className={statusCountStyle}>
              <p className="font-bold">{agent.rating}</p>
              <p className="text-gray-500 ">Rating</p>
          </div>
          <Link href={'/profile/reviews'} >
            <div className={statusCountStyle}>
              <p className="font-bold">{agent.reviews}</p>
              <p className="text-gray-500">Reviews</p>
            </div>
          </Link>
          <div className={statusCountStyle}>
            <p className="font-bold">{agent.sold}</p>
            <p className="text-gray-500">Sold</p>
          </div>
        </div>
      </div>

      {/* List or Sold Toggle button */}
      <div className="flex bg-gray-200 rounded-full shadow-lg text-white mb-2 p-4 space-x-4">
        <button className={`w-full py-1 rounded-full text-gray-600 text-center text-sm ${listOrSold==='Listings'? 'bg-white text-[#61AF74]' : '' }`}
          onClick={()=>setListOrSold('Listings')}
        >
          Listings
        </button>
        <button className={`w-full py-2 rounded-full text-gray-600 text-center text-sm ${listOrSold==='Reviews'? 'bg-white text-[#61AF74]' : '' }`}
          onClick={()=>setListOrSold('Reviews')}
        >
          Reviews
        </button>                
        <button className={`w-full py-2 rounded-full text-gray-600 text-center text-sm ${listOrSold==='Inbox'? 'bg-white text-[#61AF74]' : '' }`}
          onClick={()=>setListOrSold('Inbox')}
        >
          Inbox
        </button>                
      </div>

      {/* Listed Property  */}
      {listOrSold==='Listings' &&  <section>
        <div className="flex items-center justify-between m-4">
          <p className="text-lg mb-4 font-[Raleway]">
            <span className="font-bold mr-1">
              {listedProperties.length}
            </span> 
            {listOrSold}
          </p>
          {listOrSold==='Listings' && (<Link href="/property/add">
            <button className="w-10 h-10 rounded-full bg-primary text-white text-2xl">+</button>
          </Link>)}
        </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listedProperties.map((item: any) => (
          <div
            key={item.id}
            className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {/* Property Card */}
            <VerticalCard
              id={item.id}
              name={item.title}
              price={item.price}
              currency={item.currency}
              category={item.category || ""}
              address={item.address}
              image={item.banner}
              period={item.period || ""}
              listed_for={item.listed_for || ""}
              rating={20}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex items-center gap-4 bg-white/90 rounded-full px-5 py-3 shadow-lg backdrop-blur-md">
                {/* Preview */}
                <Link
                  href={`/property/details/${item.id}`}
                  aria-label="Preview Property"
                  className="p-3 rounded-full text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-all duration-200"
                >
                  <FaEye size={18} />
                </Link>

                {/* Edit */}
                <Link
                href={`/property/edit/${item.id}`}
                aria-label="Edit Property"
                className="p-3 rounded-full text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-all duration-200"
                >
                  <FaEdit size={18} />
                </Link>

                {/* Delete */}
                <button
                  aria-label="Delete Property"
                  onClick={() => handleDelete(item.id)}
                  className="p-3 rounded-full text-red-600 hover:bg-gray-100 hover:text-red-700 transition-all duration-200"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          </div>
          ))}
          </div>
      </section>}
      
      {/* Review List  */}
      {listOrSold==='Reviews' && <section>
        <div className="space-y-4">
          <div className="flex items-center justify-between m-4">
            <p className="text-lg mb-4 font-[Raleway]">
              <span className="font-bold mr-1">
                {listedProperties.length}
              </span> 
              {listOrSold}
            </p>
          </div>
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
              showReply={showReply}
            />
            {/* <button onClick={() => setShowReply(!showReply)}>reply</button> */}
            <ReviewCard
              review={{
                id:'02', 
                reviewer:"Kurt Mullins", 
                image:"/avatar.png", 
                ratings:4.0,
                text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                review_date:"2025-01-01T10:00:00Z", // Example ISO 8601 date string
                replies_count: 3,
                review_images: [],
              }}
              showReply={showReply}
          />
            <ReviewCard 
              review={{
                id:'02', 
                reviewer:"Kurt Mullins", 
                image:"/avatar.png", 
                ratings:4.0,
                review_date:"2025-01-01T10:00:00Z",
                replies_count: 3,
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                review_images: [
                  "/apartment.png",
                  "/home/building3.png",
                  "/home/building4.png",
                  "/home/house-with-pool.png"
                ]
              }}
              showReply={showReply}
            />
      
          {/* Add more reviews here */}
        </div>
      </section>}
      
      {/* Inbox List  */}
      {listOrSold==='Inbox' && <section>
        <div className="flex items-center justify-between m-4">
          <p className="text-lg mb-4 font-[Raleway]">
            <span className="font-bold mr-1">
              {listedProperties.length}
            </span> 
            {listOrSold}
          </p>
        </div>
        {/* Reviews */}
      </section>}
    </div>

    {/* User Admin Popup */}
    <Popup
      header="User Administration"
      toggle={showSettingsMenu}
      setToggle={setShowSettingsMenu}
      useMask={true}
      hideReset={true}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-sm w-full max-w-md">
        {/* Menu */}
        <nav role="menu" aria-label="User settings" className="divide-y">
          <ul className="px-2 py-2 space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.link}
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => setShowSettingsMenu(false)}
                  className="block w-full text-left px-3 py-2 rounded-md text-primary hover:bg-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-500 transition"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="px-3 py-3 bg-gray-50 flex items-center gap-3 justify-end">
            <Link
              href="/profile/edit"
              onClick={() => setShowSettingsMenu(false)}
              className="px-3 py-2 rounded-md bg-white border text-sm hover:text-white hover:bg-primary"
            >
              Manage account
            </Link>

            <button
              type="button"
              onClick={() => setShowSettingsMenu(false)}
              className="px-3 py-2 rounded-md bg-red-600 text-sm text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Close
            </button>
          </div>
        </nav>
      </div>

    </Popup>

    {/* Reply Review Popup */}
    <Popup
      header="Reply Review"
      toggle={isReplyPop}
      setToggle={setIsReplyPop}
      useMask={true}
      hideReset={true}
    >
      <ReplyReview id={replyId} />
    </Popup>
  </>
  
);
};

