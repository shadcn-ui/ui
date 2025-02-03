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

interface ToasterProps {
  gap?: string;  // Custom gap prop
}

export function Toaster({ gap = "gap-4" }: ToasterProps) {  // Default to "gap-4"
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport className={gap} />  {/* Apply the custom gap */}
    </ToastProvider>
  )
}
