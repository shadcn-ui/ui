import React from "react"
import { Heart } from "lucide-react"

import {
  Rating,
  RatingIcon,
  RatingItem,
  RatingLabel,
} from "@/registry/new-york/ui/rating"

const demoData = [
  {
    label: "Poor",
    icon: "😭",
  },

  {
    label: "Bad",
    icon: "😔",
  },
  {
    label: "Not Bad",
    icon: "😁",
  },
  {
    label: "Great",
    icon: "😊",
  },
  {
    label: "Awesome",
    icon: "🤩",
  },
]

const RatingDemo = () => {
  return (
    <div className="grid gap-4">
      <Rating size={30} defaultValue={3} />

      <Rating className="gap-2">
        {demoData.map((_, i) => (
          <RatingItem className="flex flex-col" key={i} value={i + 1}>
            <RatingIcon
              className="text-5xl"
              activeIcon={<Heart size={30} fill="gold" />}
              icon={<Heart size={30} />}
            />
          </RatingItem>
        ))}
      </Rating>

      <Rating name="rating" defaultValue={3} showActive>
        {demoData.map((data, i) => (
          <RatingItem className="flex flex-col" key={i} value={i + 1}>
            <RatingIcon
              activeColor="red"
              className="text-5xl"
              icon={data.icon}
            />
            <RatingLabel>{data.label}</RatingLabel>
          </RatingItem>
        ))}
      </Rating>
    </div>
  )
}

export default RatingDemo
