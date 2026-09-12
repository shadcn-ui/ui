import { notFound } from "next/navigation"
import { NextResponse, type NextRequest } from "next/server"

import { processMdxForLLMs } from "@/lib/llm"
import { source } from "@/lib/source"
import { type Style } from "@/registry/_legacy-styles"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = true

const DEFAULT_STYLE_BY_BASE: Record<string, string> = {
  base: "base-nova",
  ark: "ark-nova",
  aria: "aria-nova",
  radix: "new-york-v4", // radix's default style is new-york, not radix-nova
}

// Map /docs/components/<base> to its default style.
function getStyleFromSlug(slug: string[] | undefined, fallbackStyle: string) {
  if (slug?.[0] === "components" && slug[1]) {
    return DEFAULT_STYLE_BY_BASE[slug[1]] ?? fallbackStyle
  }
  return fallbackStyle
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params

  const page = source.getPage(slug)

  if (!page) {
    notFound()
  }

  // Default to the base style. Legacy content pins new-york-v4 per tag.
  const effectiveStyle = getStyleFromSlug(slug, "base-nova")

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
  return []
}
