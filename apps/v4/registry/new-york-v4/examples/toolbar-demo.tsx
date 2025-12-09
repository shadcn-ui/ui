import React from "react"
import { Folder, Home, Search, Settings, Terminal, Trash2 } from "lucide-react"

import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/registry/new-york-v4/ui/toolbar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"

function MacLikeDock({ ...props }: React.ComponentProps<typeof Toolbar>) {
  return (
    <Toolbar aria-label="Dock" {...props}>
      <ToolbarGroup className="flex items-end gap-3">
        <ToolbarButton
          tooltip="Home"
          aria-label="Home"
          size="icon"
          variant="ghost"
        >
          <Home />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Search"
          aria-label="Search"
          size="icon"
          variant="ghost"
        >
          <Search />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Files"
          aria-label="Files"
          size="icon"
          variant="ghost"
        >
          <Folder />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Terminal"
          aria-label="Terminal"
          size="icon"
          variant="ghost"
        >
          <Terminal />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolbarButton
          tooltip="Settings"
          aria-label="Settings"
          size="icon"
          variant="ghost"
        >
          <Settings />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Trash"
          aria-label="Trash"
          size="icon"
          variant="ghost"
        >
          <Trash2 />
        </ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  )
}

export default function ToolbarDemo() {
  return (
    <TooltipProvider>
      <div className="flex flex-col items-center justify-center gap-4">
        <MacLikeDock />
        <MacLikeDock size="sm" variant="secondary" />
      </div>
    </TooltipProvider>
  )
}
