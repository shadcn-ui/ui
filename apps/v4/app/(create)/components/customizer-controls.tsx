"use client"

import { useRouter } from "next/navigation"
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
import { FONTS } from "@/app/(create)/lib/fonts"
import { designSystemSearchParams } from "@/app/(create)/lib/search-params"

function randomItem<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function CustomizerControls({ className }: { className?: string }) {
  const router = useRouter()
  const [, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const handleRandomize = () => {
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
  }

  return (
    <div className={cn("items-center gap-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRandomize}
        className="border-foreground/10 bg-muted/50 h-[calc(--spacing(13.5))] w-[140px] touch-manipulation justify-between rounded-xl border select-none sm:h-8 sm:rounded-lg md:h-9 md:w-full md:rounded-lg md:border-transparent md:bg-transparent md:px-2"
      >
        Randomize{" "}
        <HugeiconsIcon
          icon={DiceFaces05Icon}
          className="mr-1.5 size-5 md:size-4"
        />
      </Button>
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
