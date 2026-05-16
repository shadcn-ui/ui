import { BookmarkIcon, HeartIcon, StarIcon } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/new-york-v4/ui/toggle-group"

export default function ToggleGroupSpacing() {
  return (
    <ToggleGroup type="multiple" variant="outline" spacing={2} size="sm">
      <ToggleGroupItem
        value="star"
        aria-label="Toggle star"
        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500"
      >
        <StarIcon />
        Star
      </ToggleGroupItem>
      <ToggleGroupItem
        value="heart"
        aria-label="Toggle heart"
        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
      >
        <HeartIcon />
        Heart
      </ToggleGroupItem>
      <ToggleGroupItem
        value="bookmark"
        aria-label="Toggle bookmark"
        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
      >
        <BookmarkIcon />
        Bookmark
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
