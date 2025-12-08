import { Bold, Italic, Underline } from "lucide-react"

import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from "@/registry/new-york-v4/ui/toolbar"

export default function ToolbarToggle() {
  return (
    <Toolbar aria-label="Text formatting options">
      <ToolbarToggleGroup type="multiple" variant="outline">
        <ToolbarToggleItem value="bold" aria-label="Bold">
          <Bold />
        </ToolbarToggleItem>
        <ToolbarToggleItem value="italic" aria-label="Italic">
          <Italic />
        </ToolbarToggleItem>
        <ToolbarToggleItem value="underline" aria-label="Underline">
          <Underline />
        </ToolbarToggleItem>
      </ToolbarToggleGroup>
    </Toolbar>
  )
}
