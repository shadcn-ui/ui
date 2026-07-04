"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

// [FORCE-UI] links PopoverContent to PopoverTitle/PopoverDescription so the
// panel (already role="dialog" via the primitive) gets an accessible name and
// description instead of being announced with neither
const PopoverContext = React.createContext<{
  titleId: string
  descriptionId: string
} | null>(null)

function findSlot(
  children: React.ReactNode,
  slot: "popover-title" | "popover-description"
): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false
    const childProps = child.props as {
      "data-slot"?: string
      children?: React.ReactNode
    }
    if (childProps["data-slot"] === slot) return true
    return childProps.children ? findSlot(childProps.children, slot) : false
  })
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const titleId = React.useId()
  const descriptionId = React.useId()
  const hasTitle = findSlot(children, "popover-title")
  const hasDescription = findSlot(children, "popover-description")

  return (
    <PopoverPrimitive.Portal>
      <PopoverContext.Provider value={{ titleId, descriptionId }}>
        <PopoverPrimitive.Content
          data-slot="popover-content"
          align={align}
          sideOffset={sideOffset}
          aria-labelledby={hasTitle ? titleId : undefined}
          aria-describedby={hasDescription ? descriptionId : undefined}
          className={cn(
            "z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 motion-reduce:animate-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverContext.Provider>
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-0.5 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, id, ...props }: React.ComponentProps<"h2">) {
  const popoverContext = React.useContext(PopoverContext)
  return (
    <div
      data-slot="popover-title"
      id={id ?? popoverContext?.titleId}
      className={cn("font-medium", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  id,
  ...props
}: React.ComponentProps<"p">) {
  const popoverContext = React.useContext(PopoverContext)
  return (
    <p
      data-slot="popover-description"
      id={id ?? popoverContext?.descriptionId}
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
