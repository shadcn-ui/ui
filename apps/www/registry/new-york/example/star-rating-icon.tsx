import * as React from "react"
import { StarRating } from "@/registry/new-york/ui/star-rating"
import { Heart } from "lucide-react"

export default function StarRatingIcon() {
  const [value, setValue] = React.useState<number>(3)
  return <StarRating value={value} setValue={setValue} icon={Heart} />
}
