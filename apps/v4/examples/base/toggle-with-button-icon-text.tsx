import { Button } from "@/examples/base/ui/button"
import { Toggle } from "@/examples/base/ui/toggle"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

export function ToggleWithButtonIconText() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline">
          <BoldIcon />
          Button
        </Button>
        <Toggle variant="outline" aria-label="Toggle sm icon text" size="sm">
          <BoldIcon />
          Toggle
        </Toggle>
      </div>
      <div className="flex items-center gap-2">
        <Button size="default" variant="outline">
          <ItalicIcon />
          Button
        </Button>
        <Toggle
          variant="outline"
          aria-label="Toggle default icon text"
          size="default"
        >
          <ItalicIcon />
          Toggle
        </Toggle>
      </div>
      <div className="flex items-center gap-2">
        <Button size="lg" variant="outline">
          <UnderlineIcon />
          Button
        </Button>
        <Toggle variant="outline" aria-label="Toggle lg icon text" size="lg">
          <UnderlineIcon />
          Toggle
        </Toggle>
      </div>
    </div>
  )
}
