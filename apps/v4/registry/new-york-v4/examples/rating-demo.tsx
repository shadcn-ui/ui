"use client"

import * as React from "react"

import { Label } from "@/registry/new-york-v4/ui/label"
import { Rating } from "@/registry/new-york-v4/ui/rating"

export default function RatingDemo() {
  const [value, setValue] = React.useState(4)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Label className="text-muted-foreground w-20 text-sm">Rating</Label>
        <Rating value={value} onValueChange={setValue} />
        <span className="text-muted-foreground text-sm">{value}/5</span>
      </div>
      <div className="flex items-center gap-3">
        <Label className="text-muted-foreground w-20 text-sm">Read only</Label>
        <Rating value={4} readOnly />
      </div>
      <div className="flex items-center gap-3">
        <Label className="text-muted-foreground w-20 text-sm">Disabled</Label>
        <Rating defaultValue={2} disabled />
      </div>
    </div>
  )
}
