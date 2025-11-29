import { NextRequest, NextResponse } from "next/server"
import { iconLibraries } from "shadcn/icons"
import { RegistryBaseItem, registryItemSchema } from "shadcn/schema"

import { BASE_COLORS } from "@/registry/base-colors"
import { BASES } from "@/registry/bases"
import { buildTheme } from "@/app/(design)/lib/merge-theme"
import { getThemesForBaseColor } from "@/app/(design)/lib/api"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const base = searchParams.get("base")
    const iconLibrary = searchParams.get("iconLibrary")
    const style = searchParams.get("style")
    const theme = searchParams.get("theme")
    const font = searchParams.get("font") ?? "inter"
    const baseColor = searchParams.get("baseColor") ?? "neutral"

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

    const mergedTheme = buildTheme(baseColorItem.name, themeItem.name)

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
      cssVars: mergedTheme.cssVars,
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
