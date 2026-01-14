import { ToggleGroup, ToggleGroupItem } from "@/examples/radix/ui/toggle-group"
import { BookmarkIcon, HeartIcon, StarIcon } from "lucide-react"

export function ToggleGroupWithIcons() {
  return (
    <ToggleGroup type="multiple" variant="outline" spacing={1} size="sm">
      <ToggleGroupItem
        value="star"
        aria-label="Toggle star"
        className="aria-pressed:*:[svg]:fill-foreground aria-pressed:*:[svg]:stroke-foregfill-foreground aria-pressed:bg-transparent"
      >
        <StarIcon />
        Star
      </ToggleGroupItem>
      <ToggleGroupItem
        value="heart"
        aria-label="Toggle heart"
        className="aria-pressed:*:[svg]:fill-foreground aria-pressed:*:[svg]:stroke-foreground aria-pressed:bg-transparent"
      >
        <HeartIcon />
        Heart
      </ToggleGroupItem>
      <ToggleGroupItem
        value="bookmark"
        aria-label="Toggle bookmark"
        className="aria-pressed:*:[svg]:fill-foreground aria-pressed:*:[svg]:stroke-foreground aria-pressed:bg-transparent"
      >
        <BookmarkIcon />
        Bookmark
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
