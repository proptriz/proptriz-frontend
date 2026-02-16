"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { SlMenu } from "react-icons/sl";
import Popup from "./Popup";
import { AppContext } from "@/context/AppContextProvider";

const menuItems = [
    {title: 'Edit profile', link: '/profile/edit'},
    {title: 'Become an agent', link: '/profile/become-agent'},
    {title: 'List new property', link: '/property/add'},
    {title: ' Privacy policy ', link: '/privacy-policy'},
    {title: 'Terms of service', link: '/terms-of-service'},
    {title: 'FAQ', link: '/profile/faq'},
  ];

const Header: React.FC = () => {
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const {authUser} = useContext(AppContext);


  return (
    <>
    <header className="sticky top-0 z-20 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 border-b border-black/5">
      <div className="h-14 px-4 flex items-center justify-between">
        {/* Logo + Brand */}
        <Link href="/" aria-label="Home" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Proptriz"
            width={104}
            height={64}
            priority
            fetchPriority="high"
            className="h-9 w-auto object-contain"
          />

          <div className="text-base text-2xl font-bold tracking-wide text-gray-900">
            ropTriz
          </div>
        </Link>

        {/* Menu */}
        <button
          type="button"
          onClick={() => setShowSettingsMenu(!showSettingsMenu)}
          className="text-gray-600 text-xl p-2 rounded-full hover:bg-black/5 active:scale-95 transition"
          aria-label="Open menu"
        >
          <SlMenu />
        </button>
      </div>
    </header>

    {/* User Admin Popup */}
        <Popup
          header=""
          toggle={showSettingsMenu}
          setToggle={setShowSettingsMenu}
          useMask={true}
          hideReset={true}
        >
          <div className="bg-white rounded-lg overflow-hidden shadow-sm w-full max-w-md mx-auto">
            {/* Menu */}
            <div>
              <div className="flex flex-col items-center mb-2">
                <div className="bg-white w-32 h-32 rounded-full p-1 mt-4">
                  <Image
                    src={authUser?.avatar || "/logo.png"}
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
              <h2 className="font-bold text-2xl text-center">{authUser?.display_name || ""}</h2>
              <p className="text-gray-500 mb-3 text-center">{authUser?.primary_email || ""}</p>
            </div>
    
            <nav role="menu" aria-label="User settings" className="divide-y">
              <ul className="px-2 py-2 space-y-1">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.link}
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => setShowSettingsMenu(false)}
                      className="block w-full text-left px-3 py-2 rounded-md text-primary shadow-sm hover:bg-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-500 transition"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
    
              {/* Actions */}
              <div className="px-3 py-3 bg-gray-50 flex items-center gap-3 justify-end">   
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
        </>
  );
};

export default Header;