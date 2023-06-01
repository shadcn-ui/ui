import { Toggle } from "@/registry/new-york/ui/toggle"
import { Underline } from "lucide-react"

export default function ToggleDisabled() {
  return (
    <Toggle aria-label="Toggle italic" disabled>
      <Underline className="h-4 w-4" />
    </Toggle>
  )
}
