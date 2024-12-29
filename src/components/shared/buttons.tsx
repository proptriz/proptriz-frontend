'use client';

import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { IoChevronBack } from "react-icons/io5";



export const BackButton = ()=> {
    const router = useRouter();

    return (
        <button className="top-5 left-0 text-xl" onClick={()=>router.back()}>
            <FaArrowLeft className="text-xl" />
        </button>
    )
}