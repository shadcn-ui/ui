import { Toggle } from "@/examples/radix/ui/toggle"
import { ItalicIcon } from "lucide-react"

export function ToggleText() {
  return (
    <Toggle aria-label="Toggle italic">
      <ItalicIcon />
      Italic
    </Toggle>
  )
}
