import { ItalicIcon } from "@/examples/material-symbols"

import { Toggle } from "@/styles/base-force-ui/ui/toggle"

export function ToggleText() {
  return (
    <Toggle aria-label="Toggle italic">
      <ItalicIcon />
      Italic
    </Toggle>
  )
}
