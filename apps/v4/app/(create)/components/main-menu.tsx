"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/examples/base/ui/button"
import { ButtonGroup } from "@/examples/base/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/examples/base/ui/dropdown-menu"
import { ChevronDownIcon } from "lucide-react"

import { useHistory } from "@/app/(create)/hooks/use-history"
import { useRandom } from "@/app/(create)/hooks/use-random"
import { useReset } from "@/app/(create)/hooks/use-reset"
import { useThemeToggle } from "@/app/(create)/hooks/use-theme-toggle"

const APPLE_PLATFORM_REGEX = /Mac|iPhone|iPad|iPod/

export function MainMenu() {
  const [isMac, setIsMac] = React.useState(false)
  const { canGoBack, canGoForward, goBack, goForward } = useHistory()
  const { randomize } = useRandom()
  const { toggleTheme } = useThemeToggle()
  const { setShowResetDialog } = useReset()

  React.useEffect(() => {
    const platform = navigator.platform
    const userAgent = navigator.userAgent
    setIsMac(APPLE_PLATFORM_REGEX.test(platform || userAgent))
  }, [])

  return (
    <ButtonGroup>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="secondary" id="menu-button" />}
        >
          Menu
          <ChevronDownIcon data-icon="inline-end" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="animate-none!">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={goBack} disabled={!canGoBack}>
              Undo{" "}
              <DropdownMenuShortcut>
                {isMac ? "⌘Z" : "Ctrl+Z"}
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={goForward} disabled={!canGoForward}>
              Redo{" "}
              <DropdownMenuShortcut>
                {isMac ? "⇧⌘Z" : "Ctrl+Shift+Z"}
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={randomize}>
              Shuffle <DropdownMenuShortcut>R</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme}>
              Toggle Theme <DropdownMenuShortcut>D</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setShowResetDialog(true)}>
              Reset
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem render={<Link href="/" />}>Exit</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
