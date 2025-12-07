import { NextRequest, NextResponse } from "next/server"
import { registryItemSchema } from "shadcn/schema"

import { trackEvent } from "@/lib/events"
import { buildRegistryBase, designSystemConfigSchema } from "@/registry/config"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const result = designSystemConfigSchema.safeParse({
      base: searchParams.get("base"),
      style: searchParams.get("style"),
      iconLibrary: searchParams.get("iconLibrary"),
      baseColor: searchParams.get("baseColor"),
      theme: searchParams.get("theme"),
      font: searchParams.get("font"),
      menuAccent: searchParams.get("menuAccent"),
      menuColor: searchParams.get("menuColor"),
      radius: searchParams.get("radius"),
    })

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

    trackEvent({
      name: "create_app",
      properties: {
        base: result.data.base ?? null,
        style: result.data.style ?? null,
        iconLibrary: result.data.iconLibrary ?? null,
        baseColor: result.data.baseColor ?? null,
        theme: result.data.theme ?? null,
        font: result.data.font ?? null,
        menuAccent: result.data.menuAccent ?? null,
        menuColor: result.data.menuColor ?? null,
        radius: result.data.radius ?? null,
      },
    })

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
