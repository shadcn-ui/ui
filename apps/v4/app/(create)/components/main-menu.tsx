"use client"

import * as React from "react"
import { Menu09Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerItem,
  PickerLabel,
  PickerRadioGroup,
  PickerRadioItem,
  PickerSeparator,
  PickerShortcut,
  PickerTrigger,
} from "@/app/(create)/components/picker"
import { useActionMenuTrigger } from "@/app/(create)/hooks/use-action-menu"
import { useHistory } from "@/app/(create)/hooks/use-history"
import { useRandom } from "@/app/(create)/hooks/use-random"
import { useReset } from "@/app/(create)/hooks/use-reset"
import { useThemeToggle } from "@/app/(create)/hooks/use-theme-toggle"
import { type CustomizerPosition } from "@/app/(create)/lib/customizer"

const APPLE_PLATFORM_REGEX = /Mac|iPhone|iPad|iPod/

export function MainMenu({
  className,
  onToggleCollapse,
  onPositionChange,
  position = "left",
  collapsed = false,
}: {
  className?: string
  onToggleCollapse?: () => void
  onPositionChange?: (position: CustomizerPosition) => void
  position?: CustomizerPosition
  collapsed?: boolean
}) {
  const [isMac, setIsMac] = React.useState(false)
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
          aria-label="Menu"
          collapsed={collapsed}
          tooltip="Menu"
          className={cn("relative block w-full text-left", className)}
        >
          <div
            aria-hidden={collapsed}
            className={cn(
              "w-full pr-8 transition-[opacity,transform] duration-150 ease-out",
              collapsed
                ? "translate-x-1 opacity-0"
                : "translate-x-0 opacity-100"
            )}
          >
            <div className="truncate font-medium text-foreground">Menu</div>
          </div>
          <div
            className={cn(
              "pointer-events-none absolute top-1/2 flex size-4 -translate-y-1/2 items-center justify-center text-foreground transition-[left,transform] duration-200 ease-out",
              collapsed
                ? "left-1/2 -translate-x-1/2"
                : "left-[calc(100%-1.625rem)] translate-x-0"
            )}
          >
            <HugeiconsIcon
              icon={Menu09Icon}
              strokeWidth={2}
              className="size-5"
            />
          </div>
        </PickerTrigger>
        <PickerContent
          side={position === "right" ? "left" : "right"}
          align="start"
          alignOffset={-8}
        >
          <PickerGroup>
            <PickerItem onClick={openActionMenu}>
              Navigate...
              <PickerShortcut>{isMac ? "⌘P" : "Ctrl+P"}</PickerShortcut>
            </PickerItem>
            <PickerItem onClick={randomize}>
              Shuffle <PickerShortcut>R</PickerShortcut>
            </PickerItem>
            <PickerItem onClick={toggleTheme}>
              Light/Dark <PickerShortcut>D</PickerShortcut>
            </PickerItem>
            {onToggleCollapse ? (
              <PickerItem onClick={onToggleCollapse}>
                {collapsed ? "Expand" : "Collapse"}{" "}
                <PickerShortcut>{isMac ? "⌘B" : "Ctrl+B"}</PickerShortcut>
              </PickerItem>
            ) : null}
          </PickerGroup>
          <PickerSeparator />
          {onPositionChange ? (
            <>
              <PickerGroup>
                <PickerLabel>Position</PickerLabel>
                <PickerRadioGroup
                  value={position}
                  onValueChange={(value) => {
                    onPositionChange(value as CustomizerPosition)
                  }}
                >
                  <PickerRadioItem value="left" closeOnClick>
                    Left
                  </PickerRadioItem>
                  <PickerRadioItem value="right" closeOnClick>
                    Right
                  </PickerRadioItem>
                </PickerRadioGroup>
              </PickerGroup>
              <PickerSeparator />
            </>
          ) : null}
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
        </PickerContent>
      </Picker>
    </React.Fragment>
  )
}
