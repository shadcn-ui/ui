"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

type DrawerContextProps = {
  direction: "left" | "right" | "top" | "bottom"
}

const DrawerContext = React.createContext<DrawerContextProps | null>(null)

function useDrawer() {
  const context = React.useContext(DrawerContext)

  if (!context) {
    throw new Error("useDrawer must be used within a <DrawerContainer />")
  }

  return context
}

const drawerVariants = cva(
  "fixed z-50 flex h-auto flex-col border bg-background",
  {
    variants: {
      direction: {
        bottom: "bottom-0 mt-24 w-full rounded-t-[10px]",
        left: "inset-y-0 left-0 w-fit rounded-r-[10px]",
        right: "inset-y-0 right-0 w-fit rounded-l-[10px]",
        top: "top-0",
      },
    },
    defaultVariants: {
      direction: "bottom",
    },
  }
)

const Drawer = ({
  shouldScaleBackground = false,
  direction = "bottom",
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerContext.Provider value={{ direction }}>
    <DrawerPrimitive.Root
      direction={direction}
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  </DrawerContext.Provider>
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerNested = ({
  shouldScaleBackground = false,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.NestedRoot
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/50", className)}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { direction } = useDrawer()
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={drawerVariants({ direction, className })}
        {...props}
      >
        {direction === "bottom" ? (
          <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        ) : null}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
})

DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-4 grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerNested,
  DrawerTitle,
  DrawerDescription,
}
