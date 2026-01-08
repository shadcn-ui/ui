import { Toggle } from "@/examples/radix/ui/toggle"
import { Italic } from "lucide-react"

export function ToggleLg() {
  return (
    <Toggle size="lg" aria-label="Toggle italic">
      <Italic />
    </Toggle>
  )
}
