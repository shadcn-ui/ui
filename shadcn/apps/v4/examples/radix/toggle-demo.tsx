import { Toggle } from "@/examples/radix/ui/toggle"
import { BookmarkIcon } from "lucide-react"

export function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bookmark" size="sm" variant="outline">
      <BookmarkIcon className="group-data-[state=on]/toggle:fill-foreground" />
      Bookmark
    </Toggle>
  )
}
