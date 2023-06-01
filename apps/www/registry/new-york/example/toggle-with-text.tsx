import { Toggle } from "@/registry/new-york/ui/toggle"
import { Italic } from "lucide-react"

export default function ToggleWithText() {
  return (
    <Toggle aria-label="Toggle italic">
      <Italic className="mr-2 h-4 w-4" />
      Italic
    </Toggle>
  )
}
