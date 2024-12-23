'use client';

import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";



export const BackButton = ()=> {
    const router = useRouter();

    return (
        <button className="top-5 left-5 p-4 text-xl card-bg rounded-full shadow-md" onClick={()=>router.back()}>
            <IoChevronBack />
        </button>   
    )
}