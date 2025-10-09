import { NextRequest, NextResponse } from "next/server"
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation"

// Rewrite /docs/* to /llm/* when markdown is preferred (for AI agents)
const { rewrite: rewriteLLM } = rewritePath("/docs/*path", "/llm/*path")

export function middleware(request: NextRequest) {
  // Check if the request prefers markdown (AI agents like Claude Code, OpenCode, etc.)
  if (isMarkdownPreferred(request)) {
    const result = rewriteLLM(request.nextUrl.pathname)

    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/docs/:path*",
}
