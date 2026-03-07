"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/examples/base/ui/dialog"

import { Icons } from "@/components/icons"

const STORAGE_KEY = "shadcn-create-welcome-dialog"

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (!dismissed) {
      setIsOpen(true)
    }
  }, [])

  // Stable callback — avoids re-creation on every render. (rerender-functional-setstate)
  const handleOpenChange = React.useCallback((open: boolean) => {
    setIsOpen(open)
    if (!open) {
      localStorage.setItem(STORAGE_KEY, "true")
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="dialog-ring max-w-92 min-w-0 gap-0 overflow-hidden rounded-xl p-0 sm:max-w-sm dark:bg-neutral-900"
      >
        <div className="flex aspect-[2/1.2] w-full items-center justify-center rounded-t-xl bg-neutral-950 text-center text-neutral-100 sm:aspect-2/1">
          <div className="font-mono text-2xl font-bold">
            <Icons.logo className="size-12" />
          </div>
        </div>
        <DialogHeader className="gap-1 p-4">
          <DialogTitle className="text-left text-base">
            Build your own shadcn/ui
          </DialogTitle>
          <DialogDescription className="text-left leading-relaxed text-foreground">
            Customize everything from the ground up. Pick your component
            library, font, color scheme, and more.
          </DialogDescription>
          <DialogDescription className="mt-2 text-left leading-relaxed font-medium text-foreground">
            Available for all major React frameworks.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="m-0">
          <DialogClose render={<Button className="w-full" />}>
            Get Started
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
