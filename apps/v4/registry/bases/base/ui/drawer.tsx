"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"

import { cn } from "@/registry/bases/base/lib/utils"

type SwipeDirection = NonNullable<DrawerPrimitive.Root.Props["swipeDirection"]>
type SwipeAxis = "x" | "y"

function getSwipeAxis(swipeDirection: SwipeDirection): SwipeAxis {
  switch (swipeDirection) {
    case "down":
    case "up":
      return "y"
    case "left":
    case "right":
      return "x"
    default: {
      const _exhaustive: never = swipeDirection
      return _exhaustive
    }
  }
}

type DrawerContextProps = {
  modal: DrawerPrimitive.Root.Props["modal"]
  showSwipeHandle: boolean
  swipeDirection: NonNullable<DrawerPrimitive.Root.Props["swipeDirection"]>
}

const DrawerContext = React.createContext<DrawerContextProps | null>(null)

function useDrawer() {
  const context = React.useContext(DrawerContext)

  if (!context) {
    throw new Error("useDrawer must be used within a Drawer.")
  }

  return context
}

function Drawer({
  modal = true,
  showSwipeHandle = false,
  swipeDirection = "down",
  ...props
}: DrawerPrimitive.Root.Props & {
  showSwipeHandle?: boolean
}) {
  const contextValue = React.useMemo(
    () => ({ modal, showSwipeHandle, swipeDirection }),
    [modal, showSwipeHandle, swipeDirection]
  )

  return (
    <DrawerContext.Provider value={contextValue}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        modal={modal}
        swipeDirection={swipeDirection}
        {...props}
      />
    </DrawerContext.Provider>
  )
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        "cn-drawer-overlay fixed inset-0 z-50 min-h-dvh opacity-[calc(1-var(--drawer-swipe-progress))] transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:pointer-events-none data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:opacity-0 data-swiping:duration-0 supports-[-webkit-touch-callout:none]:absolute",
        className
      )}
      {...props}
    />
  )
}

function DrawerSwipeHandle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-swipe-handle"
      aria-hidden="true"
      className={cn(
        "cn-drawer-handle-base relative z-10 flex shrink-0 transition-opacity duration-200 group-data-nested-drawer-open/drawer-content:opacity-0 group-data-nested-drawer-swiping/drawer-content:opacity-100 group-data-[swipe-direction=left]/drawer-content:order-last group-data-[swipe-direction=up]/drawer-content:order-last",
        className
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  ...props
}: DrawerPrimitive.Popup.Props) {
  const { modal, showSwipeHandle, swipeDirection } = useDrawer()
  const swipeAxis = getSwipeAxis(swipeDirection)

  return (
    <DrawerPortal data-slot="drawer-portal">
      {modal === true && <DrawerOverlay />}
      <DrawerPrimitive.Viewport
        data-slot="drawer-viewport"
        className="fixed inset-0 z-50"
      >
        <DrawerPrimitive.Popup
          {...props}
          data-slot="drawer-content"
          data-swipe-axis={swipeAxis}
          className={cn(
            // Base.
            "cn-drawer-content-base group/drawer-content pointer-events-auto fixed z-50 flex h-(--drawer-height,auto) min-h-0 transform-[translate3d(var(--translate-x),var(--translate-y),0)_scale(var(--stack-scale))] flex-col overflow-hidden transition-[transform,height,opacity] duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
            // Stack.
            "[--bleed-x:3rem] [--bleed-y:3rem] [--peek:1rem] [--stack-height:max(0px,calc(var(--drawer-frontmost-height,var(--drawer-height,0px))-var(--bleed-y)))] [--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] [--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] [--stack-scale-base:max(0,calc(1-(var(--nested-drawers)*var(--stack-step))))] [--stack-scale:clamp(0,calc(var(--stack-scale-base)+(var(--stack-step)*var(--stack-progress))),1)] [--stack-shrink:calc(1-var(--stack-scale))] [--stack-step:0.05] [--stack-width:max(0px,calc(100%-var(--bleed-x)))] [--translate-x:0px] [--translate-y:0px]",
            // Nested state.
            "after:pointer-events-none after:absolute after:inset-0 after:bg-transparent after:transition-[background-color] after:duration-450 after:ease-[cubic-bezier(0.22,1,0.36,1)] data-nested-drawer-open:overflow-hidden data-nested-drawer-open:after:bg-black/5 data-nested-drawer-swiping:duration-0",
            // Transitions.
            "data-ending-style:transform-(--closed-transform) data-ending-style:opacity-[0.9999] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-ending-style:data-nested-drawer-swiping:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:transform-(--closed-transform) data-swiping:duration-0 data-swiping:select-none data-ending-style:data-swiping:duration-[calc(var(--drawer-swipe-strength)*400ms)]",
            // Axis: y.
            "data-[swipe-direction=down]:inset-x-0 data-[swipe-direction=down]:max-h-[calc(100dvh+var(--bleed-y))] data-[swipe-direction=down]:data-nested-drawer-open:h-[calc(var(--stack-height)+var(--bleed-y))] data-[swipe-direction=up]:inset-x-0 data-[swipe-direction=up]:max-h-[calc(100dvh+var(--bleed-y))] data-[swipe-direction=up]:data-nested-drawer-open:h-[calc(var(--stack-height)+var(--bleed-y))]",
            // Axis: x.
            "data-[swipe-direction=left]:inset-y-0 data-[swipe-direction=left]:w-[calc(75%+var(--bleed-x))] data-[swipe-direction=left]:flex-row data-[swipe-direction=right]:inset-y-0 data-[swipe-direction=right]:w-[calc(75%+var(--bleed-x))] data-[swipe-direction=right]:flex-row data-[swipe-direction=left]:sm:w-[calc(24rem+var(--bleed-x))] data-[swipe-direction=right]:sm:w-[calc(24rem+var(--bleed-x))]",
            // Direction: down.
            "data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:mt-24 data-[swipe-direction=down]:-mb-(--bleed-y) data-[swipe-direction=down]:origin-[50%_calc(100%-var(--bleed-y))] data-[swipe-direction=down]:pb-(--bleed-y) data-[swipe-direction=down]:[--closed-transform:translate3d(0,calc(100%-var(--bleed-y)+2px),0)] data-[swipe-direction=down]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--stack-shrink)*var(--stack-height)))]",
            // Direction: up.
            "data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:-mt-(--bleed-y) data-[swipe-direction=up]:mb-24 data-[swipe-direction=up]:origin-[50%_var(--bleed-y)] data-[swipe-direction=up]:pt-(--bleed-y) data-[swipe-direction=up]:[--closed-transform:translate3d(0,calc(-100%+var(--bleed-y)-2px),0)] data-[swipe-direction=up]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)+var(--stack-peek-offset)+(var(--stack-shrink)*var(--stack-height)))]",
            // Direction: left.
            "data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:-ml-(--bleed-x) data-[swipe-direction=left]:origin-[var(--bleed-x)_50%] data-[swipe-direction=left]:pl-(--bleed-x) data-[swipe-direction=left]:[--closed-transform:translate3d(calc(-100%+var(--bleed-x)-2px),0,0)] data-[swipe-direction=left]:[--translate-x:calc(var(--drawer-swipe-movement-x)+var(--stack-peek-offset)+(var(--stack-shrink)*var(--stack-width)))]",
            // Direction: right.
            "data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:-mr-(--bleed-x) data-[swipe-direction=right]:origin-[calc(100%-var(--bleed-x))_50%] data-[swipe-direction=right]:pr-(--bleed-x) data-[swipe-direction=right]:[--closed-transform:translate3d(calc(100%-var(--bleed-x)+2px),0,0)] data-[swipe-direction=right]:[--translate-x:calc(var(--drawer-swipe-movement-x)-var(--stack-peek-offset)-(var(--stack-shrink)*var(--stack-width)))]",
            className
          )}
        >
          {showSwipeHandle && <DrawerSwipeHandle />}
          <DrawerPrimitive.Content
            className={cn(
              "flex min-h-0 flex-1 flex-col overflow-hidden transition-opacity duration-300 ease-[cubic-bezier(0.45,1.005,0,1.005)]",
              "group-data-nested-drawer-open/drawer-content:opacity-0 group-data-nested-drawer-swiping/drawer-content:opacity-100"
            )}
          >
            {children}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "cn-drawer-header-base flex shrink-0 flex-col group-data-[swipe-axis=y]/drawer-content:text-center",
        className
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "cn-drawer-footer-base mt-auto flex shrink-0 flex-col",
        className
      )}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("cn-drawer-title cn-font-heading", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("cn-drawer-description text-balance", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerSwipeHandle,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
