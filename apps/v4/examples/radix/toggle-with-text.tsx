import { Toggle } from "@/examples/radix/ui/toggle"
import { Italic } from "lucide-react"

export function ToggleWithText() {
  return (
    <Toggle aria-label="Toggle italic">
      <Italic />
      Italic
    </Toggle>
  )
}
