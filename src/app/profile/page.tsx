'use client';

import React, { useContext, useEffect, useRef, useState } from "react";
import { BackButton } from "@/components/shared/buttons";
import { VerticalCard } from "@/components/shared/VerticalCard";
import Link from "next/link";
import { IoSettingsOutline } from "react-icons/io5";
import { AppContext } from "../../context/AppContextProvider";
import { CursorResponse, PropertyReviewType, PropertyType, ReviewType, UserSettingsType } from "@/types";
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
import { getPropertyUserReviewApi } from "@/services/reviewApi";
import { useInfiniteCursorScroll } from "@/components/shared/useInfiniteCursorScroll";
import { ReviewCardSkeleton } from "@/components/skeletons/ReviewCardSkeleton";
import { VerticalPropertyCardSkeleton } from "@/components/skeletons/VerticalPropertyCardSkeleton";
import { MdMenu } from "react-icons/md";

export default function ProfileTransaction () {
  const { authUser } = useContext(AppContext);
  const statusCountStyle = 'border-2 border-white py-2 rounded-xl font-[Montserrat]';
  const [showStats, setShowStats] = useState(true);
  const [receivedOrSent, setReceivedOrSent] = useState<string>('Listings');
  const [listedProperties, setListedProperties] = useState<PropertyType[]>([]);
  const [loadingProperties, setLoadingProperties] = useState<boolean>(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [userSettings, setUserSettings] = useState<UserSettingsType | null>(null);
  const [isReplyPop, setIsReplyPop] = useState<boolean>(false);
  const [isConfirmPop, setIsConfirmPop] = useState<boolean>(false);
  const [replyReview, setReplyReview] = useState<ReviewType | null>(null);
  // const [sentReviews, setSentReviews] = useState<ReviewType[]>([]);
  const [refreshReviews, setRefreshReviews] = useState<boolean>(false);

  const menuItems = [
    {title: 'Edit profile', link: '/profile/edit'},
    {title: 'List new property', link: '/property/add'},
    {title: ' Check reviews ', link: '/property/edit'},
    {title: 'Become an Agent', link: '/profile/become-agent'},
    {title: 'FAQ', link: '/profile/faq'},
  ];

  useEffect(() => {
    const onScroll = () => {
      setShowStats(window.scrollY <= 20); // only show near top
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  
  // Load user Settings
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

  // Load properties
  useEffect(() => {
    if (!authUser || loadingProperties) return;

    setLoadingProperties(true);

    const fetchListedProp = async () => {      
      try {
      const properties = await getUserListedProp();

      setListedProperties(properties);
      } catch (error) {
        logger.error("❌ Error fetching listed properties:", error);
      } finally {
        setLoadingProperties(false)
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

  const showReply = (review: ReviewType)=>{
    setIsReplyPop(!isReplyPop)
    setReplyReview(review)
  }

  // Sent Reviews lazy loading
  const {
    items: sentReviews,
    loading: loadingsSent,
    hasMore: hasMoreSent,
    setObserverTarget
  } = useInfiniteCursorScroll({
    fetcher: async (cursor, signal): Promise<CursorResponse<PropertyReviewType>> => {
      const res = await getPropertyUserReviewApi(
        { sentCursor: cursor },
        { signal }
      );

      if (!res) {
        return {
          items: [],
          nextCursor: null
        };
      }

      return {
        items: res.sent.reviews,
        nextCursor: res.sent.nextCursor
      };
    },
    
    enabled: true,
    isAuthRequired: true
  });

  //Received Reviews lazy loading
  const {
    items: receivedReviews,
    loading: loadingReceived,
    hasMore: hasMoreReceived,
    setObserverTarget: setReceivedObserverTarget
  } = useInfiniteCursorScroll({
    fetcher: async (cursor, signal): Promise<CursorResponse<PropertyReviewType>> => {
      const res = await getPropertyUserReviewApi(
        { receivedCursor: cursor },
        { signal }
      );

      if (!res) {
        return {
          items: [],
          nextCursor: null
        };
      }

      return {
        items: res.received.reviews,
        nextCursor: res.received.nextCursor
      };
    },
    enabled: true,
    isAuthRequired: true

  });

  if (!authUser) {
    return <Splash showFooter={true} />;
  }

  return (
  <>
    <div className="px-6 pb-24">
      <header
        className="fixed top-0 left-0 right-0 z-50 md:max-w-[650px] mx-auto bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <BackButton />

          <h1 className="text-xl font-bold truncate">
            {userSettings?.brand || authUser?.username || "Profile"}
          </h1>

          <button
            className="flex items-center gap-2 p-2 rounded-full"
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
          >
            <div className="bg-white w-10 h-10 rounded-full p-0.5">
              <Image
                src={userSettings?.image || "/logo.png"}
                height={40}
                width={40}
                alt="profile"
                className="rounded-full w-full h-full object-cover"
              />
            </div>

            <MdMenu size={22} />
          </button>
        </div>

        {/* Status count — COLLAPSING */}
        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
            showStats ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-3 shadow-md">
            <div className="grid grid-cols-3 gap-6 text-center shadow-sm rounded-lg p-3">
              <div className={statusCountStyle}>
                <p className="font-bold">{22}</p>
                <p className="text-gray-500 text-sm">Properties</p>
              </div>

              <div className={statusCountStyle}>
                <p className="font-bold">{4.5}</p>
                <p className="text-gray-500 text-sm">Ratings</p>
              </div>

              <div className={statusCountStyle}>
                <p className="font-bold">{25}</p>
                <p className="text-gray-500 text-sm">Reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs & action */}
        <div className="px-6 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium">
              <span className="font-bold mr-1">
                {receivedOrSent === "Listings"
                  ? listedProperties.length
                  : receivedOrSent === "receivedReviews"
                  ? receivedReviews.length
                  : sentReviews.length}
              </span>
              {receivedOrSent}
            </p>

            <Link
              href="/property/add"
              className="text-sm bg-primary text-white px-3 py-2 rounded-md shadow"
            >
              Add Property
            </Link>
          </div>

          {/* Toggle */}
          <div className="flex bg-gray-200 rounded-full p-1">
            {["Listings", "receivedReviews", "sentReviews"].map(tab => (
              <button
                key={tab}
                onClick={() => setReceivedOrSent(tab as any)}
                className={`flex-1 py-2 rounded-full text-sm transition ${
                  receivedOrSent === tab
                    ? "bg-white text-primary font-medium"
                    : "text-gray-600"
                }`}
              >
                {tab === "Listings"
                  ? "Listings"
                  : tab === "receivedReviews"
                  ? "Received"
                  : "Sent"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="h-[300px]" />
      {/* Listed Property  */}
      {receivedOrSent==='Listings' &&  <section>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listedProperties.map((item: any, index) => (
            <div
              key={index}
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
                rating={item.average_rating}
                expired={new Date(item.expired_by) < new Date()}
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

          {loadingProperties &&
            Array.from({ length: 6 }).map((_, i) => (
              <VerticalPropertyCardSkeleton key={i} />
            ))
          }
        </div>
      </section>}
      
      {/* User properties Reviews */}
      {receivedOrSent==='receivedReviews' && <section>
        <div className="space-y-4">
          <div className="flex items-center justify-between m-4">
            <p className="text-lg mb-4 font-[Raleway]">
              <span className="font-bold mr-1">
                {receivedReviews.length}
              </span> 
              Reviews
            </p>
          </div>

          {receivedReviews.length===0 && (
            <p className="text-gray-500 m-4">No reviews yet.</p>
          )}
          
          <div className="space-y-6 px-4">
            {receivedReviews.map((review: any, index: number) => {
              const isLast = index === receivedReviews.length - 1;

              return (
                <div
                  key={review._id}
                  ref={isLast ? setReceivedObserverTarget : undefined}
                >
                  <ReviewCard
                    review={review}
                    showReply={showReply}
                    showPropDetails={true}
                  />
                </div> 
              )             
            })}
          </div>
          
          {loadingReceived &&
            Array.from({ length: 2 }).map((_, i) => (
              <ReviewCardSkeleton key={i} showPropDetails />
            ))
          }

          {!hasMoreReceived && <p>No more reviews</p>}
        </div>
      </section>}
      
      {/* User sent reviews  */}
      {receivedOrSent==='sentReviews' && <section>
        <div className="flex items-center justify-between m-4">
          <p className="text-lg mb-4 font-[Raleway]">
            <span className="font-bold mr-1">
              {sentReviews.length}
            </span> 
            Reviews
          </p>
        </div>

        {sentReviews.length===0 && (
          <p className="text-gray-500 m-4">No reviews yet.</p>
        )}

        <div className="space-y-6 px-4">
          {sentReviews.map((review: any, index: number) => {
              const isLast = index === sentReviews.length - 1;

            return (
              <div
                key={review._id}
                ref={isLast ? setObserverTarget : undefined}
              >
                <ReviewCard
                  review={review}
                  showReply={showReply}
                  showPropDetails={true}
                />                
              </div> 
            )             
          })}

          {loadingsSent &&
            Array.from({ length: 2 }).map((_, i) => (
              <ReviewCardSkeleton key={i} showPropDetails />
            ))
          }
          
          {!hasMoreSent && <p>No more reviews</p>}
        </div>
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
    {replyReview && <Popup
      header="Reply Review"
      toggle={isReplyPop}
      setToggle={setIsReplyPop}
      useMask={true}
      hideReset={true}
    >
      <ReplyReview review={replyReview} />
    </Popup>}

    <Popup
      header="Confirm Delete"
      toggle={isConfirmPop}
      setToggle={setIsConfirmPop}
      useMask={true}
      hideReset={true}
    >
      <div>
        <button>Close</button>
        <button className="bg-red">Confirm</button>
      </div>
    </Popup>
  </>
  
);
};

