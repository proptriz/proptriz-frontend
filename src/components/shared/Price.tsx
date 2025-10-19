import { LuPi } from "react-icons/lu"
import formatPrice from "@/utils/formatPrice"

const Price = ({price, tenancyPeriod="", classes=""}: {price: number, tenancyPeriod?: string, classes?: string}) => {
  return (
    <div className="" >                  
      <p className="text-2xl text-right font-semibold text-primary flex items-center">
        <LuPi className="text-lg"/> { formatPrice(price) }
      </p>
      <p className="text-gray-600 text-sm text-right"> { tenancyPeriod}</p>
    </div> 
  )
}

export default Price