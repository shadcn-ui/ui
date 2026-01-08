import { Toggle } from "@/examples/base/ui/toggle"
import { Italic } from "lucide-react"

export function ToggleSm() {
  return (
    <Toggle size="sm" aria-label="Toggle italic">
      <Italic />
    </Toggle>
  )
}
