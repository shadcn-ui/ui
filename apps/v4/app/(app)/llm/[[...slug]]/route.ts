import { notFound } from "next/navigation"
import { NextResponse, type NextRequest } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

import { processMdxForLLMs } from "@/lib/llm"
import { source } from "@/lib/source/metadata"
import { pagesManifest } from "@/lib/source/manifest"
import { getActiveStyle } from "@/registry/styles"

export const revalidate = false

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const [{ slug }, activeStyle] = await Promise.all([params, getActiveStyle()])

  const page = source.getPage(slug)

  if (!page) {
    notFound()
  }

  // Find metadata and read raw file
  const metadata = pagesManifest.find((p) => {
    if (!slug || slug.length === 0) return p.slug.length === 0
    return p.slug.join("/") === slug.join("/")
  })

  if (!metadata) {
    notFound()
  }

  // Try to read the raw MDX file
  let rawContent = ""
  const possiblePaths = []

  if (metadata.slug.length === 0) {
    possiblePaths.push(join(process.cwd(), "content/docs/(root)/index.mdx"))
  } else if (metadata.slug.length === 1) {
    possiblePaths.push(join(process.cwd(), "content/docs/(root)", `${metadata.slug[0]}.mdx`))
    possiblePaths.push(join(process.cwd(), "content/docs", metadata.slug[0], "index.mdx"))
  } else {
    possiblePaths.push(join(process.cwd(), "content/docs", ...metadata.slug) + ".mdx")
    possiblePaths.push(join(process.cwd(), "content/docs", ...metadata.slug, "index.mdx"))
  }

  for (const filePath of possiblePaths) {
    try {
      rawContent = await readFile(filePath, "utf-8")
      break
    } catch {
      // Continue to next path
    }
  }

  if (!rawContent) {
    notFound()
  }

  const processedContent = processMdxForLLMs(rawContent, activeStyle.name)

  return new NextResponse(processedContent, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  })
}

export function generateStaticParams() {
  return source.generateParams()
}
