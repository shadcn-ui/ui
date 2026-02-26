"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/examples/base/ui/alert-dialog"
import { Button } from "@/examples/base/ui/button"
import { Undo02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useReset } from "@/app/(create)/hooks/use-reset"

export function ResetButton() {
  const { showResetDialog, setShowResetDialog, confirmReset } = useReset()

  return (
    <React.Fragment>
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogTrigger
          render={
            <Button
              variant="ghost"
              className="border-foreground/10 bg-muted/50 flex h-[calc(--spacing(13.5))] w-[140px] touch-manipulation justify-between rounded-xl border select-none focus-visible:border-transparent focus-visible:ring-1 sm:hidden"
            >
              <div className="flex flex-col justify-start text-left">
                <div className="text-muted-foreground text-xs">Reset</div>
                <div className="text-foreground text-sm font-medium">
                  Start Over
                </div>
              </div>
              <HugeiconsIcon icon={Undo02Icon} className="-translate-x-0.5" />
            </Button>
          }
        />
        <AlertDialogTrigger
          render={
            <Button variant="outline" className="hidden w-full sm:flex">
              Reset
            </Button>
          }
        />
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset to defaults?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all customization options to their default values.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReset}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  )
}

export function ResetIconButton() {
  const { setShowResetDialog } = useReset()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Reset to defaults"
      onClick={() => setShowResetDialog(true)}
    >
      <HugeiconsIcon icon={Undo02Icon} />
      <span className="sr-only">Reset</span>
    </Button>
  )
}
