import fs from "fs"

import { source } from "@/lib/source"
import { Index } from "@/registry/__index__"
import { type Style } from "@/registry/_legacy-styles"

function getComponentsList() {
  const components = source.pageTree.children.find(
    (page) => page.$id === "components"
  )

  if (components?.type !== "folder") {
    return ""
  }

  const list = components.children.filter(
    (component) => component.type === "page"
  )

  return list
    .map((component) => `- [${component.name}](${component.url})`)
    .join("\n")
}

export function processMdxForLLMs(content: string, style: Style["name"]) {
  // Replace <ComponentsList /> with a markdown list of components.
  const componentsListRegex = /<ComponentsList\s*\/>/g
  content = content.replace(componentsListRegex, getComponentsList())

  const componentPreviewRegex =
    /<ComponentPreview[\s\S]*?name="([^"]+)"[\s\S]*?\/>/g

  return content.replace(componentPreviewRegex, (match, name) => {
    try {
      const component = Index[style]?.[name]
      if (!component?.files) {
        return match
      }

      const src = component.files[0]?.path
      if (!src) {
        return match
      }

      let source = fs.readFileSync(src, "utf8")
      source = source.replaceAll(`@/registry/new-york-v4/`, "@/components/")
      source = source.replaceAll("export default", "export")

      return `\`\`\`tsx
${source}
\`\`\``
    } catch (error) {
      console.error(`Error processing ComponentPreview ${name}:`, error)
      return match
    }
  })
}
