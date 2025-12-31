import { Italic } from "lucide-react"

import { Toggle } from "@/registry/new-york/ui/toggle"

export function ToggleWithText() {
  return (
    <Toggle aria-label="Toggle italic">
      <Italic />
      Italic
    </Toggle>
  )
}
