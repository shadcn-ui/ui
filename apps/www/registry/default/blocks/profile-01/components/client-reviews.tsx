import { useMemo, type JSX } from "react"

import { Badge } from "@/registry/default/ui/badge"

import { fillStars } from "../lib/fill-stars"

interface ClientReviewsProps {
  reviews: {
    rating: number
    reviewer: string
    roleReviewer: string
    review: string
    date: string
  }[]
}

export default function ClientReviews({
  reviews = [],
}: Readonly<ClientReviewsProps>): JSX.Element {
  const totalRating = useMemo((): number => {
    const totalRatings = reviews.map((review) => review.rating)
    const ratingFixed = totalRatings.map(
      (rating) => Math.round(rating * 10) / 10
    )
    const totalRating =
      ratingFixed.reduce((acc, rating) => acc + rating, 0) / totalRatings.length
    return Math.round(totalRating * 10) / 10
  }, [reviews])

  return (
    <div className="rounded-lg border border-border bg-background py-4 pl-4">
      <div className="flex items-baseline justify-between text-lg font-semibold">
        <h3 className="mb-4">Client Reviews</h3>
        <div className="flex items-center gap-2 pr-4">
          <span>{totalRating}</span>
          <span className="relative flex items-center gap-1 text-foreground/80">
            {fillStars(totalRating)}
          </span>
        </div>
      </div>

      <ul className="grid max-h-[320px] grid-cols-1 gap-2 overflow-y-auto pr-4">
        {reviews.map((review) => (
          <article
            key={review.reviewer}
            className="flex flex-col gap-4 rounded-lg border border-border bg-background p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-base font-semibold">{review.reviewer}</p>
              <Badge>{review.rating}</Badge>
            </div>
            <p className="text-balance text-sm text-foreground/80">
              "{review.review}"
            </p>
            <div className="flex items-center justify-between">
              <small className="text-foreground/60">
                {review.reviewer}, {review.roleReviewer}
              </small>
              <small className="text-foreground/60">{review.date}</small>
            </div>
          </article>
        ))}
      </ul>
    </div>
  )
}
