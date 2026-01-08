import { Toggle } from "@/examples/base/ui/toggle"
import { Italic } from "lucide-react"

export function ToggleWithText() {
  return (
    <Toggle aria-label="Toggle italic">
      <Italic />
      Italic
    </Toggle>
  )
}
