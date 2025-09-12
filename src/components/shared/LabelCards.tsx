import { BackButton } from "./buttons"

export const ScreenName = ({title}: {title:string}) => {
  return (
    <header className="p-4 flex w-full mb-4 sticky top-0 bg-background z-50">
      <BackButton />
      <h2 className="text-center w-full font-semibold">{title}</h2>
    </header>
  )
}