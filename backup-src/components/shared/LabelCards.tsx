import { BackButton } from "./buttons"

export const ScreenName = ({title}: {title:string}) => {
  return (
    <header className="p-4 flex w-full mb-4 sticky top-0 z-50 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300">
      <BackButton />
      <h2 className="text-center w-full font-semibold">{title}</h2>
    </header>
  )
}