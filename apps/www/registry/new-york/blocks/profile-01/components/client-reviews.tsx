import { useMemo, type JSX } from "react"

import { calculateTotalRating, fillStars } from "../lib"

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
  const ratings = useMemo(() => reviews.map(review => review.rating), [reviews]);
  
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-baseline justify-between text-lg font-semibold">
        <h3 className="mb-4">Work History</h3>
        <div className="flex items-center gap-2">
          <span>{calculateTotalRating(ratings)}</span>
          <span className="relative flex items-center gap-1 text-foreground/80">
            {fillStars(3.5)}
          </span>
        </div>
      </div>

      <ul className="grid max-h-[320px] grid-cols-1 gap-2 overflow-y-auto px-4 pb-4">
        {reviews.map((review) => (
          <article key={review.reviewer} className="flex flex-col gap-4 rounded-lg border border-border bg-background p-4">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1"><span className='text-sm font-semibold'>{review.rating}</span> {fillStars(review.rating)}</span>
              <p className="text-base font-semibold">
                {review.reviewer}
              </p>
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
