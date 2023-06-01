"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const portalVariants = cva("fixed inset-0 z-50 flex", {
  variants: {
    position: {
      top: "items-start",
      bottom: "items-end",
      left: "justify-start",
      right: "justify-end",
    },
  },
  defaultVariants: { position: "right" },
})

interface SheetPortalProps
  extends SheetPrimitive.DialogPortalProps,
    VariantProps<typeof portalVariants> {}

const SheetPortal = ({
  position,
  className,
  children,
  ...props
}: SheetPortalProps) => (
  <SheetPrimitive.Portal className={cn(className)} {...props}>
    <div className={portalVariants({ position })}>{children}</div>
  </SheetPrimitive.Portal>
)
SheetPortal.displayName = SheetPrimitive.Portal.displayName

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, children, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 scale-100 gap-4 bg-background p-6 opacity-100 shadow-lg border",
  {
    variants: {
      position: {
        top: "animate-in slide-in-from-top w-full duration-300",
        bottom: "animate-in slide-in-from-bottom w-full duration-300",
        left: "animate-in slide-in-from-left h-full duration-300",
        right: "animate-in slide-in-from-right h-full duration-300",
      },
      size: {
        content: "",
        default: "",
        sm: "",
        lg: "",
        xl: "",
        full: "",
      },
    },
    compoundVariants: [
      {
        position: ["top", "bottom"],
        size: "content",
        class: "max-h-screen",
      },
      {
        position: ["top", "bottom"],
        size: "default",
        class: "h-1/3",
      },
      {
        position: ["top", "bottom"],
        size: "sm",
        class: "h-1/4",
      },
      {
        position: ["top", "bottom"],
        size: "lg",
        class: "h-1/2",
      },
      {
        position: ["top", "bottom"],
        size: "xl",
        class: "h-5/6",
      },
      {
        position: ["top", "bottom"],
        size: "full",
        class: "h-screen",
      },
      {
        position: ["right", "left"],
        size: "content",
        class: "max-w-screen",
      },
      {
        position: ["right", "left"],
        size: "default",
        class: "w-1/3",
      },
      {
        position: ["right", "left"],
        size: "sm",
        class: "w-1/4",
      },
      {
        position: ["right", "left"],
        size: "lg",
        class: "w-1/2",
      },
      {
        position: ["right", "left"],
        size: "xl",
        class: "w-5/6",
      },
      {
        position: ["right", "left"],
        size: "full",
        class: "w-screen",
      },
    ],
    defaultVariants: {
      position: "right",
      size: "default",
    },
  }
)

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  DialogContentProps
>(({ position, size, className, children, ...props }, ref) => (
  <SheetPortal position={position}>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ position, size }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
