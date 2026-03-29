"use client";

import {
  ContextMenu,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/examples/react-aria/ui/context-menu"
import { Pressable } from "react-aria-components"

export function ContextMenuBasic() {
  return (
    <ContextMenuTrigger>
      <Pressable>
        <div
          role="button"
          className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
        >
          <span className="hidden pointer-fine:inline-block">
            Right click here
          </span>
          <span className="hidden pointer-coarse:inline-block">
            Long press here
          </span>
        </div>
      </Pressable>
      <ContextMenu>
        <ContextMenuGroup>
          <ContextMenuItem>Back</ContextMenuItem>
          <ContextMenuItem isDisabled>Forward</ContextMenuItem>
          <ContextMenuItem>Reload</ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenu>
    </ContextMenuTrigger>
  )
}
