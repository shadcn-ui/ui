"use client"

import * as React from "react"

import {
  BASE_COLORS,
  getThemesForBaseColor,
  iconLibraries,
  MENU_ACCENTS,
  MENU_COLORS,
  RADII,
  STYLES,
  type FontHeadingValue,
} from "@/registry/config"
import { useLocks } from "@/app/(create)/hooks/use-locks"
import { FONTS } from "@/app/(create)/lib/fonts"
import {
  applyBias,
  RANDOMIZE_BIASES,
  type RandomizeContext,
} from "@/app/(create)/lib/randomize-biases"
import {
  isTranslucentMenuColor,
  useDesignSystemSearchParams,
} from "@/app/(create)/lib/search-params"

function randomItem<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function useRandom() {
  const { locks } = useLocks()
  const [params, setParams] = useDesignSystemSearchParams()

  const paramsRef = React.useRef(params)
  React.useEffect(() => {
    paramsRef.current = params
  }, [params])

  const randomize = React.useCallback(() => {
    const selectedStyle = locks.has("style")
      ? paramsRef.current.style
      : randomItem(STYLES).name

    const context: RandomizeContext = {
      style: selectedStyle,
    }

    const availableBaseColors = applyBias(
      BASE_COLORS,
      context,
      RANDOMIZE_BIASES.baseColors
    )
    const baseColor = locks.has("baseColor")
      ? paramsRef.current.baseColor
      : randomItem(availableBaseColors).name
    context.baseColor = baseColor

    const availableThemes = getThemesForBaseColor(baseColor)
    const availableFonts = applyBias(FONTS, context, RANDOMIZE_BIASES.fonts)
    const availableRadii = applyBias(RADII, context, RANDOMIZE_BIASES.radius)

    const selectedTheme = locks.has("theme")
      ? paramsRef.current.theme
      : randomItem(availableThemes).name
    context.theme = selectedTheme

    const availableChartColors = applyBias(
      getThemesForBaseColor(baseColor),
      context,
      RANDOMIZE_BIASES.chartColors
    )
    const selectedChartColor = locks.has("chartColor")
      ? paramsRef.current.chartColor
      : randomItem(availableChartColors).name
    context.chartColor = selectedChartColor
    const selectedFont = locks.has("font")
      ? paramsRef.current.font
      : randomItem(availableFonts).value
    context.font = selectedFont

    // Pick heading font: ~70% inherit, ~30% distinct with cross-category contrast.
    let selectedFontHeading: FontHeadingValue
    if (locks.has("fontHeading")) {
      selectedFontHeading = paramsRef.current.fontHeading
    } else if (Math.random() < 0.7) {
      selectedFontHeading = "inherit"
    } else {
      const bodyType = availableFonts.find(
        (f) => f.value === selectedFont
      )?.type
      const contrastFonts = availableFonts.filter(
        (f) => f.type !== bodyType && f.value !== selectedFont
      )
      selectedFontHeading = (
        contrastFonts.length > 0
          ? randomItem(contrastFonts)
          : randomItem(availableFonts)
      ).value as FontHeadingValue
    }
    const selectedRadius = locks.has("radius")
      ? paramsRef.current.radius
      : randomItem(availableRadii).name
    const selectedIconLibrary = locks.has("iconLibrary")
      ? paramsRef.current.iconLibrary
      : randomItem(Object.values(iconLibraries)).name
    const lockedMenuAccent = locks.has("menuAccent")
      ? paramsRef.current.menuAccent
      : undefined
    const availableMenuColors =
      !locks.has("menuColor") && lockedMenuAccent === "bold"
        ? MENU_COLORS.filter((menuColor) => {
            return !isTranslucentMenuColor(menuColor.value)
          })
        : MENU_COLORS
    const selectedMenuColor = locks.has("menuColor")
      ? paramsRef.current.menuColor
      : randomItem(availableMenuColors).value
    const selectedMenuAccent =
      locks.has("menuAccent") || isTranslucentMenuColor(selectedMenuColor)
        ? paramsRef.current.menuAccent === "bold" &&
          isTranslucentMenuColor(selectedMenuColor)
          ? "subtle"
          : paramsRef.current.menuAccent
        : randomItem(MENU_ACCENTS).value

    context.radius = selectedRadius

    const nextParams = {
      style: selectedStyle,
      baseColor,
      theme: selectedTheme,
      chartColor: selectedChartColor,
      iconLibrary: selectedIconLibrary,
      font: selectedFont,
      fontHeading: selectedFontHeading,
      menuAccent: selectedMenuAccent,
      menuColor: selectedMenuColor,
      radius: selectedRadius,
    }

    // Keep the ref in sync so rapid repeats use the latest randomized state
    // even before the URL state finishes committing.
    paramsRef.current = {
      ...paramsRef.current,
      ...nextParams,
    }

    setParams(nextParams)
  }, [setParams, locks])

  const randomizeRef = React.useRef(randomize)
  React.useEffect(() => {
    randomizeRef.current = randomize
  }, [randomize])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "r" && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        randomizeRef.current()
      }
    }

    document.addEventListener("keydown", down)
    return () => {
      document.removeEventListener("keydown", down)
    }
  }, [])

  return { randomize }
}
