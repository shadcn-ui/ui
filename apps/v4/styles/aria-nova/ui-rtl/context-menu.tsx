"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { CheckIcon, ChevronRightIcon } from "lucide-react"
import {
  composeRenderProps,
  Header as HeaderPrimitive,
  MenuItem as MenuItemPrimitive,
  Menu as MenuPrimitive,
  MenuSection as MenuSectionPrimitive,
  MenuTrigger as MenuTriggerPrimitive,
  PopoverContext,
  Popover as PopoverPrimitive,
  Separator as SeparatorPrimitive,
  SubmenuTrigger as SubmenuTriggerPrimitive,
  type MenuItemProps as MenuItemPrimitiveProps,
  type MenuSectionProps as MenuSectionPrimitiveProps,
  type MenuTriggerProps,
} from "react-aria-components"
import { createPortal } from "react-dom"

import {
  cn,
  getPlacement,
  type PlacementAlign,
  type PlacementSide,
} from "@/lib/utils"

function ContextMenu({
  "data-slot": dataSlot = "context-menu-content",
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof MenuPrimitive<object>>,
  "children" | "className"
> & {
  "data-slot"?: string
  className?: string
  children?: React.ReactNode
  align?: PlacementAlign
  alignOffset?: number
  side?: PlacementSide
  sideOffset?: number
}) {
  return (
    <PopoverPrimitive
      data-slot={dataSlot}
      placement={getPlacement(side, align)}
      offset={sideOffset}
      crossOffset={alignOffset}
      className={cn(
        "cn-menu-target cn-menu-translucent z-50 w-(--trigger-width) min-w-36 origin-(--trigger-anchor-point) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      )}
      render={(renderProps, state) => (
        <div
          {...renderProps}
          data-side={state.placement}
          data-open={!state.isExiting}
          data-closed={state.isExiting}
        />
      )}
    >
      <MenuPrimitive
        className="max-h-[inherit] overflow-x-hidden overflow-y-auto outline-hidden"
        {...props}
      >
        {children}
      </MenuPrimitive>
    </PopoverPrimitive>
  )
}

function ContextMenuTrigger({
  children,
  className,
  onOpenChange,
  ...props
}: Omit<MenuTriggerProps, "trigger" | "isOpen" | "defaultOpen"> & {
  className?: string
}) {
  const [position, setPosition] = React.useState<{
    x: number
    y: number
  } | null>(null)
  const positionRef = React.useRef<HTMLDivElement>(null)

  return (
    <MenuTriggerPrimitive
      data-slot="context-menu"
      {...props}
      isOpen={!!position}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setPosition(null)
          onOpenChange?.(false)
        }
      }}
    >
      {position &&
        createPortal(
          // Position the popover at the pointer.
          <div
            data-slot="context-menu-anchor"
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
        data-slot="context-menu-trigger"
        className={cn("contents select-none", className)}
        onContextMenu={(e) => {
          e.preventDefault()
          const wasOpen = position !== null
          setPosition({
            y: e.clientY,
            x: e.clientX,
          })
          if (!wasOpen) {
            onOpenChange?.(true)
          }
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
    </MenuTriggerPrimitive>
  )
}

function ContextMenuGroup({
  ...props
}: Omit<MenuSectionPrimitiveProps<object>, "children"> & {
  children?: React.ReactNode
}) {
  return <MenuSectionPrimitive data-slot="context-menu-group" {...props} />
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof HeaderPrimitive> & {
  inset?: boolean
}) {
  return (
    <HeaderPrimitive
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:ps-7",
        className
      )}
      {...props}
    />
  )
}

const contextMenuItemVariants = cva(
  "group/context-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      selectionMode: {
        none: "gap-1.5 rounded-md px-1.5 py-1 text-sm focus:bg-accent focus:text-accent-foreground data-inset:ps-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg:not([class*='size-'])]:size-4 focus:*:[svg]:text-accent-foreground data-[variant=destructive]:*:[svg]:text-destructive",
        single:
          "gap-1.5 rounded-md py-1 ps-1.5 pe-8 text-sm focus:bg-accent focus:text-accent-foreground data-inset:ps-7 [&_svg:not([class*='size-'])]:size-4",
        multiple:
          "gap-1.5 rounded-md py-1 ps-1.5 pe-8 text-sm focus:bg-accent focus:text-accent-foreground data-inset:ps-7 [&_svg:not([class*='size-'])]:size-4",
      },
    },
  }
)

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  children,
  ...props
}: MenuItemPrimitiveProps<object> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenuItemPrimitive
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      textValue={typeof children === "string" ? children : props.textValue}
      className={composeRenderProps(className, (className, { selectionMode }) =>
        cn(contextMenuItemVariants({ selectionMode }), className)
      )}
      {...props}
    >
      {composeRenderProps(
        children,
        (children, { isSelected, selectionMode }) => (
          <>
            {selectionMode !== "none" ? (
              <span
                className="pointer-events-none absolute end-2"
                data-slot={
                  selectionMode === "single"
                    ? "context-menu-radio-item-indicator"
                    : "context-menu-checkbox-item-indicator"
                }
              >
                {isSelected ? <CheckIcon /> : null}
              </span>
            ) : null}
            {children}
          </>
        )
      )}
    </MenuItemPrimitive>
  )
}

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof SubmenuTriggerPrimitive>) {
  return <SubmenuTriggerPrimitive data-slot="context-menu-sub" {...props} />
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuItemPrimitiveProps<object> & {
  inset?: boolean
}) {
  return (
    <MenuItemPrimitive
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      textValue={typeof children === "string" ? children : props.textValue}
      className={cn(
        "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:ps-7 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          {children}
          <ChevronRightIcon className="ms-auto rtl:rotate-180" />
        </>
      ))}
    </MenuItemPrimitive>
  )
}

function ContextMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "inline-end",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof ContextMenu>) {
  return (
    <ContextMenu
      data-slot="context-menu-sub-content"
      className={cn(
        "cn-menu-target cn-menu-translucent w-auto min-w-32 rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive>) {
  return (
    <SeparatorPrimitive
      data-slot="context-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "ms-auto text-xs tracking-widest text-muted-foreground group-focus/context-menu-item:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
}
