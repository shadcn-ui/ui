import { NextRequest, NextResponse } from "next/server"
import { RegistryBaseItem, registryItemSchema } from "shadcn/schema"

import {
  ACCENTS,
  BASE_COLORS,
  BASES,
  buildRegistryTheme,
  DEFAULT_CONFIG,
  getThemesForBaseColor,
  iconLibraries,
  RADII,
  SPACINGS,
  type AccentValue,
  type DesignSystemConfig,
  type RadiusValue,
  type SpacingValue,
} from "@/app/(design)/lib/config"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const base = searchParams.get("base")
    const iconLibrary = searchParams.get("iconLibrary")
    const style = searchParams.get("style")
    const theme = searchParams.get("theme")
    const font = searchParams.get("font") ?? "inter"
    const baseColor = searchParams.get("baseColor") ?? "neutral"
    const accent = (searchParams.get("accent") ?? "subtle") as AccentValue
    const spacing = (searchParams.get("spacing") ?? "default") as SpacingValue
    const radius = (searchParams.get("radius") ?? "default") as RadiusValue

    // Validate the base.
    const baseItem = BASES.find((b) => b.name === base)
    if (!baseItem) {
      return NextResponse.json(
        { error: `Base "${base}" not found` },
        { status: 400 }
      )
    }

    // Validate the icon library.
    const iconLibraryItem = Object.values(iconLibraries).find(
      (i) => i.name === iconLibrary
    )
    if (!iconLibraryItem) {
      return NextResponse.json(
        { error: `Icon library "${iconLibrary}" not found` },
        { status: 400 }
      )
    }

    // Validate the base color.
    const baseColorItem = BASE_COLORS.find((c) => c.name === baseColor)
    if (!baseColor || !baseColorItem) {
      return NextResponse.json(
        { error: `Base color "${baseColor}" not found` },
        { status: 400 }
      )
    }

    // Validate the theme.
    const availableThemes = getThemesForBaseColor(baseColor)
    const themeItem = availableThemes.find((t) => t.name === theme)
    if (!themeItem) {
      return NextResponse.json(
        {
          error: `Theme "${theme}" is not available for base color "${baseColor}". Available themes: ${availableThemes.map((t) => t.name).join(", ")}`,
        },
        { status: 400 }
      )
    }

    // Validate accent, spacing, and radius.
    if (!ACCENTS.some((a) => a.value === accent)) {
      return NextResponse.json(
        { error: `Invalid accent value "${accent}"` },
        { status: 400 }
      )
    }
    if (!SPACINGS.some((s) => s.value === spacing)) {
      return NextResponse.json(
        { error: `Invalid spacing value "${spacing}"` },
        { status: 400 }
      )
    }
    if (!RADII.some((r) => r.value === radius)) {
      return NextResponse.json(
        { error: `Invalid radius value "${radius}"` },
        { status: 400 }
      )
    }

    // Build the registry theme with all transformations applied.
    const config: DesignSystemConfig = {
      ...DEFAULT_CONFIG,
      baseColor: baseColorItem.name,
      theme: themeItem.name,
      accent,
      spacing,
      radius,
    }
    const registryTheme = buildRegistryTheme(config)

    // Build the dependencies.
    const dependencies = [
      "shadcn",
      "class-variance-authority",
      "tw-animate-css",
    ]

    if (baseItem.dependencies) {
      dependencies.push(...baseItem.dependencies)
    }

    if (iconLibraryItem) {
      dependencies.push(...iconLibraryItem.packages)
    }

    const registryDependencies = ["cn"]

    // Build the registry:base item.
    const registryBase: RegistryBaseItem = {
      name: `${base}-${style}`,
      extends: "none",
      type: "registry:base",
      style: `${base}-${style}`,
      iconLibrary: iconLibraryItem.name,
      baseColor,
      font,
      dependencies,
      registryDependencies,
      cssVars: registryTheme.cssVars,
      css: {
        '@import "tw-animate-css"': {},
        "@layer base": {
          "*": { "@apply border-border outline-ring/50": {} },
          body: { "@apply bg-background text-foreground": {} },
        },
      },
    }

    // Validate and return.
    const result = registryItemSchema.safeParse(registryBase)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid registry base item", details: result.error.format() },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    )
  }
}
