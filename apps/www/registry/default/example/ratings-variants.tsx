import { Heart } from "lucide-react"

import { Ratings } from "@/registry/default/ui/ratings"

export default function RatingsVariants() {
  return (
    <div className="flex flex-col gap-6 items-center justify-center">
      <Ratings rating={1.5} />
      <Ratings rating={2} variant="destructive" Icon={<Heart />} />
      <Ratings rating={2.5} variant="yellow" totalStars={8} />
    </div>
  )
}
