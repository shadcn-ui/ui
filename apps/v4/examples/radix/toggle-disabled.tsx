import { Toggle } from "@/examples/radix/ui/toggle"
import { Underline } from "lucide-react"

export function ToggleDisabled() {
  return (
    <Toggle aria-label="Toggle italic" disabled>
      <Underline className="h-4 w-4" />
    </Toggle>
  )
}
