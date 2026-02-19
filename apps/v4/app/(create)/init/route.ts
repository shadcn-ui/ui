import { NextResponse, type NextRequest } from "next/server"
import { track } from "@vercel/analytics/server"
import { decodePreset, isPresetCode } from "shadcn/preset"
import { registryItemSchema } from "shadcn/schema"

import { buildRegistryBase, designSystemConfigSchema } from "@/registry/config"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Decode preset code if present.
    let configInput: Record<string, unknown>
    const presetParam = searchParams.get("preset")

    if (presetParam && isPresetCode(presetParam)) {
      const decoded = decodePreset(presetParam)
      if (!decoded) {
        return NextResponse.json(
          { error: "Invalid preset code" },
          { status: 400 }
        )
      }
      configInput = {
        ...decoded,
        template: searchParams.get("template") ?? undefined,
        rtl: searchParams.get("rtl") === "true",
      }
    } else {
      configInput = {
        base: searchParams.get("base"),
        style: searchParams.get("style"),
        iconLibrary: searchParams.get("iconLibrary"),
        baseColor: searchParams.get("baseColor"),
        theme: searchParams.get("theme"),
        font: searchParams.get("font"),
        menuAccent: searchParams.get("menuAccent"),
        menuColor: searchParams.get("menuColor"),
        radius: searchParams.get("radius"),
        template: searchParams.get("template") ?? undefined,
        rtl: searchParams.get("rtl") === "true",
      }
    }

    const result = designSystemConfigSchema.safeParse(configInput)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      )
    }

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

    track("create_app", result.data)

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
