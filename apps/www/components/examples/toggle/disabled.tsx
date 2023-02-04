import { Italic } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

export function ToggleDisabled() {
  return (
    <Toggle aria-label="Toggle italic" disabled>
      <Italic className="h-4 w-4" />
    </Toggle>
  )
}
