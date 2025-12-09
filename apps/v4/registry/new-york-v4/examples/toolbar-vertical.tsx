import { Bold, Italic, Underline } from "lucide-react"

import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/registry/new-york-v4/ui/toolbar"

export default function ToolbarVertical() {
  return (
    <Toolbar orientation="vertical" aria-label="Text formatting options">
      <ToolbarGroup>
        <ToolbarButton variant="outline" size="icon-sm" aria-label="Bold">
          <Bold />
        </ToolbarButton>
        <ToolbarButton variant="outline" size="icon-sm" aria-label="Italic">
          <Italic />
        </ToolbarButton>
        <ToolbarButton variant="outline" size="icon-sm" aria-label="Underline">
          <Underline />
        </ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  )
}
