"use client"

import { useToast } from "@/registry/default/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/registry/default/ui/toast"
import { useDirection } from "@radix-ui/react-direction"

export function Toaster() {
  const { toasts } = useToast()
  const dir = useDirection()

  return (
    <ToastProvider swipeDirection={dir == "rtl" ? "left" : "right"}>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
