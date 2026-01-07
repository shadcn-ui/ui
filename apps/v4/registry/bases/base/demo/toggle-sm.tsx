import { Italic } from "lucide-react"

import { Toggle } from "@/registry/bases/base/ui/toggle"

export function ToggleSm() {
  return (
    <Toggle size="sm" aria-label="Toggle italic">
      <Italic />
    </Toggle>
  )
}
