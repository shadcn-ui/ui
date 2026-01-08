import { Toggle } from "@/examples/base/ui/toggle"
import { Italic } from "lucide-react"

export function ToggleLg() {
  return (
    <Toggle size="lg" aria-label="Toggle italic">
      <Italic />
    </Toggle>
  )
}
