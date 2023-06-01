import { Toggle } from "@/registry/default/ui/toggle"
import { Italic } from "lucide-react"

export function ToggleSm() {
  return (
    <Toggle size="sm" aria-label="Toggle italic">
      <Italic className="h-4 w-4" />
    </Toggle>
  )
}
