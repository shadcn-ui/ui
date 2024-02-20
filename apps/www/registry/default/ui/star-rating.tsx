import * as React from "react"

import StarRating from "../example/star-rating"

export default function StarRatingDefault() {
  const [value, setValue] = React.useState<number>(3)
  return <StarRating value={value} setValue={setValue} />
}
