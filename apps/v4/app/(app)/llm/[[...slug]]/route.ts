import { notFound } from "next/navigation"
import { NextResponse, type NextRequest } from "next/server"

import { processMdxForLLMs } from "@/lib/llm"
import { source } from "@/lib/source"
import { getActiveStyle, type Style } from "@/registry/_legacy-styles"

export const revalidate = false

function getStyleFromSlug(slug: string[] | undefined, fallbackStyle: string) {
  // Detect base from URL: /docs/components/base/... or /docs/components/radix/...
  if (slug && slug[0] === "components" && slug[1]) {
    if (slug[1] === "base") {
      return "base-nova"
    }
    if (slug[1] === "radix") {
      return "new-york-v4"
    }
  }
  return fallbackStyle
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const [{ slug }, activeStyle] = await Promise.all([params, getActiveStyle()])

  const page = source.getPage(slug)

  if (!page) {
    notFound()
  }

  const effectiveStyle = getStyleFromSlug(slug, activeStyle.name)

  const processedContent = processMdxForLLMs(
    await page.data.getText("raw"),
    effectiveStyle as Style["name"]
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
