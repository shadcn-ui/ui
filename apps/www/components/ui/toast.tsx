import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastAction: React.FC<ToastPrimitives.ToastActionProps> = ({
  className,
  ...props
}) => (
  <ToastPrimitives.Action
    className={cn(
      "inline-flex h-6 items-center justify-center rounded-md border border-slate-400/30 bg-transparent px-2 text-sm font-medium leading-none transition-colors hover:bg-slate-500/10 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-slate-100 dark:border-slate-50/50 dark:text-slate-100 dark:hover:bg-slate-100/30 dark:hover:text-slate-100 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800",
      className
    )}
    {...props}
  />
)

const ToastClose: React.FC<ToastPrimitives.ToastCloseProps> = ({
  className,
  ...props
}) => (
  <ToastPrimitives.Close
    className={cn(
      "absolute top-2 right-2 rounded-md p-1 hover:bg-slate-500/10 dark:hover:bg-slate-100/30",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
)

const ToastTitle: React.FC<ToastPrimitives.ToastTitleProps> = ({
  className,
  ...props
}) => (
  <ToastPrimitives.Title
    className={cn(
      "text-lg font-semibold text-slate-900 dark:text-slate-50",
      className
    )}
    {...props}
  />
)

const ToastDescription: React.FC<ToastPrimitives.ToastDescriptionProps> = ({
  className,
  ...props
}) => (
  <ToastPrimitives.Description
    className={cn("text-sm font-medium leading-none", className)}
    {...props}
  />
)

const toastVariants = cva(
  [
    "relative w-full rounded-md border-2 px-3 py-2 shadow-md",
    "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-right-52",
    "data-[state=closed]:animate-out data-[state=closed]:fade-out",
    "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
    "data-[swipe=end]:animate-out data-[swipe=end]:fade-out data-[swipe=end]:translate-x-[calc(100% + var(--radix-toast-swipe-move-x))] data-[swipe=end]:transition",
    "data-[swipe=cancel]:translate-x-0 data[swipe=cancel]:transition data[swipe=cancel]:duration-200",
  ],
  {
    variants: {
      status: {
        default:
          "border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700",
        success:
          "border-green-200 bg-green-50 dark:bg-green-900 dark:border-green-800",
        error: "border-red-200 bg-red-50 dark:bg-red-900 dark:border-red-800",
        info: "border-blue-200 bg-blue-50 dark:bg-blue-900 dark:border-blue-800",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

type ToastStatus = VariantProps<typeof toastVariants>["status"]

const Toast: React.FC<
  ToastPrimitives.ToastProps & VariantProps<typeof toastVariants>
> = ({ className, status, ...props }) => (
  <ToastPrimitives.Root
    className={cn(toastVariants({ status }), className)}
    {...props}
  />
)

const ToastProvider: React.FC<ToastPrimitives.ToastProviderProps> = (props) => (
  <ToastPrimitives.Provider
    swipeDirection="right"
    duration={10000}
    {...props}
  />
)

const ToastViewport: React.FC<ToastPrimitives.ToastViewportProps> = ({
  className,
  ...props
}) => (
  <ToastPrimitives.Viewport
    className={cn(
      "fixed right-0 bottom-0 z-50 flex max-h-screen w-full flex-col items-end justify-end gap-3 p-6 md:max-w-[390px]",
      className
    )}
    {...props}
  />
)

export {
  ToastProvider,
  ToastViewport,
  Toast,
  type ToastStatus,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
