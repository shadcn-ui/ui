import React from "react"
import * as ToastPrimitive from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.ToastAction>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.ToastAction>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      "inline-flex h-6 items-center justify-center rounded-md border border-slate-400/30 bg-transparent px-2 text-sm font-medium leading-none transition-colors hover:bg-slate-500/10 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-slate-100 dark:border-slate-50/50 dark:text-slate-100 dark:hover:bg-slate-100/30 dark:hover:text-slate-100 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800",
      className
    )}
    {...props}
  />
))

ToastAction.displayName = ToastPrimitive.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.ToastClose>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.ToastClose>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      "absolute top-1 right-1 rounded-md p-1 hover:bg-slate-500/10 dark:hover:bg-slate-100/30",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
))

ToastClose.displayName = ToastPrimitive.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn("font-semibold text-slate-900 dark:text-slate-50", className)}
    {...props}
  />
))

ToastTitle.displayName = ToastPrimitive.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn("text-sm leading-none", className)}
    {...props}
  />
))

ToastDescription.displayName = ToastPrimitive.Description.displayName

type ToastProps = ToastPrimitive.ToastProps

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  ToastProps
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={cn(
      [
        "pointer-events-auto relative w-full items-start rounded-md border border-b-4 border-slate-900 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800",
        "data-[state=open]:animate-in data-[state=open]:fade-in data-[swipe-direction=right]:data-[state=open]:slide-in-from-right-52 data-[swipe-direction=left]:data-[state=open]:slide-in-from-left-52 data-[swipe-direction=up]:data-[state=open]:slide-in-from-top-52 data-[swipe-direction=down]:data-[state=open]:slide-in-from-bottom-52",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out",
        "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)]",
        "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=end]:translate-y-[var(--radix-toast-swipe-end-y)] data-[swipe=end]:animate-out data-[swipe=end]:fade-out data-[swipe-direction=down]:data-[swipe=end]:slide-out-to-bottom-full data-[swipe-direction=right]:data-[swipe=end]:slide-out-to-right-full data-[swipe-direction=left]:data-[swipe=end]:slide-out-to-left-full data-[swipe-direction=up]:data-[swipe=end]:slide-out-to-top-full",
        "data[swipe=cancel]:transition data[swipe=cancel]:duration-200 data-[swipe=cancel]:translate-x-0",
      ],
      className
    )}
    {...props}
  />
))

Toast.displayName = ToastPrimitive.Root.displayName

const ToastProvider = ToastPrimitive.Provider

const toastViewportVariants = cva(
  "fixed z-50 flex max-h-screen w-full flex-col items-end justify-end gap-3 p-6 md:max-w-[390px] pointer-events-none",
  {
    variants: {
      position: {
        "top-left": "top-0 left-0",
        "top-center": "top-0 left-[50%] -translate-x-[50%]",
        "top-right": "top-0 right-0",
        "bottom-left": "bottom-0 left-0 flex-col-reverse",
        "bottom-center":
          "bottom-0 left-[50%] -translate-x-[50%] flex-col-reverse",
        "bottom-right": "bottom-0 right-0 flex-col-reverse",
      },
    },
    defaultVariants: {
      position: "bottom-right",
    },
  }
)

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport> &
    VariantProps<typeof toastViewportVariants>
>(({ className, position, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(toastViewportVariants({ position }), className)}
    {...props}
  />
))

ToastViewport.displayName = ToastPrimitive.Viewport.displayName

export {
  ToastProvider,
  ToastViewport,
  Toast,
  type ToastProps,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
