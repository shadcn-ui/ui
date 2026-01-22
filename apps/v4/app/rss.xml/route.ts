import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"
import fm from "front-matter"

import { siteConfig } from "@/lib/config"
import { source } from "@/lib/source"

export const revalidate = false

function getDateFromFile(slugs: string[]): Date | null {
  const filePath = path.join(
    process.cwd(),
    "content/docs",
    ...slugs.slice(0, -1),
    `${slugs[slugs.length - 1]}.mdx`
  )
  try {
    const content = fs.readFileSync(filePath, "utf-8")
    const { attributes } = fm<{ date?: string | Date }>(content)
    if (attributes.date) {
      return new Date(attributes.date)
    }
  } catch {
    // File not found or parse error.
  }
  return null
}

export async function GET() {
  // Get all changelog pages.
  const pages = source
    .getPages()
    .filter((page) => page.slugs[0] === "changelog" && page.slugs.length > 1)
    .map((page) => ({
      ...page,
      date: getDateFromFile(page.slugs),
    }))
    .sort((a, b) => {
      const dateA = a.date?.getTime() ?? 0
      const dateB = b.date?.getTime() ?? 0
      return dateB - dateA
    })

  const items = pages
    .map((page) => {
      const data = page.data as {
        title: string
        description?: string
      }
      const date = page.date?.toUTCString() ?? new Date().toUTCString()
      const link = `${siteConfig.url}/docs/${page.slugs.join("/")}`

      return `    <item>
      <title><![CDATA[${data.title}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <description><![CDATA[${data.description || ""}]]></description>
      <pubDate>${date}</pubDate>
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name} Changelog</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <language>en-us</language>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  })
}
