"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverAnchor = PopoverPrimitive.Anchor

const useScrollFixForModalPopovers = () => {
  const touchPosRef = React.useRef<number | null>(null)

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.stopPropagation()
    const isScrollingDown = event.deltaY > 0

    if (isScrollingDown) {
      event.currentTarget.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" })
      )
    } else {
      event.currentTarget.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowUp" })
      )
    }
  }

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchPosRef.current = event.changedTouches[0]?.clientY ?? null
  }

  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const touchPos = event.changedTouches[0]?.clientY ?? null

    if (touchPosRef.current === null || touchPos === null) {
      return
    }

    event.stopPropagation()

    const isScrollingDown = touchPosRef.current < touchPos

    if (isScrollingDown) {
      event.currentTarget.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" })
      )
    } else {
      event.currentTarget.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowUp" })
      )
    }

    touchPosRef.current = touchPos
  }

  return { onWheel, onTouchStart, onTouchMove }
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...useScrollFixForModalPopovers()}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
