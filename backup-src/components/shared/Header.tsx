import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SlMenu } from "react-icons/sl";

const Header: React.FC = () => {
  return (
    <>
      <header className="px-5 py-3 flex justify-between items-center w-full z-50 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300">        
        <div className={`nav_item disabled`}>
          <Link href="/" aria-label="Home" >
            <Image src="/logo.png" alt="proptriz" width={104} height={64} />
          </Link>
        </div>

        <div className="text-xl font-bold">
          ropTriz
        </div>

        {/* Menu icon*/}
        <button className="text-gray-500 text-xl ml-auto "><SlMenu /></button>
      </header>
    </>
  );
};

export default Header;
