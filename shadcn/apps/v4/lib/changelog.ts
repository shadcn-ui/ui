import fs from "fs"
import path from "path"
import fm from "front-matter"

import { source } from "@/lib/source"

export type ChangelogPageData = {
  title: string
  description?: string
}

export type ChangelogPage = ReturnType<typeof source.getPages>[number] & {
  date: Date | null
}

// Reads the date from the frontmatter of a changelog file.
export function getDateFromFile(slugs: string[]) {
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

// Gets all changelog pages sorted by date descending.
export function getChangelogPages() {
  return source
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
}
