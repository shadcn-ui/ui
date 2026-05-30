import { type NextRequest } from "next/server"
import { track } from "@vercel/analytics/server"

import { parseDesignSystemConfig } from "@/app/(create)/init/parse-config"

import { buildInstructions } from "./build-instructions"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const result = parseDesignSystemConfig(searchParams)

    if (!result.success) {
      return new Response(result.error, { status: 400 })
    }

    track("create_app_manual", result.data)

    const markdown = buildInstructions(result.data)

    return new Response(markdown, {
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
  } catch (error) {
    return new Response(
      error instanceof Error ? error.message : "An unknown error occurred",
      { status: 500 }
    )
  }
}
