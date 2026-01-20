import fs, { promises as fsPromises } from "fs"
import path from "path"
import { ExamplesIndex } from "@/examples/__index__"
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

import { Index as StylesIndex } from "@/registry/__index__"
import { getActiveStyle } from "@/registry/_legacy-styles"
import { BASES } from "@/registry/bases"
import { Index as BasesIndex } from "@/registry/bases/__index__"

function getBaseForStyle(styleName: string) {
  for (const base of BASES) {
    if (styleName.startsWith(`${base.name}-`)) {
      return base.name
    }
  }
  return null
}

function getDemoFilePath(name: string, styleName: string) {
  const base = getBaseForStyle(styleName)
  if (!base) return null

  const demo = ExamplesIndex[base]?.[name]
  if (!demo) return null

  return path.join(process.cwd(), demo.filePath)
}

function getIndexForStyle(styleName: string) {
  const base = getBaseForStyle(styleName)
  if (base) {
    return { index: BasesIndex, key: base }
  }
  return { index: StylesIndex, key: styleName }
}

function getStyleFromStyleName(styleName: string) {
  const parts = styleName.split("-")
  return parts.length > 1 ? parts.slice(1).join("-") : styleName
}

function buildDisplayConfig(styleName: string) {
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
    return {}
  }
}

export async function formatCode(code: string, styleName: string) {
  code = code.replaceAll(`@/registry/${styleName}/`, "@/components/")

  for (const base of BASES) {
    code = code.replaceAll(`@/registry/bases/${base.name}/`, "@/components/")
    code = code.replaceAll(`@/examples/${base.name}/ui/`, "@/components/ui/")
    code = code.replaceAll(`@/examples/${base.name}/lib/`, "@/lib/")
    code = code.replaceAll(`@/examples/${base.name}/hooks/`, "@/hooks/")
  }

  code = code.replaceAll("export default", "export")

  try {
    const styleMap = await getStyleMap(styleName)
    const transformed = await transformStyle(code, { styleMap })
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
    console.error("Transform failed:", error)
    return code
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

    await Promise.all(
      nodesToProcess.map(async (item) => {
        try {
          let src: string | null = null

          if (item.srcPath) {
            src = path.join(process.cwd(), item.srcPath)
          } else {
            src = getDemoFilePath(item.name, item.styleName)

            if (!src) {
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
          }

          if (!src) {
            return
          }

          const raw = fs.readFileSync(src, "utf8")
          const source = await formatCode(raw, item.styleName)

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
