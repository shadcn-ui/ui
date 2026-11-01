import { promises as fs } from "fs"
import path from "path"
import { Config } from "@/src/get-config"
import { TailwindVersion } from "@/src/get-project-info"
import { highlighter } from "@/src/highlighter"
import {
  registryItemCssSchema,
  registryItemCssVarsSchema,
  registryItemTailwindSchema,
} from "@/src/registry/schema"
import { spinner } from "@/src/spinner"
import { transformCssVars } from "@/src/updaters/update-css-vars"
import { twMerge } from "cn"
import postcss from "postcss"
import AtRule from "postcss/lib/at-rule"
import Declaration from "postcss/lib/declaration"
import Root from "postcss/lib/root"
import Rule from "postcss/lib/rule"
import { z } from "zod"

export async function updateCss(
  css: z.infer<typeof registryItemCssSchema> | undefined,
  config: Config,
  options: {
    silent?: boolean
    cssVars?: z.infer<typeof registryItemCssVarsSchema>
    cleanupDefaultNextStyles?: boolean
    overwriteCssVars?: boolean
    tailwindVersion?: TailwindVersion
    tailwindConfig?: z.infer<typeof registryItemTailwindSchema>["config"]
  }
) {
  const hasCss = css && Object.keys(css).length > 0
  const hasCssVars = Object.keys(options.cssVars ?? {}).length > 0

  if (!config.resolvedPaths.tailwindCss || (!hasCss && !hasCssVars)) {
    return
  }

  options = {
    silent: false,
    ...options,
  }

  const cssFilepath = config.resolvedPaths.tailwindCss
  const cssFilepathRelative = path.relative(
    config.resolvedPaths.cwd,
    cssFilepath
  )
  const cssSpinner = spinner(
    `Updating ${highlighter.info(cssFilepathRelative)}`,
    {
      silent: options.silent,
    }
  ).start()

  let output = await fs.readFile(cssFilepath, "utf8")

  if (hasCssVars) {
    output = await transformCssVars(output, options.cssVars!, config, {
      cleanupDefaultNextStyles: options.cleanupDefaultNextStyles,
      tailwindVersion: options.tailwindVersion,
      tailwindConfig: options.tailwindConfig,
      overwriteCssVars: options.overwriteCssVars,
    })
  }

  if (hasCss) {
    output = await transformCss(output, css!)
  }

  await fs.writeFile(cssFilepath, output, "utf8")
  cssSpinner.succeed()
}

export async function transformCss(
  input: string,
  css: z.infer<typeof registryItemCssSchema>
) {
  const plugins = [updateCssPlugin(css)]

  const result = await postcss(plugins).process(input, {
    from: undefined,
  })

  let output = result.css

  // PostCSS doesn't add semicolons to at-rules without bodies when they're the last node.
  // We need to manually ensure they have semicolons.
  const root = result.root
  if (root.nodes && root.nodes.length > 0) {
    const lastNode = root.nodes[root.nodes.length - 1]
    if (
      lastNode.type === "atrule" &&
      !lastNode.nodes &&
      !output.trimEnd().endsWith(";")
    ) {
      output = output.trimEnd() + ";"
    }
  }

  output = output.replace(/\/\* ---break--- \*\//g, "")
  output = output.replace(/(\n\s*\n)+/g, "\n\n")
  output = output.trimEnd()

  return output
}

function updateCssPlugin(css: z.infer<typeof registryItemCssSchema>) {
  return {
    postcssPlugin: "update-css",
    Once(root: Root) {
      for (const [selector, properties] of Object.entries(css)) {
        if (selector.startsWith("@")) {
          // Handle at-rules (@layer, @utility, etc.)
          const atRuleMatch = selector.match(/@([a-zA-Z-]+)\s*(.*)/)
          if (!atRuleMatch) continue

          const [, name, params] = atRuleMatch

          // Special handling for imports - place them at the top.
          if (name === "import") {
            const existingImport = root.nodes?.find(
              (node): node is AtRule =>
                node.type === "atrule" &&
                node.name === "import" &&
                node.params === params
            )

            if (!existingImport) {
              const importRule = postcss.atRule({
                name: "import",
                params,
                raws: { semicolon: true },
              })

              const importNodes = root.nodes?.filter(
                (node): node is AtRule =>
                  node.type === "atrule" && node.name === "import"
              )

              if (importNodes && importNodes.length > 0) {
                const lastImport = importNodes[importNodes.length - 1]
                importRule.raws.before = "\n"
                root.insertAfter(lastImport, importRule)
              } else {
                importRule.raws.before = ""
                root.prepend(importRule)
              }
            }
          }
          // Special handling for plugins - place them after imports.
          else if (name === "plugin") {
            let quotedParams = params
            if (params && !params.startsWith('"') && !params.startsWith("'")) {
              quotedParams = `"${params}"`
            }

            const normalizeParams = (p: string) => {
              if (p.startsWith('"') && p.endsWith('"')) {
                return p.slice(1, -1)
              }
              if (p.startsWith("'") && p.endsWith("'")) {
                return p.slice(1, -1)
              }
              return p
            }

            const existingPlugin = root.nodes?.find((node): node is AtRule => {
              if (node.type !== "atrule" || node.name !== "plugin") {
                return false
              }
              return normalizeParams(node.params) === normalizeParams(params)
            })

            if (!existingPlugin) {
              const pluginRule = postcss.atRule({
                name: "plugin",
                params: quotedParams,
                raws: { semicolon: true, before: "\n" },
              })

              const importNodes = root.nodes?.filter(
                (node): node is AtRule =>
                  node.type === "atrule" && node.name === "import"
              )

              const pluginNodes = root.nodes?.filter(
                (node): node is AtRule =>
                  node.type === "atrule" && node.name === "plugin"
              )

              if (pluginNodes && pluginNodes.length > 0) {
                const lastPlugin = pluginNodes[pluginNodes.length - 1]
                root.insertAfter(lastPlugin, pluginRule)
              } else if (importNodes && importNodes.length > 0) {
                const lastImport = importNodes[importNodes.length - 1]
                root.insertAfter(lastImport, pluginRule)
                root.insertBefore(
                  pluginRule,
                  postcss.comment({ text: "---break---" })
                )
                root.insertAfter(
                  pluginRule,
                  postcss.comment({ text: "---break---" })
                )
              } else {
                root.prepend(pluginRule)
                root.insertBefore(
                  pluginRule,
                  postcss.comment({ text: "---break---" })
                )
                root.insertAfter(
                  pluginRule,
                  postcss.comment({ text: "---break---" })
                )
              }
            }
          }
          // Check if this is any at-rule with no body (empty object).
          else if (
            typeof properties === "object" &&
            Object.keys(properties).length === 0
          ) {
            const atRule = root.nodes?.find(
              (node): node is AtRule =>
                node.type === "atrule" &&
                node.name === name &&
                node.params === params
            ) as AtRule | undefined

            if (!atRule) {
              const newAtRule = postcss.atRule({
                name,
                params,
                raws: { semicolon: true },
              })

              root.append(newAtRule)
              root.insertBefore(
                newAtRule,
                postcss.comment({ text: "---break---" })
              )
            }
          }
          // Special handling for keyframes - place them under @theme inline.
          else if (name === "keyframes") {
            let themeInline = root.nodes?.find(
              (node): node is AtRule =>
                node.type === "atrule" &&
                node.name === "theme" &&
                node.params === "inline"
            ) as AtRule | undefined

            if (!themeInline) {
              themeInline = postcss.atRule({
                name: "theme",
                params: "inline",
                raws: { semicolon: true, between: " ", before: "\n" },
              })
              root.append(themeInline)
              root.insertBefore(
                themeInline,
                postcss.comment({ text: "---break---" })
              )
            }

            const existingKeyframesRule = themeInline.nodes?.find(
              (node): node is AtRule =>
                node.type === "atrule" &&
                node.name === "keyframes" &&
                node.params === params
            )

            let keyframesRule: AtRule
            if (existingKeyframesRule) {
              keyframesRule = postcss.atRule({
                name: "keyframes",
                params,
                raws: { semicolon: true, between: " ", before: "\n  " },
              })
              existingKeyframesRule.replaceWith(keyframesRule)
            } else {
              keyframesRule = postcss.atRule({
                name: "keyframes",
                params,
                raws: { semicolon: true, between: " ", before: "\n  " },
              })
              themeInline.append(keyframesRule)
            }

            if (typeof properties === "object") {
              for (const [step, stepProps] of Object.entries(properties)) {
                processRule(keyframesRule, step, stepProps)
              }
            }
          }
          // Special handling for utility classes to preserve property values
          else if (name === "utility") {
            const utilityAtRule = root.nodes?.find(
              (node): node is AtRule =>
                node.type === "atrule" &&
                node.name === name &&
                node.params === params
            ) as AtRule | undefined

            if (!utilityAtRule) {
              const atRule = postcss.atRule({
                name,
                params,
                raws: { semicolon: true, between: " ", before: "\n" },
              })

              root.append(atRule)
              root.insertBefore(
                atRule,
                postcss.comment({ text: "---break---" })
              )

              if (typeof properties === "object") {
                for (const [prop, value] of Object.entries(properties)) {
                  if (typeof value === "string") {
                    const decl = postcss.decl({
                      prop,
                      value: value,
                      raws: { semicolon: true, before: "\n    " },
                    })
                    atRule.append(decl)
                  } else if (
                    prop.startsWith("@") &&
                    typeof value === "object" &&
                    value !== null &&
                    Object.keys(value as Record<string, unknown>).length === 0
                  ) {
                    // Handle at-rules with no body (e.g., @apply).
                    const atRuleMatch = prop.match(/@([a-zA-Z-]+)\s*(.*)/)
                    if (atRuleMatch) {
                      const [, atRuleName, atRuleParams] = atRuleMatch
                      const existingAtRule = atRule.nodes?.find(
                        (node): node is AtRule =>
                          node.type === "atrule" &&
                          node.name === atRuleName &&
                          node.params === atRuleParams
                      )
                      if (!existingAtRule) {
                        const newAtRule = postcss.atRule({
                          name: atRuleName,
                          params: atRuleParams,
                          raws: { semicolon: true, before: "\n    " },
                        })
                        atRule.append(newAtRule)
                      }
                    }
                  } else if (typeof value === "object") {
                    processRule(atRule, prop, value)
                  }
                }
              }
            } else {
              if (typeof properties === "object") {
                for (const [prop, value] of Object.entries(properties)) {
                  if (typeof value === "string") {
                    const existingDecl = utilityAtRule.nodes?.find(
                      (node): node is Declaration =>
                        node.type === "decl" && node.prop === prop
                    )

                    const decl = postcss.decl({
                      prop,
                      value: value,
                      raws: { semicolon: true, before: "\n    " },
                    })

                    existingDecl
                      ? existingDecl.replaceWith(decl)
                      : utilityAtRule.append(decl)
                  } else if (
                    prop.startsWith("@") &&
                    typeof value === "object" &&
                    value !== null &&
                    Object.keys(value as Record<string, unknown>).length === 0
                  ) {
                    // Handle at-rules with no body (e.g., @apply).
                    const atRuleMatch = prop.match(/@([a-zA-Z-]+)\s*(.*)/)
                    if (atRuleMatch) {
                      const [, atRuleName, atRuleParams] = atRuleMatch
                      const existingAtRule = utilityAtRule.nodes?.find(
                        (node): node is AtRule =>
                          node.type === "atrule" &&
                          node.name === atRuleName &&
                          node.params === atRuleParams
                      )
                      if (!existingAtRule) {
                        const newAtRule = postcss.atRule({
                          name: atRuleName,
                          params: atRuleParams,
                          raws: { semicolon: true, before: "\n    " },
                        })
                        utilityAtRule.append(newAtRule)
                      }
                    }
                  } else if (typeof value === "object") {
                    processRule(utilityAtRule, prop, value)
                  }
                }
              }
            }
          }
          // Handle at-property as regular CSS rules
          else if (name === "property") {
            processRule(root, selector, properties)
          } else {
            processAtRule(root, name, params, properties)
          }
        } else {
          processRule(root, selector, properties)
        }
      }
    },
  }
}

function processAtRule(
  root: Root | AtRule,
  name: string,
  params: string,
  properties: any
) {
  let atRule = root.nodes?.find(
    (node): node is AtRule =>
      node.type === "atrule" && node.name === name && node.params === params
  ) as AtRule | undefined

  if (!atRule) {
    atRule = postcss.atRule({
      name,
      params,
      raws: { semicolon: true, between: " ", before: "\n" },
    })
    root.append(atRule)
    root.insertBefore(atRule, postcss.comment({ text: "---break---" }))
  }

  if (typeof properties === "object") {
    for (const [childSelector, childProps] of Object.entries(properties)) {
      if (childSelector.startsWith("@")) {
        const nestedMatch = childSelector.match(/@([a-zA-Z-]+)\s*(.*)/)
        if (nestedMatch) {
          const [, nestedName, nestedParams] = nestedMatch
          processAtRule(atRule, nestedName, nestedParams, childProps)
        }
      } else {
        processRule(atRule, childSelector, childProps)
      }
    }
  } else if (typeof properties === "string") {
    try {
      const parsed = postcss.parse(`.temp{${properties}}`)
      const tempRule = parsed.first as Rule

      if (tempRule && tempRule.nodes) {
        const rule = postcss.rule({
          selector: "temp",
          raws: { semicolon: true, between: " ", before: "\n  " },
        })

        tempRule.nodes.forEach((node) => {
          if (node.type === "decl") {
            const clone = node.clone()
            clone.raws.before = "\n    "
            rule.append(clone)
          }
        })

        if (rule.nodes?.length) {
          atRule.append(rule)
        }
      }
    } catch (error) {
      console.error("Error parsing at-rule content:", properties, error)
      throw error
    }
  }
}

function processRule(parent: Root | AtRule, selector: string, properties: any) {
  let rule = parent.nodes?.find(
    (node): node is Rule => node.type === "rule" && node.selector === selector
  ) as Rule | undefined

  if (!rule) {
    rule = postcss.rule({
      selector,
      raws: { semicolon: true, between: " ", before: "\n  " },
    })
    parent.append(rule)
  }

  if (typeof properties === "object") {
    for (const [prop, value] of Object.entries(properties)) {
      if (
        prop.startsWith("@") &&
        typeof value === "object" &&
        value !== null &&
        Object.keys(value).length === 0
      ) {
        const atRuleMatch = prop.match(/@([a-zA-Z-]+)\s*(.*)/)
        if (atRuleMatch) {
          const [, atRuleName, atRuleParams] = atRuleMatch

          const existingAtRule = rule.nodes?.find(
            (node): node is AtRule =>
              node.type === "atrule" &&
              node.name === atRuleName &&
              node.params === atRuleParams
          )

          if (!existingAtRule) {
            // For @apply, merge with existing @apply instead of creating a duplicate.
            if (atRuleName === "apply") {
              const existingApply = rule.nodes?.find(
                (node): node is AtRule =>
                  node.type === "atrule" && node.name === "apply"
              )
              if (existingApply) {
                existingApply.params = twMerge(
                  existingApply.params,
                  atRuleParams
                )
                continue
              }
            }
            const atRule = postcss.atRule({
              name: atRuleName,
              params: atRuleParams,
              raws: { semicolon: true, before: "\n    " },
            })
            rule.append(atRule)
          }
        }
      } else if (typeof value === "string") {
        const decl = postcss.decl({
          prop,
          value: value,
          raws: { semicolon: true, before: "\n    " },
        })

        const existingDecl = rule.nodes?.find(
          (node): node is Declaration =>
            node.type === "decl" && node.prop === prop
        )

        existingDecl ? existingDecl.replaceWith(decl) : rule.append(decl)
      } else if (typeof value === "object") {
        // Nested selector (including & selectors).
        const nestedSelector = prop.startsWith("&")
          ? selector.replace(/^([^:]+)/, `$1${prop.substring(1)}`)
          : prop // Use the original selector for other nested elements.
        processRule(parent, nestedSelector, value)
      }
    }
  } else if (typeof properties === "string") {
    try {
      const parsed = postcss.parse(`.temp{${properties}}`)
      const tempRule = parsed.first as Rule

      if (tempRule && tempRule.nodes) {
        tempRule.nodes.forEach((node) => {
          if (node.type === "decl") {
            const clone = node.clone()
            clone.raws.before = "\n    "
            rule?.append(clone)
          }
        })
      }
    } catch (error) {
      console.error("Error parsing rule content:", selector, properties, error)
      throw error
    }
  }
}
