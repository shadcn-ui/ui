"use client"

import * as React from "react"
import { Pressable } from "react-aria-components"

import {
  ContextMenu,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/styles/aria-nova/ui/context-menu"

export function ContextMenuRadio() {
  const [user, setUser] = React.useState("pedro")
  const [theme, setTheme] = React.useState("light")

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
        <ContextMenuGroup
          selectionMode="single"
          selectedKeys={[user]}
          onSelectionChange={(keys) =>
            setUser(
              keys === "all" ? "pedro" : (keys.values().next().value as string)
            )
          }
        >
          <ContextMenuLabel>People</ContextMenuLabel>
          <ContextMenuItem id="pedro">Pedro Duarte</ContextMenuItem>
          <ContextMenuItem id="colm">Colm Tuite</ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup
          selectionMode="single"
          selectedKeys={[theme]}
          onSelectionChange={(keys) =>
            setTheme(
              keys === "all" ? "system" : (keys.values().next().value as string)
            )
          }
        >
          <ContextMenuLabel>Theme</ContextMenuLabel>
          <ContextMenuItem id="light">Light</ContextMenuItem>
          <ContextMenuItem id="dark">Dark</ContextMenuItem>
          <ContextMenuItem id="system">System</ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenu>
    </ContextMenuTrigger>
  )
}
