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

export const Button = (isLoqding)=> {
    const router = useRouter();

    return (
        <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
            {isLoqding ? 
                <span className='flex items-center justify-center'><ImSpinner2 className="animate-spin mr-2 ml-1" /> {/* Spinner Icon */}
                    Login...
                </span> : "Login"
            }
        </button>
    )
}