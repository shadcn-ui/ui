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

export const ToastAdvanced = () => {
  const [open, setOpen] = useState(false)

  //TODO: Advanced example for doc with position and swipe direction <Select />s

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        onClick={() => {
          setOpen(true)
        }}
      >
        Show toast
      </Button>
      <ToastProvider swipeDirection="down" duration={10000000}>
        <Toast open={open} onOpenChange={setOpen}>
          <div className="mb-2">
            <ToastTitle>Awesome toast</ToastTitle>
            <ToastDescription>
              Made with RadixUI and TailwindCSS
            </ToastDescription>
          </div>
          <ToastAction altText="undo">Cheers</ToastAction>
          <ToastClose />
        </Toast>

        <ToastViewport position="bottom-center" />
      </ToastProvider>
    </div>
  )
}
