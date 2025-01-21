import { Star, StarHalf } from "lucide-react"

export const fillStars = (rating: number): JSX.Element[] => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    if (index < Math.floor(rating)) {
      return (
        <Star
          key={index}
          size={16}
          className="fill-foreground"
          strokeWidth={0}
        />
      )
    } else if (index < rating && rating - index >= 0.5) {
      return (
        <span key={index} className="relative">
          <StarHalf size={16} fill="white" strokeWidth={0} />
          <Star
            size={16}
            strokeWidth={0.5}
            fill="transparent"
            className="absolute top-0"
          />
        </span>
      )
    } else {
      return (
        <Star
          key={index}
          size={16}
          strokeWidth={1}
          fill="transparent"
          className="text-foreground/30"
        />
      )
    }
  })

  return stars
}
