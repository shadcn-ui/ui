import * as React from "react"
import { StarRating } from "@/registry/new-york/ui/star-rating"


export default function StarRatingDemo() {
  const [value, setValue] = React.useState<number>(3)
  return (<StarRating value={value} setValue={setValue} />)
}
