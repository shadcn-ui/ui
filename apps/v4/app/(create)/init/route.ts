import { NextResponse, type NextRequest } from "next/server"
import { track } from "@vercel/analytics/server"
import { registryItemSchema } from "shadcn/schema"

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
      template: searchParams.get("template"),
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
