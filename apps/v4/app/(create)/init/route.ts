import { NextResponse, type NextRequest } from "next/server"
import { track } from "@vercel/analytics/server"
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

    track("create_app", {
      ...result.data,
      preset: searchParams.get("preset") ?? "",
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
