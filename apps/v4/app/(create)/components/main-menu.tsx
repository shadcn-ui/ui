"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/examples/base/ui/alert-dialog"
import { type Button } from "@/examples/base/ui/button"
import { Menu09Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerItem,
  PickerSeparator,
  PickerShortcut,
  PickerTrigger,
} from "@/app/(create)/components/picker"
import { useActionMenuTrigger } from "@/app/(create)/hooks/use-action-menu"
import { useHistory } from "@/app/(create)/hooks/use-history"
import { useRandom } from "@/app/(create)/hooks/use-random"
import { useReset } from "@/app/(create)/hooks/use-reset"
import { useThemeToggle } from "@/app/(create)/hooks/use-theme-toggle"

const APPLE_PLATFORM_REGEX = /Mac|iPhone|iPad|iPod/

export function MainMenu({ className }: React.ComponentProps<typeof Button>) {
  const router = useRouter()
  const [isMac, setIsMac] = React.useState(false)
  const [showExitDialog, setShowExitDialog] = React.useState(false)
  const { canGoBack, canGoForward, goBack, goForward } = useHistory()
  const { openActionMenu } = useActionMenuTrigger()
  const { randomize } = useRandom()
  const { toggleTheme } = useThemeToggle()
  const { setShowResetDialog } = useReset()

  React.useEffect(() => {
    const platform = navigator.platform
    const userAgent = navigator.userAgent
    setIsMac(APPLE_PLATFORM_REGEX.test(platform || userAgent))
  }, [])

  return (
    <React.Fragment>
      <Picker>
        <PickerTrigger
          className={cn(
            "flex size-8! items-center gap-2 ring-0 focus-visible:ring-1",
            className
          )}
        >
          <span className="sr-only">Menu</span>
          <HugeiconsIcon icon={Menu09Icon} strokeWidth={2} className="size-5" />
        </PickerTrigger>
        <PickerContent side="right">
          <PickerGroup>
            <PickerItem onClick={openActionMenu}>
              Quick actions{" "}
              <PickerShortcut>{isMac ? "⌘P" : "Ctrl+P"}</PickerShortcut>
            </PickerItem>
            <PickerItem onClick={randomize}>
              Shuffle <PickerShortcut>R</PickerShortcut>
            </PickerItem>
            <PickerItem onClick={toggleTheme}>
              Light/Dark <PickerShortcut>D</PickerShortcut>
            </PickerItem>
          </PickerGroup>
          <PickerSeparator />
          <PickerGroup>
            <PickerItem onClick={goBack} disabled={!canGoBack}>
              Undo <PickerShortcut>{isMac ? "⌘Z" : "Ctrl+Z"}</PickerShortcut>
            </PickerItem>
            <PickerItem onClick={goForward} disabled={!canGoForward}>
              Redo{" "}
              <PickerShortcut>{isMac ? "⇧⌘Z" : "Ctrl+Shift+Z"}</PickerShortcut>
            </PickerItem>
            <PickerSeparator />
            <PickerItem onClick={() => setShowResetDialog(true)}>
              Reset
            </PickerItem>
          </PickerGroup>
          <PickerSeparator />
          <PickerGroup>
            <PickerItem onClick={() => setShowExitDialog(true)}>
              Exit
            </PickerItem>
          </PickerGroup>
        </PickerContent>
      </Picker>
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes and exit?</AlertDialogTitle>
            <AlertDialogDescription>
              You will lose your current changes and be taken back to the home
              page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/")}>
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  )
}
