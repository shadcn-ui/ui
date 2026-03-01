"use client"

import { Rating } from "@/registry/new-york-v4/ui/rating"

export default function RatingSizes() {
  return (
    <div className="flex items-center gap-4">
      <Rating defaultValue={3} size="sm" />
      <Rating defaultValue={3} />
      <Rating defaultValue={3} size="lg" />
    </div>
  )
}
