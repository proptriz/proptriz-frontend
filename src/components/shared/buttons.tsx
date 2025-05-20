'use client';

import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { ImSpinner2 } from "react-icons/im";
import { IoChevronBack } from "react-icons/io5";



export const BackButton = ()=> {
    const router = useRouter();

    return (
        <button className="top-0 mb-4 left-0 text-xl" onClick={()=>router.push("/home")}>
            <FaArrowLeft className="text-xl" />
        </button>
    )
}

export const SubmitButton = ({
        isLoading, 
        title,
        status
    }:{
        isLoading: boolean, 
        title: string, 
        status: string
    } )=> {

    return (
        <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
            {isLoading ? 
                <span className='flex items-center justify-center'><ImSpinner2 className="animate-spin mr-2 ml-1" /> {/* Spinner Icon */}
                    {status}
                </span> : title
            }
        </button>
    )
}