"use server"

import { promises as fs } from "fs"
import path from "path"
import { getHighlighter } from "shiki"

// Highlighting is failing in server components.
// Disabling this in development.
// TODO: Remove this when we figure out the issue.
const highlightCodeEnabled = process.env.NODE_ENV !== "development"

export async function highlightCode(code: string) {
  if (!highlightCodeEnabled) {
    return code
  }

  const editorTheme = await fs.readFile(
    path.join(process.cwd(), "lib/themes/dark.json"),
    "utf-8"
  )

  const highlighter = await getHighlighter({
    langs: ["typescript"],
    themes: [],
  })

  await highlighter.loadTheme(JSON.parse(editorTheme))

  const html = await highlighter.codeToHtml(code, {
    lang: "typescript",
    theme: "Lambda Studio — Blackout",
  })

  return html
}
