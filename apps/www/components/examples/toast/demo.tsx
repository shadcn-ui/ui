"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export const ToastDemo = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        onClick={() => {
          setOpen(true)
        }}
      >
        Add to components
      </Button>
      <ToastProvider duration={300000}>
        <Toast open={open} onOpenChange={setOpen}>
          <div className="mb-2">
            <ToastTitle>New component</ToastTitle>
            <ToastDescription>Awesome toast component</ToastDescription>
          </div>
          <ToastAction altText="undo">Cheers</ToastAction>
          <ToastClose />
        </Toast>

        <ToastViewport />
      </ToastProvider>
    </div>
  )
}
