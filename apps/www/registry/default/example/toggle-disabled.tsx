import { Underline } from "lucide-react"

import { Toggle } from "@/registry/default/ui/toggle"

export default function ToggleDisabled() {
  return (
    <Toggle aria-label="Toggle underline" disabled>
      <Underline className="size-4" />
    </Toggle>
  )
}
