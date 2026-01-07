import { Italic } from "lucide-react"

import { Toggle } from "@/registry/radix-nova/ui/toggle"

export function ToggleSm() {
  return (
    <Toggle size="sm" aria-label="Toggle italic">
      <Italic />
    </Toggle>
  )
}
