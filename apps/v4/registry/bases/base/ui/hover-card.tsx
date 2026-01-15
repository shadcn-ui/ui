"use client"

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"

import { cn } from "@/registry/bases/base/lib/utils"

function HoverCard<T>({ ...props }: PreviewCardPrimitive.Root.Props<T>) {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger<T>({ ...props }: PreviewCardPrimitive.Trigger.Props<T>) {
  return (
    <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 4,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<
    PreviewCardPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <PreviewCardPrimitive.Portal data-slot="hover-card-portal">
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          className={cn(
            "cn-hover-card-content z-50 origin-(--transform-origin) outline-hidden",
            className
          )}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  )
}

export const createHoverCardHandle = PreviewCardPrimitive.createHandle;

export { HoverCard, HoverCardTrigger, HoverCardContent }
