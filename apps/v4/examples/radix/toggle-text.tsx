import { ItalicIcon } from "lucide-react"

import { Toggle } from "@/styles/radix-nova/ui/toggle"

export function ToggleText() {
  return (
    <Toggle aria-label="Toggle italic">
      <ItalicIcon />
      Italic
    </Toggle>
  )
}
