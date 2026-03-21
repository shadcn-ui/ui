import type {
  BaseColorName,
  Radius,
  StyleName,
  ThemeName,
} from "@/registry/config"

import { type FONTS } from "./fonts"

export type RandomizeContext = {
  style?: StyleName
  baseColor?: BaseColorName
  theme?: ThemeName
  iconLibrary?: string
  font?: string
  menuAccent?: string
  menuColor?: string
  radius?: string
}

export type BiasFilter<T> = (
  items: readonly T[],
  context: RandomizeContext
) => readonly T[]

export type RandomizeBiases = {
  fonts?: BiasFilter<(typeof FONTS)[number]>
  radius?: BiasFilter<Radius>
  // Add more bias filters as needed:
  // styles?: BiasFilter<Style>
  // baseColors?: BiasFilter<BaseColor>
  // themes?: BiasFilter<Theme>
  // etc.
}

/**
 * Configuration for randomization biases.
 * Add biases here to influence random selection based on context.
 */
export const RANDOMIZE_BIASES: RandomizeBiases = {
  fonts: (fonts, context) => {
    // When style is lyra, only use mono fonts.
    if (context.style === "lyra") {
      return fonts.filter((font) => font.value === "jetbrains-mono")
    }

    return fonts
  },
  radius: (radii, context) => {
    // When style is lyra, always use "none" radius
    if (context.style === "lyra") {
      return radii.filter((radius) => radius.name === "none")
    }

    return radii
  },
  // Add more biases here as needed:
  // Example: When baseColor is "blue", prefer certain themes
  // themes: (themes, context) => {
  //   if (context.baseColor === "blue") {
  //     return themes.filter(theme => theme.name.includes("dark"))
  //   }
  //   return themes
  // },
}

/**
 * Applies biases to a list of items based on the current context.
 */
export function applyBias<T>(
  items: readonly T[],
  context: RandomizeContext,
  biasFilter?: BiasFilter<T>
): readonly T[] {
  if (!biasFilter) {
    return items
  }

  return biasFilter(items, context)
}
