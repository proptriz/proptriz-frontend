import formatPrice from "@/utils/formatPrice"
import { CURRENCY_SYMBOL, CurrencyEnum } from "@/types/property"

const Price = ({price, currency, tenancyPeriod="", }: {price: number, currency?: CurrencyEnum, tenancyPeriod?: string,}) => {
  return (
    <div className="" >                  
      <p className="text-2xl text-right font-semibold text-primary flex items-center">
        <span className="">
          {CURRENCY_SYMBOL[currency as CurrencyEnum] ?? ""}
        </span>
        { formatPrice(price) }
      </p>
      <p className="text-gray-700 text-sm text-right"> { tenancyPeriod}</p>
    </div> 
  )
}

export default Price