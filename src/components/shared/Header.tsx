import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SlMenu } from "react-icons/sl";

const Header: React.FC = () => {
  return (
    <>
    <header className="p-6 flex justify-between items-center w-full z-50 shadow-md">        
        <div className={`nav_item disabled`}>
          <Link href="/" aria-label="Home" >
            <Image src="/logo.png" alt="proptriz" width={104} height={64} />
          </Link>
        </div>

        <div className="text-xl font-bold">
          ropTriz
        </div>

        {/* Menu icon*/}
        <div className="ml-auto">           
          <button className="text-gray-500 text-xl "><SlMenu /></button>
        </div>
      </header>
    </>
  );
};

export default Header;
