"use client"

import * as React from "react"
import { Cross2Icon } from "@radix-ui/react-icons"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport: React.FC<
  React.ComponentProps<typeof ToastPrimitives.Viewport>
> = ({ className, ...props }) => (
  <ToastPrimitives.Viewport
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
)
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border",
        destructive:
          "destructive border-destructive bg-destructive text-destructive-foreground group",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast: React.FC<
  React.ComponentProps<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
> = ({ className, variant, ...props }) => {
  return (
    <ToastPrimitives.Root
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
}
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction: React.FC<
  React.ComponentProps<typeof ToastPrimitives.Action>
> = ({ className, ...props }) => (
  <ToastPrimitives.Action
    className={cn(
      "hover:bg-secondary focus:ring-ring group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
)
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose: React.FC<
  React.ComponentProps<typeof ToastPrimitives.Close>
> = ({ className, ...props }) => (
  <ToastPrimitives.Close
    className={cn(
      "text-foreground/50 hover:text-foreground absolute right-1 top-1 rounded-md p-1 opacity-0 transition-opacity focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <Cross2Icon className="h-4 w-4" />
  </ToastPrimitives.Close>
)
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle: React.FC<
  React.ComponentProps<typeof ToastPrimitives.Title>
> = ({ className, ...props }) => (
  <ToastPrimitives.Title
    className={cn("text-sm font-semibold [&+div]:text-xs", className)}
    {...props}
  />
)
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription: React.FC<
  React.ComponentProps<typeof ToastPrimitives.Description>
> = ({ className, ...props }) => (
  <ToastPrimitives.Description
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
)
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentProps<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
