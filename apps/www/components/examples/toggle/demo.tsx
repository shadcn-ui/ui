import { Toggle } from "@/registry/default/ui/toggle"
import { Bold } from "lucide-react"

export function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle italic">
      <Bold className="h-4 w-4" />
    </Toggle>
  )
}
