import Footer from "@/components/shared/Footer"
import { styles } from "@/constant"
import Image from "next/image"
import { FaArrowRight, FaHome } from "react-icons/fa"

const NotFound = () => {
    return (
        <>
        <div className="flex flex-col justify-between min-h-screen items-center bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400">
            <div className="mb-auto font-Kufam w-full mt-7">
                <div className="flex justify-center text-[#B16642] mb-3">                    
                    <span className="flex font-bold text-sm items-center bg-[#F3D1C1] p-2"><FaHome className="mr-1" />404</span>
                </div>
                <h1 className="text-4xl text-center">Error</h1>
            </div>

            <div>
                <div className="w-full h-full flex items-center mb-5">
                    <Image src={'/error-banner.png'} alt="error banner" width={300} height={150} className="w-full sm:h-[150px] sm:w-auto mx-auto "/>
                </div>
                <h1 className="text-4xl text-center">Page Not Found</h1>
            </div>

            <button className={`${styles.GRAYBUTTON} flex items-center rounded-lg bg-white mx-auto mt-auto mb-28`}>
                Go to Home <div className="p-2 bg-[#F3D1C1] ms-1 text-white rounded-full"><FaArrowRight className="text-xs"/></div>
            </button>                   
        </div>
        <Footer />     
        </>
    )
}

export default NotFound