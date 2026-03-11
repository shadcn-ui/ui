import { NextResponse, type NextRequest } from "next/server"
import { track } from "@vercel/analytics/server"
import { encodePreset, isPresetCode } from "shadcn/preset"
import { registryItemSchema } from "shadcn/schema"

import { buildRegistryBase } from "@/registry/config"
import { parseDesignSystemConfig } from "@/app/(create)/init/parse-config"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const result = parseDesignSystemConfig(searchParams)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // Use the preset code from the URL if provided, otherwise encode one.
    const presetParam = searchParams.get("preset")
    const presetCode =
      presetParam && isPresetCode(presetParam)
        ? presetParam
        : encodePreset({
            style: result.data.style,
            baseColor: result.data.baseColor,
            theme: result.data.theme,
            iconLibrary: result.data.iconLibrary,
            font: result.data.font,
            radius: result.data.radius,
            menuAccent: result.data.menuAccent,
            menuColor: result.data.menuColor,
          } as Parameters<typeof encodePreset>[0])

    const registryBase = buildRegistryBase(result.data)
    const parseResult = registryItemSchema.safeParse(registryBase)

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid registry base item",
          details: parseResult.error.format(),
        },
        { status: 500 }
      )
    }

    if (searchParams.get("track") === "1") {
      track("create_app", {
        ...result.data,
        preset: presetCode,
      })
    }

    return NextResponse.json(parseResult.data)
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
