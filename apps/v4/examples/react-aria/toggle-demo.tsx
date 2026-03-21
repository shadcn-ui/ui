import { Toggle } from "@/examples/react-aria/ui/toggle"
import { BookmarkIcon } from "lucide-react"

export function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bookmark" size="sm" variant="outline">
      <BookmarkIcon className="group-aria-pressed/toggle:fill-foreground" />
      Bookmark
    </Toggle>
  )
}
