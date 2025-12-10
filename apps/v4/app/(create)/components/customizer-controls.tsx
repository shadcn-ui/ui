"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { DiceFaces05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQueryStates } from "nuqs"

import { cn } from "@/lib/utils"
import {
  BASE_COLORS,
  getThemesForBaseColor,
  iconLibraries,
  MENU_ACCENTS,
  MENU_COLORS,
  RADII,
  STYLES,
} from "@/registry/config"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Kbd } from "@/registry/new-york-v4/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"
import { FONTS } from "@/app/(create)/lib/fonts"
import { designSystemSearchParams } from "@/app/(create)/lib/search-params"

export const RANDOMIZE_FORWARD_TYPE = "randomize-forward"

function randomItem<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function CustomizerControls({ className }: { className?: string }) {
  const router = useRouter()
  const [, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const handleRandomize = React.useCallback(() => {
    const baseColor = randomItem(BASE_COLORS).name
    const availableThemes = getThemesForBaseColor(baseColor)

    setParams({
      style: randomItem(STYLES).name,
      baseColor,
      theme: randomItem(availableThemes).name,
      iconLibrary: randomItem(Object.values(iconLibraries)).name,
      font: randomItem(FONTS).value,
      menuAccent: randomItem(MENU_ACCENTS).value,
      menuColor: randomItem(MENU_COLORS).value,
      radius: randomItem(RADII).name,
    })
  }, [setParams])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "r" || e.key === "R") && !e.metaKey && !e.ctrlKey) {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        handleRandomize()
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [handleRandomize])

  return (
    <div className={cn("items-center gap-1", className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRandomize}
            className="border-foreground/10 bg-muted/50 h-[calc(--spacing(13.5))] w-[140px] touch-manipulation justify-between rounded-xl border select-none focus-visible:border-transparent focus-visible:ring-1 sm:h-8 sm:rounded-lg md:h-9 md:w-full md:rounded-lg md:border-transparent md:bg-transparent md:pr-3.5! md:pl-2!"
          >
            Randomize{" "}
            <HugeiconsIcon
              icon={DiceFaces05Icon}
              className="size-5 md:hidden"
            />
            <Kbd className="bg-foreground/10 text-foreground hidden md:flex">
              R
            </Kbd>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="w-(--radix-tooltip-trigger-width)">
          <p>Use browser back/forward buttons to navigate history.</p>
        </TooltipContent>
      </Tooltip>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => router.push("/create")}
        className="hidden w-full rounded-lg"
      >
        Reset
      </Button>
    </div>
  )
}

export function RandomizeScript() {
  return (
    <Script
      id="randomize-listener"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
            (function() {
              // Forward R key
              document.addEventListener('keydown', function(e) {
                if ((e.key === 'r' || e.key === 'R') && !e.metaKey && !e.ctrlKey) {
                  if (
                    (e.target instanceof HTMLElement && e.target.isContentEditable) ||
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    e.target instanceof HTMLSelectElement
                  ) {
                    return;
                  }
                  e.preventDefault();
                  if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                      type: '${RANDOMIZE_FORWARD_TYPE}',
                      key: e.key
                    }, '*');
                  }
                }
              });

            })();
          `,
      }}
    />
  )
}
