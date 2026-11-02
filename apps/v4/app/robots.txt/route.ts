import { NextResponse } from "next/server"

const robots = `User-agent: *
Allow: /

Content-Signal: ai-train=no, search=yes, ai-input=yes

Sitemap: https://ui.shadcn.com/sitemap.xml
`

export function GET() {
  return new NextResponse(robots, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
