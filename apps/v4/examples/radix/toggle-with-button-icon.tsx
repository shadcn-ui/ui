import { Button } from "@/examples/radix/ui/button"
import { Toggle } from "@/examples/radix/ui/toggle"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

export function ToggleWithButtonIcon() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon-sm">
          <BoldIcon />
        </Button>
        <Toggle variant="outline" aria-label="Toggle sm icon" size="sm">
          <BoldIcon />
        </Toggle>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon">
          <ItalicIcon />
        </Button>
        <Toggle
          variant="outline"
          aria-label="Toggle default icon"
          size="default"
        >
          <ItalicIcon />
        </Toggle>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon-lg">
          <UnderlineIcon />
        </Button>
        <Toggle variant="outline" aria-label="Toggle lg icon" size="lg">
          <UnderlineIcon />
        </Toggle>
      </div>
    </div>
  )
}
