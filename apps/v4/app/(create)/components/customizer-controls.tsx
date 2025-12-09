"use client"

import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQueryStates } from "nuqs"

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

export function CustomizerControls() {
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
    <div className="mt-auto hidden w-full items-center gap-1 md:flex">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRandomize}
        className="rounded-lg"
      >
        Randomize
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => router.push("/create")}
        className="ml-auto rounded-lg"
      >
        Reset
      </Button>
    </div>
  )
}
