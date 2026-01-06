import fs, { promises as fsPromises } from "fs"
import path from "path"
import type { configSchema } from "shadcn/schema"
import {
  createStyleMap,
  transformIcons,
  transformMenu,
  transformRender,
  transformStyle,
} from "shadcn/utils"
import { Project, ScriptKind } from "ts-morph"
import { u } from "unist-builder"
import { visit } from "unist-util-visit"
import { z } from "zod"

import { Index as StylesIndex } from "@/registry/__index__"
import { getActiveStyle } from "@/registry/_legacy-styles"
import { Index as BasesIndex } from "@/registry/bases/__index__"

// Map style names to their corresponding index and key.
function getIndexForStyle(styleName: string) {
  if (styleName.startsWith("radix-")) {
    return { index: BasesIndex, key: "radix" }
  }
  if (styleName.startsWith("base-")) {
    return { index: BasesIndex, key: "base" }
  }
  return { index: StylesIndex, key: styleName }
}

// Extract style name from compound style (e.g., "radix-nova" → "nova").
function getStyleFromStyleName(styleName: string) {
  const parts = styleName.split("-")
  return parts.length > 1 ? parts.slice(1).join("-") : styleName
}

// Build minimal config for transforms.
function buildDisplayConfig(styleName: string): z.infer<typeof configSchema> {
  return {
    $schema: "https://ui.shadcn.com/schema.json",
    style: styleName,
    rsc: true,
    tsx: true,
    tailwind: {
      config: "",
      css: "",
      baseColor: "neutral",
      cssVariables: true,
      prefix: "",
    },
    iconLibrary: "lucide",
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
    resolvedPaths: {
      cwd: "/",
      tailwindConfig: "",
      tailwindCss: "",
      utils: "@/lib/utils",
      components: "@/components",
      lib: "@/lib",
      hooks: "@/hooks",
      ui: "@/components/ui",
    },
  }
}

// Cache for style maps to avoid repeated file reads.
const styleMapCache = new Map<string, Record<string, string>>()

async function getStyleMap(styleName: string) {
  const style = getStyleFromStyleName(styleName)

  if (styleMapCache.has(style)) {
    return styleMapCache.get(style)!
  }

  try {
    const cssPath = path.join(
      process.cwd(),
      `registry/styles/style-${style}.css`
    )
    const css = await fsPromises.readFile(cssPath, "utf-8")
    const styleMap = createStyleMap(css)
    styleMapCache.set(style, styleMap)
    return styleMap
  } catch {
    // Return empty style map if file not found.
    return {}
  }
}

export async function transformForDisplay(content: string, styleName: string) {
  try {
    // 1. Apply style transformation (cn-* → Tailwind classes).
    const styleMap = await getStyleMap(styleName)
    let transformed = await transformStyle(content, { styleMap })

    // 2. Apply icon/menu/render transforms.
    const config = buildDisplayConfig(styleName)
    const project = new Project({ compilerOptions: {} })
    const sourceFile = project.createSourceFile("component.tsx", transformed, {
      scriptKind: ScriptKind.TSX,
    })

    const transformers = [transformIcons, transformMenu, transformRender]
    for (const transformer of transformers) {
      await transformer({
        filename: "component.tsx",
        raw: transformed,
        sourceFile,
        config,
      })
    }

    return sourceFile.getText()
  } catch (error) {
    // Return original content if transform fails.
    console.error("Transform failed:", error)
    return content
  }
}

interface UnistNode {
  type: string
  name?: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  attributes?: {
    name: string
    value: unknown
    type?: string
  }[]
  children?: UnistNode[]
}

export interface UnistTree {
  type: string
  children: UnistNode[]
}

// Collected node info for async processing.
interface NodeToProcess {
  node: UnistNode
  type: "ComponentSource" | "ComponentPreview"
  name: string
  styleName: string
  fileName?: string
  srcPath?: string
}

export function rehypeComponent() {
  return async (tree: UnistTree) => {
    const activeStyle = await getActiveStyle()
    const nodesToProcess: NodeToProcess[] = []

    // First pass: collect all nodes that need processing.
    visit(tree, (node: UnistNode) => {
      const { value: srcPath } =
        (getNodeAttributeByName(node, "src") as {
          name: string
          value?: string
          type?: string
        }) || {}

      if (node.name === "ComponentSource") {
        const name = getNodeAttributeByName(node, "name")?.value as string
        const fileName = getNodeAttributeByName(node, "fileName")?.value as
          | string
          | undefined
        const styleName =
          (getNodeAttributeByName(node, "styleName")?.value as string) ||
          activeStyle.name

        if (name || srcPath) {
          nodesToProcess.push({
            node,
            type: "ComponentSource",
            name,
            styleName,
            fileName,
            srcPath,
          })
        }
      }

      if (node.name === "ComponentPreview") {
        const name = getNodeAttributeByName(node, "name")?.value as string
        const styleName =
          (getNodeAttributeByName(node, "styleName")?.value as string) ||
          activeStyle.name

        if (name) {
          nodesToProcess.push({
            node,
            type: "ComponentPreview",
            name,
            styleName,
          })
        }
      }
    })

    // Second pass: process all collected nodes asynchronously.
    await Promise.all(
      nodesToProcess.map(async (item) => {
        try {
          let src: string

          if (item.srcPath) {
            src = path.join(process.cwd(), item.srcPath)
          } else {
            const { index, key } = getIndexForStyle(item.styleName)
            const component = index[key]?.[item.name]

            if (item.type === "ComponentSource" && item.fileName) {
              src =
                component.files.find((file: unknown) => {
                  if (typeof file === "string") {
                    return (
                      file.endsWith(`${item.fileName}.tsx`) ||
                      file.endsWith(`${item.fileName}.ts`)
                    )
                  }
                  return false
                }) || component.files[0]?.path
            } else {
              src = component.files[0]?.path
            }
          }

          // Read the source file.
          let source = fs.readFileSync(src, "utf8")

          // Replace imports.
          source = source.replaceAll(
            `@/registry/${item.styleName}/`,
            "@/components/"
          )
          source = source.replaceAll(`@/registry/bases/radix/`, "@/components/")
          source = source.replaceAll(`@/registry/bases/base/`, "@/components/")
          source = source.replaceAll("export default", "export")

          // Apply transforms (cn-* → Tailwind, IconPlaceholder → icons, etc.).
          source = await transformForDisplay(source, item.styleName)

          // Add code as children so that rehype can take over at build time.
          item.node.children?.push(
            u("element", {
              tagName: "pre",
              properties: {
                __src__: src,
              },
              children: [
                u("element", {
                  tagName: "code",
                  properties: {
                    className: ["language-tsx"],
                  },
                  children: [
                    {
                      type: "text",
                      value: source,
                    },
                  ],
                }),
              ],
            })
          )
        } catch (error) {
          console.error(error)
        }
      })
    )
  }
}

function getNodeAttributeByName(node: UnistNode, name: string) {
  return node.attributes?.find((attribute) => attribute.name === name)
}
