import { Bold, Italic, Redo, Underline, Undo } from "lucide-react"

import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/registry/new-york-v4/ui/toolbar"

export default function ToolbarBasic() {
  return (
    <Toolbar aria-label="Text formatting options">
      <ToolbarGroup aria-label="Formatting tools">
        <ToolbarButton
          variant="outline"
          size="icon-sm"
          aria-label="Bold"
          tooltip="Bold"
        >
          <Bold />
        </ToolbarButton>
        <ToolbarButton
          variant="outline"
          size="icon-sm"
          aria-label="Italic"
          tooltip="Italic"
        >
          <Italic />
        </ToolbarButton>
        <ToolbarButton
          variant="outline"
          size="icon-sm"
          aria-label="Underline"
          tooltip="Underline"
        >
          <Underline />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator aria-hidden="true" />
      <ToolbarGroup aria-label="History actions">
        <ToolbarButton
          variant="outline"
          size="icon-sm"
          aria-label="Undo"
          tooltip="Undo"
        >
          <Undo />
        </ToolbarButton>
        <ToolbarButton
          variant="outline"
          size="icon-sm"
          tooltip="Redo"
          aria-label="Redo"
        >
          <Redo />
        </ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  )
}
