"use client"

import * as React from "react"
import {
  MenuTrigger,
  PopoverContext,
  type MenuTriggerProps,
} from "react-aria-components"
import { createPortal } from "react-dom"

import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/styles/aria-luma/ui/dropdown-menu"

function ContextMenuTrigger({
  children,
  ...props
}: Omit<MenuTriggerProps, "trigger" | "isOpen" | "defaultOpen">) {
  const [position, setPosition] = React.useState<{
    x: number
    y: number
  } | null>(null)
  const positionRef = React.useRef<HTMLDivElement>(null)

  return (
    <MenuTrigger
      {...props}
      isOpen={!!position}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          props.onOpenChange?.(isOpen)
          setPosition(null)
        }
      }}
    >
      {position &&
        createPortal(
          // position relative the mouse position
          <div
            ref={positionRef}
            style={{
              position: "fixed",
              top: position.y,
              left: position.x,
            }}
          />,
          document.body
        )}
      <div
        style={{ display: "contents" }}
        onContextMenu={(e) => {
          e.preventDefault()
          setPosition({
            y: e.clientY,
            x: e.clientX,
          })
        }}
      >
        <PopoverContext.Consumer>
          {(ctx) => (
            <PopoverContext.Provider
              value={{
                ...ctx,
                ...position,
                triggerRef: positionRef,
                style: undefined,
              }}
            >
              {children}
            </PopoverContext.Provider>
          )}
        </PopoverContext.Consumer>
      </div>
    </MenuTrigger>
  )
}

export {
  DropdownMenu as ContextMenu,
  ContextMenuTrigger,
  DropdownMenuItem as ContextMenuItem,
  DropdownMenuLabel as ContextMenuLabel,
  DropdownMenuSeparator as ContextMenuSeparator,
  DropdownMenuShortcut as ContextMenuShortcut,
  DropdownMenuGroup as ContextMenuGroup,
  DropdownMenuSub as ContextMenuSub,
  DropdownMenuSubContent as ContextMenuSubContent,
  DropdownMenuSubTrigger as ContextMenuSubTrigger,
}
