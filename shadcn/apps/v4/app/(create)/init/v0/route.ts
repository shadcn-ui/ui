import { after, NextResponse, type NextRequest } from "next/server"
import { track } from "@vercel/analytics/server"

import { parseDesignSystemConfig } from "@/app/(create)/init/parse-config"
import { buildV0Payload } from "@/app/(create)/lib/v0"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const result = parseDesignSystemConfig(searchParams)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // Defer analytics to after response is sent.
    after(() => {
      track("create_open_in_v0", {
        ...result.data,
        preset: searchParams.get("preset") ?? "",
      })
    })

    const payload = await buildV0Payload(result.data)

    return NextResponse.json(payload)
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
