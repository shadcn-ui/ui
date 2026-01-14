import { Toggle } from "@/examples/base/ui/toggle"
import { BookmarkIcon } from "lucide-react"

export function ToggleWithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle aria-label="Toggle bookmark" defaultPressed>
        <BookmarkIcon className="group-data-[state=on]/toggle:fill-accent-foreground" />
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle bookmark outline">
        <BookmarkIcon className="group-data-[state=on]/toggle:fill-accent-foreground" />
        Bookmark
      </Toggle>
    </div>
  )
}
