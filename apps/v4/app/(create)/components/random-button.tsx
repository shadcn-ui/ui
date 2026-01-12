"use client"

import * as React from "react"
import Script from "next/script"
import { DiceFaces05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

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
import { useLocks } from "@/app/(create)/hooks/use-locks"
import { FONTS } from "@/app/(create)/lib/fonts"
import {
  applyBias,
  RANDOMIZE_BIASES,
  type RandomizeContext,
} from "@/app/(create)/lib/randomize-biases"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export const RANDOMIZE_FORWARD_TYPE = "randomize-forward"

function randomItem<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function RandomButton() {
  const { locks } = useLocks()
  const [params, setParams] = useDesignSystemSearchParams()

  const handleRandomize = React.useCallback(() => {
    // Use current value if locked, otherwise randomize.
    const baseColor = locks.has("baseColor")
      ? params.baseColor
      : randomItem(BASE_COLORS).name
    const selectedStyle = locks.has("style")
      ? params.style
      : randomItem(STYLES).name

    // Build context for bias application.
    const context: RandomizeContext = {
      style: selectedStyle,
      baseColor,
    }

    const availableThemes = getThemesForBaseColor(baseColor)
    const availableFonts = applyBias(FONTS, context, RANDOMIZE_BIASES.fonts)
    const availableRadii = applyBias(RADII, context, RANDOMIZE_BIASES.radius)

    const selectedTheme = locks.has("theme")
      ? params.theme
      : randomItem(availableThemes).name
    const selectedFont = locks.has("font")
      ? params.font
      : randomItem(availableFonts).value
    const selectedRadius = locks.has("radius")
      ? params.radius
      : randomItem(availableRadii).name
    const selectedIconLibrary = locks.has("iconLibrary")
      ? params.iconLibrary
      : randomItem(Object.values(iconLibraries)).name
    const selectedMenuAccent = locks.has("menuAccent")
      ? params.menuAccent
      : randomItem(MENU_ACCENTS).value
    const selectedMenuColor = locks.has("menuColor")
      ? params.menuColor
      : randomItem(MENU_COLORS).value

    // Update context with selected values for potential future biases.
    context.theme = selectedTheme
    context.font = selectedFont
    context.radius = selectedRadius

    setParams({
      style: selectedStyle,
      baseColor,
      theme: selectedTheme,
      iconLibrary: selectedIconLibrary,
      font: selectedFont,
      menuAccent: selectedMenuAccent,
      menuColor: selectedMenuColor,
      radius: selectedRadius,
    })
  }, [setParams, locks, params])

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
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRandomize}
          className="border-foreground/10 bg-muted/50 h-[calc(--spacing(13.5))] w-[140px] touch-manipulation justify-between rounded-xl border select-none focus-visible:border-transparent focus-visible:ring-1 sm:rounded-lg md:w-full md:rounded-lg md:border-transparent md:bg-transparent md:pr-3.5! md:pl-2!"
        >
          <div className="flex flex-col justify-start text-left">
            <div className="text-muted-foreground text-xs">Shuffle</div>
            <div className="text-foreground text-sm font-medium">
              Try Random
            </div>
          </div>
          <HugeiconsIcon icon={DiceFaces05Icon} className="size-5 md:hidden" />
          <Kbd className="bg-foreground/10 text-foreground hidden md:flex">
            R
          </Kbd>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        Use browser back/forward to navigate history
      </TooltipContent>
    </Tooltip>
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
