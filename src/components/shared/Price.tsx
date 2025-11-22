import { LuPi } from "react-icons/lu"
import formatPrice from "@/utils/formatPrice"
import { CurrencyEnum } from "@/types"

const Price = ({price, currency, tenancyPeriod="", }: {price: number, currency?: CurrencyEnum, tenancyPeriod?: string,}) => {
  return (
    <div className="" >                  
      <p className="text-2xl text-right font-semibold text-primary flex items-center">
        <span className="text-sm">{currency}</span>{ formatPrice(price) }
      </p>
      <p className="text-gray-600 text-sm text-right"> { tenancyPeriod}</p>
    </div> 
  )
}

export default Price