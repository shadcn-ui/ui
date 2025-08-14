import { notFound } from "next/navigation"
import { NextResponse, type NextRequest } from "next/server"

import { source } from "@/lib/source"

export const revalidate = false

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const slug = (await params).slug
  const page = source.getPage(slug)

  if (!page) {
    notFound()
  }

  // @ts-expect-error - revisit fumadocs types.
  return new NextResponse(page.data.content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  })
}

export function generateStaticParams() {
  return source.generateParams()
}
