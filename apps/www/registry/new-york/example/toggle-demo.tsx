import { Toggle } from "@/registry/new-york/ui/toggle"
import { Bold } from "lucide-react"

export default function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle italic">
      <Bold className="h-4 w-4" />
    </Toggle>
  )
}
