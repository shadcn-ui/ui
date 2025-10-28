import { notFound } from "next/navigation"
import { NextResponse, type NextRequest } from "next/server"

import { processMdxForLLMs } from "@/lib/llm"
import { source } from "@/lib/source"
import { getActiveStyle } from "@/registry/styles"

export const revalidate = false

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const [{ slug }, activeStyle] = await Promise.all([params, getActiveStyle()])

  const page = source.getPage(slug)

  if (!page) {
    notFound()
  }

  const processedContent = processMdxForLLMs(
    // @ts-expect-error - revisit fumadocs types.
    page.data.content,
    activeStyle.name
  )

  return new NextResponse(processedContent, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  })
}

export function generateStaticParams() {
  return source.generateParams()
}
