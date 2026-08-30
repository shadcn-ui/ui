import fs from "fs"
import path from "path"
import { ExamplesIndex } from "@/examples/__index__"
import { u } from "unist-builder"
import { visit } from "unist-util-visit"

import { formatCode } from "@/lib/format-code"
import { Index as StylesIndex } from "@/registry/__index__"
import { getActiveStyle } from "@/registry/_legacy-styles"
import { BASES } from "@/registry/bases"
import { Index as BasesIndex } from "@/registry/bases/__index__"

export { formatCode } from "@/lib/format-code"

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
  const demo =
    ExamplesIndex[styleName]?.[name] ??
    (base ? ExamplesIndex[base]?.[name] : undefined)
  if (!demo) return null

  return demo.filePath
}

function getRegistryEntry(name: string, styleName: string) {
  const base = getBaseForStyle(styleName)
  return (
    StylesIndex[styleName]?.[name] ??
    (base ? BasesIndex[base]?.[name] : undefined)
  )
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
  hideCode?: boolean
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
        const hideCode = isTruthyMdxAttribute(
          getNodeAttributeByName(node, "hideCode")
        )

        if (name) {
          nodesToProcess.push({
            node,
            type: "ComponentPreview",
            name,
            styleName,
            hideCode,
          })
        }
      }
    })

    await Promise.all(
      nodesToProcess.map(async (item) => {
        try {
          if (item.type === "ComponentPreview" && item.hideCode) {
            return
          }

          let src: string | null = null

          if (item.srcPath) {
            src = path.join(process.cwd(), item.srcPath)
          } else {
            src = getDemoFilePath(item.name, item.styleName)

            if (!src) {
              const component = getRegistryEntry(item.name, item.styleName)

              if (!component?.files) {
                return
              }

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

          const raw = fs.readFileSync(path.join(process.cwd(), src), "utf8")
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

function isTruthyMdxAttribute(
  attribute?: {
    value?: unknown
  } | null
) {
  if (!attribute) return false

  if (!("value" in attribute)) return true

  const { value } = attribute

  if (value === undefined || value === null) return true
  if (typeof value === "boolean") return value
  if (typeof value === "string") return value !== "false"
  return Boolean(value)
}
