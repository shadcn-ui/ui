import { Heart } from "lucide-react"

import Ratings from "../ui/ratings"

export default function RatingsVariants() {
  return (
    <div className="flex flex-col gap-6 items-center justify-center">
      <Ratings value={1.5} />
      <Ratings value={2} variant="destructive" Icon={<Heart />} />
      <Ratings value={2.5} variant="yellow" totalStars={8} />
    </div>
  )
}
