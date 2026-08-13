"use client"

import * as React from "react"
import { decodePreset } from "shadcn/preset"

import {
  BASE_COLORS,
  getThemesForBaseColor,
  iconLibraries,
  MENU_ACCENTS,
  MENU_COLORS,
  RADII,
  STYLES,
  type BaseColorName,
  type ChartColorName,
  type FontHeadingValue,
  type FontValue,
  type IconLibraryName,
  type MenuAccentValue,
  type MenuColorValue,
  type RadiusValue,
  type StyleName,
  type ThemeName,
} from "@/registry/config"
import { useLocks } from "@/app/(app)/(create)/hooks/use-locks"
import { FONTS } from "@/app/(app)/(create)/lib/fonts"
import { getPresetCode } from "@/app/(app)/(create)/lib/preset-code"
import {
  applyBias,
  RANDOMIZE_BIASES,
  type RandomizeContext,
} from "@/app/(app)/(create)/lib/randomize-biases"
import {
  isTranslucentMenuColor,
  useDesignSystemSearchParams,
} from "@/app/(app)/(create)/lib/search-params"
import { SHUFFLE_PRESETS } from "@/app/(app)/(create)/lib/shuffle-presets"

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

  // True-random implementation. Kept, but shuffle is now wired to the
  // curated preset list below.
  const randomizeTrueRandom = React.useCallback(() => {
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

  // Picks a random preset from the curated list instead of true random.
  // Locked params are preserved over the decoded preset values.
  const randomize = React.useCallback(() => {
    // Avoid re-picking the preset that is currently applied.
    const currentCode = getPresetCode(paramsRef.current)
    const availableCodes = SHUFFLE_PRESETS.filter(
      (code) => code !== currentCode
    )
    const decoded = decodePreset(
      randomItem(availableCodes.length > 0 ? availableCodes : SHUFFLE_PRESETS)
    )

    if (!decoded) {
      return
    }

    const current = paramsRef.current
    const nextParams = {
      style: locks.has("style") ? current.style : (decoded.style as StyleName),
      baseColor: locks.has("baseColor")
        ? current.baseColor
        : (decoded.baseColor as BaseColorName),
      theme: locks.has("theme") ? current.theme : (decoded.theme as ThemeName),
      chartColor: locks.has("chartColor")
        ? current.chartColor
        : ((decoded.chartColor ?? decoded.theme) as ChartColorName),
      iconLibrary: locks.has("iconLibrary")
        ? current.iconLibrary
        : (decoded.iconLibrary as IconLibraryName),
      font: locks.has("font") ? current.font : (decoded.font as FontValue),
      fontHeading: locks.has("fontHeading")
        ? current.fontHeading
        : (decoded.fontHeading as FontHeadingValue),
      menuAccent: locks.has("menuAccent")
        ? current.menuAccent
        : (decoded.menuAccent as MenuAccentValue),
      menuColor: locks.has("menuColor")
        ? current.menuColor
        : (decoded.menuColor as MenuColorValue),
      radius: locks.has("radius")
        ? current.radius
        : (decoded.radius as RadiusValue),
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

  return { randomize, randomizeTrueRandom }
}
