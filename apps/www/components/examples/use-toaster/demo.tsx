"use client"

import { toast, useToaster } from "@/hooks/use-toaster"

import { Button } from "@/components/ui/button"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export const UseToasterDemo = () => {
  const { toasts } = useToaster()

  return (
    <>
      <Button
        onClick={() =>
          toast({
            content: (
              <>
                <ToastTitle>New toast</ToastTitle>
                <ToastDescription>Description of the toast</ToastDescription>
              </>
            ),
          })
        }
      >
        Toaster
      </Button>

      <ToastProvider>
        {toasts.map(({ id, children, ...props }) => (
          <Toast key={id} {...props}>
            {children}
            <ToastClose />
          </Toast>
        ))}

        <ToastViewport position="bottom-right" />
      </ToastProvider>
    </>
  )
}
