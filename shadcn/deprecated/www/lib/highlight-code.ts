import { codeToHtml } from "shiki"

export async function highlightCode(code: string) {
  const html = await codeToHtml(code, {
    lang: "jsx",
    theme: "github-dark-default",
    transformers: [
      {
        code(node) {
          node.properties["data-line-numbers"] = ""
        },
      },
    ],
  })

  return html
}
