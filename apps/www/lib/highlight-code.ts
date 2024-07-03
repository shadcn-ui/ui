"use server"

import { codeToHtml } from "shiki"

export async function highlightCode(code: string) {
  const html = codeToHtml(code, {
    lang: "typescript",
    theme: "github-dark-default",
  })

  return html
}
