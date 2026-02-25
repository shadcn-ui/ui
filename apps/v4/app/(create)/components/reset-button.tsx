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

import { DEFAULT_CONFIG } from "@/registry/config"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function ResetButton() {
  const [params, setParams] = useDesignSystemSearchParams()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [desktopOpen, setDesktopOpen] = React.useState(false)

  const handleReset = React.useCallback(() => {
    setParams({
      base: params.base, // Keep the current base value.
      style: DEFAULT_CONFIG.style,
      baseColor: DEFAULT_CONFIG.baseColor,
      theme: DEFAULT_CONFIG.theme,
      iconLibrary: DEFAULT_CONFIG.iconLibrary,
      font: DEFAULT_CONFIG.font,
      menuAccent: DEFAULT_CONFIG.menuAccent,
      menuColor: DEFAULT_CONFIG.menuColor,
      radius: DEFAULT_CONFIG.radius,
      template: DEFAULT_CONFIG.template,
      item: "preview",
    })
  }, [setParams, params.base])

  return (
    <>
      <AlertDialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <AlertDialogTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
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
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset to defaults?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all customization options to their default values.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-lg"
              onClick={() => {
                handleReset()
                setMobileOpen(false)
              }}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={desktopOpen} onOpenChange={setDesktopOpen}>
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
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-lg"
              onClick={() => {
                handleReset()
                setDesktopOpen(false)
              }}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
