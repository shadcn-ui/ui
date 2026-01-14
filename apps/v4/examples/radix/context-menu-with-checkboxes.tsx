"use client"

import * as React from "react"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuTrigger,
} from "@/examples/radix/ui/context-menu"

export function ContextMenuWithCheckboxes() {
  const [showBookmarksBar, setShowBookmarksBar] = React.useState(true)
  const [showFullUrls, setShowFullUrls] = React.useState(false)
  const [showDeveloperTools, setShowDeveloperTools] = React.useState(false)

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuCheckboxItem
            checked={showBookmarksBar}
            onCheckedChange={setShowBookmarksBar}
          >
            Show Bookmarks Bar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={showFullUrls}
            onCheckedChange={setShowFullUrls}
          >
            Show Full URLs
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={showDeveloperTools}
            onCheckedChange={setShowDeveloperTools}
          >
            Show Developer Tools
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}
