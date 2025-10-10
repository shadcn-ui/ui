import fs from "fs"

import { Index } from "@/registry/__index__"

export function processMdxForLLMs(content: string) {
  const componentPreviewRegex =
    /<ComponentPreview\s+[^>]*name="([^"]+)"[^>]*\/>/g

  return content.replace(componentPreviewRegex, (match, name) => {
    try {
      const component = Index[name]
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
