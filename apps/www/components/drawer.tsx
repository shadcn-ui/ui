"use client"

import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerContent = (
  {
    ref,
    className,
    children,
    ...props
  }: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
    ref: React.RefObject<React.ElementRef<typeof DrawerPrimitive.Content>>;
  }
) => (<DrawerPrimitive.Portal>
  <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
  <DrawerPrimitive.Content
    ref={ref}
    className={cn(
      "fixed inset-x-0 bottom-0 z-50 mt-24 h-[96%] rounded-t-[10px] bg-background",
      className
    )}
    {...props}
  >
    <div className="absolute left-1/2 top-3 h-2 w-[100px] translate-x-[-50%] rounded-full bg-muted" />
    {children}
  </DrawerPrimitive.Content>
</DrawerPrimitive.Portal>)
DrawerContent.displayName = "DrawerContent"

export { DrawerTrigger, DrawerContent }
