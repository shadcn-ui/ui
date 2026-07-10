"use client"

import * as React from "react"
import { Menu09Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { type Button } from "@/styles/base-nova/ui/button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerItem,
  PickerSeparator,
  PickerShortcut,
  PickerTrigger,
} from "@/app/(app)/(typeset)/components/picker"
import { useHistory } from "@/app/(app)/(typeset)/hooks/use-history"
import { useShuffle } from "@/app/(app)/(typeset)/hooks/use-shuffle"
import { useThemeToggle } from "@/app/(app)/(typeset)/hooks/use-theme-toggle"

const APPLE_PLATFORM_REGEX = /Mac|iPhone|iPad|iPod/

export function TypesetMainMenu({
  className,
}: React.ComponentProps<typeof Button>) {
  const [isMac, setIsMac] = React.useState(false)
  const { canGoBack, canGoForward, goBack, goForward } = useHistory()
  const { toggleTheme } = useThemeToggle()
  const { shuffle, reset } = useShuffle()

  React.useEffect(() => {
    const platform = navigator.platform
    const userAgent = navigator.userAgent
    setIsMac(APPLE_PLATFORM_REGEX.test(platform || userAgent))
  }, [])

  // R shuffles, ⇧R resets (matches /create). Undo/Redo (⌘Z) and Light/Dark (D)
  // are bound in their own hooks.
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return
      }
      if (
        (e.target instanceof HTMLElement && e.target.isContentEditable) ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }
      if (e.key === "r" || e.key === "R") {
        e.preventDefault()
        if (e.shiftKey) {
          reset()
        } else {
          shuffle()
        }
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [shuffle, reset])

  return (
    <Picker>
      <PickerTrigger
        className={cn(
          "flex items-center justify-between gap-2 rounded-lg px-1.75 ring-1 ring-foreground/10 focus-visible:ring-1",
          className
        )}
      >
        <span className="font-medium">Menu</span>
        <HugeiconsIcon icon={Menu09Icon} strokeWidth={2} className="size-5" />
      </PickerTrigger>
      <PickerContent side="right" align="start" alignOffset={-8}>
        <PickerGroup>
          <PickerItem onClick={shuffle}>
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
          <PickerItem onClick={reset}>
            Reset <PickerShortcut>⇧R</PickerShortcut>
          </PickerItem>
        </PickerGroup>
      </PickerContent>
    </Picker>
  )
}
