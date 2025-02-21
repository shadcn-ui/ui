import { promises as fs } from "fs"
import path from "path"
import {
  registryItemCssVarsSchema,
  registryItemTailwindSchema,
} from "@/src/registry/schema"
import { Config } from "@/src/utils/get-config"
import { TailwindVersion } from "@/src/utils/get-project-info"
import { highlighter } from "@/src/utils/highlighter"
import { spinner } from "@/src/utils/spinner"
import postcss from "postcss"
import AtRule from "postcss/lib/at-rule"
import Root from "postcss/lib/root"
import Rule from "postcss/lib/rule"
import { z } from "zod"

export async function updateCssVars(
  cssVars: z.infer<typeof registryItemCssVarsSchema> | undefined,
  config: Config,
  options: {
    cleanupDefaultNextStyles?: boolean
    silent?: boolean
    tailwindVersion?: TailwindVersion
    tailwindConfig?: z.infer<typeof registryItemTailwindSchema>["config"]
  }
) {
  if (!config.resolvedPaths.tailwindCss) {
    return
  }

  options = {
    cleanupDefaultNextStyles: false,
    silent: false,
    tailwindVersion: "v3",
    ...options,
  }
  const cssFilepath = config.resolvedPaths.tailwindCss
  const cssFilepathRelative = path.relative(
    config.resolvedPaths.cwd,
    cssFilepath
  )
  const cssVarsSpinner = spinner(
    `Updating ${highlighter.info(cssFilepathRelative)}`,
    {
      silent: options.silent,
    }
  ).start()
  const raw = await fs.readFile(cssFilepath, "utf8")
  let output = await transformCssVars(raw, cssVars ?? {}, config, {
    cleanupDefaultNextStyles: options.cleanupDefaultNextStyles,
    tailwindVersion: options.tailwindVersion,
    tailwindConfig: options.tailwindConfig,
  })
  await fs.writeFile(cssFilepath, output, "utf8")
  cssVarsSpinner.succeed()
}

export async function transformCssVars(
  input: string,
  cssVars: z.infer<typeof registryItemCssVarsSchema>,
  config: Config,
  options: {
    cleanupDefaultNextStyles?: boolean
    tailwindVersion?: TailwindVersion
    tailwindConfig?: z.infer<typeof registryItemTailwindSchema>["config"]
  } = {
    cleanupDefaultNextStyles: false,
    tailwindVersion: "v3",
    tailwindConfig: undefined,
  }
) {
  options = {
    cleanupDefaultNextStyles: false,
    tailwindVersion: "v3",
    tailwindConfig: undefined,
    ...options,
  }

  let plugins = [updateCssVarsPlugin(cssVars)]

  if (options.cleanupDefaultNextStyles) {
    plugins.push(cleanupDefaultNextStylesPlugin())
  }

  if (options.tailwindVersion === "v4") {
    plugins = [addCustomVariant({ params: "dark (&:is(.dark *))" })]

    if (options.cleanupDefaultNextStyles) {
      plugins.push(cleanupDefaultNextStylesPlugin())
    }

    plugins.push(updateCssVarsPluginV4(cssVars))
    plugins.push(updateThemePlugin(cssVars))

    if (options.tailwindConfig) {
      plugins.push(updateTailwindConfigPlugin(options.tailwindConfig))
      plugins.push(updateTailwindConfigAnimationPlugin(options.tailwindConfig))
      plugins.push(updateTailwindConfigKeyframesPlugin(options.tailwindConfig))
    }
  }

  if (config.tailwind.cssVariables) {
    plugins.push(updateBaseLayerPlugin())
  }

  const result = await postcss(plugins).process(input, {
    from: undefined,
  })

  let output = result.css

  output = output.replace(/\/\* ---break--- \*\//g, "")

  if (options.tailwindVersion === "v4") {
    output = output.replace(/(\n\s*\n)+/g, "\n\n")
  }

  return output
}

function updateBaseLayerPlugin() {
  return {
    postcssPlugin: "update-base-layer",
    Once(root: Root) {
      const requiredRules = [
        { selector: "*", apply: "border-border outline-ring/50" },
        { selector: "body", apply: "bg-background text-foreground" },
      ]

      let baseLayer = root.nodes.find(
        (node): node is AtRule =>
          node.type === "atrule" &&
          node.name === "layer" &&
          node.params === "base" &&
          requiredRules.every(({ selector, apply }) =>
            node.nodes?.some(
              (rule): rule is Rule =>
                rule.type === "rule" &&
                rule.selector === selector &&
                rule.nodes.some(
                  (applyRule): applyRule is AtRule =>
                    applyRule.type === "atrule" &&
                    applyRule.name === "apply" &&
                    applyRule.params === apply
                )
            )
          )
      ) as AtRule | undefined

      if (!baseLayer) {
        baseLayer = postcss.atRule({
          name: "layer",
          params: "base",
          raws: { semicolon: true, between: " ", before: "\n" },
        })
        root.append(baseLayer)
        root.insertBefore(baseLayer, postcss.comment({ text: "---break---" }))
      }

      requiredRules.forEach(({ selector, apply }) => {
        const existingRule = baseLayer?.nodes?.find(
          (node): node is Rule =>
            node.type === "rule" && node.selector === selector
        )

        if (!existingRule) {
          baseLayer?.append(
            postcss.rule({
              selector,
              nodes: [
                postcss.atRule({
                  name: "apply",
                  params: apply,
                  raws: { semicolon: true, before: "\n    " },
                }),
              ],
              raws: { semicolon: true, between: " ", before: "\n  " },
            })
          )
        }
      })
    },
  }
}

function updateCssVarsPlugin(
  cssVars: z.infer<typeof registryItemCssVarsSchema>
) {
  return {
    postcssPlugin: "update-css-vars",
    Once(root: Root) {
      let baseLayer = root.nodes.find(
        (node) =>
          node.type === "atrule" &&
          node.name === "layer" &&
          node.params === "base"
      ) as AtRule | undefined

      if (!(baseLayer instanceof AtRule)) {
        baseLayer = postcss.atRule({
          name: "layer",
          params: "base",
          nodes: [],
          raws: {
            semicolon: true,
            before: "\n",
            between: " ",
          },
        })
        root.append(baseLayer)
        root.insertBefore(baseLayer, postcss.comment({ text: "---break---" }))
      }

      if (baseLayer !== undefined) {
        // Add variables for each key in cssVars
        Object.entries(cssVars).forEach(([key, vars]) => {
          const selector = key === "light" ? ":root" : `.${key}`
          // TODO: Fix typecheck.
          addOrUpdateVars(baseLayer as AtRule, selector, vars)
        })
      }
    },
  }
}

function removeConflictVars(root: Rule | Root) {
  const rootRule = root.nodes.find(
    (node): node is Rule => node.type === "rule" && node.selector === ":root"
  )

  if (rootRule) {
    const propsToRemove = ["--background", "--foreground"]

    rootRule.nodes
      .filter(
        (node): node is postcss.Declaration =>
          node.type === "decl" && propsToRemove.includes(node.prop)
      )
      .forEach((node) => node.remove())

    if (rootRule.nodes.length === 0) {
      rootRule.remove()
    }
  }
}

function cleanupDefaultNextStylesPlugin() {
  return {
    postcssPlugin: "cleanup-default-next-styles",
    Once(root: Root) {
      const bodyRule = root.nodes.find(
        (node): node is Rule => node.type === "rule" && node.selector === "body"
      )
      if (bodyRule) {
        // Remove color from the body node.
        bodyRule.nodes
          .find(
            (node): node is postcss.Declaration =>
              node.type === "decl" &&
              node.prop === "color" &&
              ["rgb(var(--foreground-rgb))", "var(--foreground)"].includes(
                node.value
              )
          )
          ?.remove()

        // Remove background: linear-gradient.
        bodyRule.nodes
          .find((node): node is postcss.Declaration => {
            return (
              node.type === "decl" &&
              node.prop === "background" &&
              // This is only going to run on create project, so all good.
              (node.value.startsWith("linear-gradient") ||
                node.value === "var(--background)")
            )
          })
          ?.remove()

        // Remove font-family: Arial, Helvetica, sans-serif;
        bodyRule.nodes
          .find(
            (node): node is postcss.Declaration =>
              node.type === "decl" &&
              node.prop === "font-family" &&
              node.value === "Arial, Helvetica, sans-serif"
          )
          ?.remove()

        // If the body rule is empty, remove it.
        if (bodyRule.nodes.length === 0) {
          bodyRule.remove()
        }
      }

      removeConflictVars(root)

      const darkRootRule = root.nodes.find(
        (node): node is Rule =>
          node.type === "atrule" &&
          node.params === "(prefers-color-scheme: dark)"
      )

      if (darkRootRule) {
        removeConflictVars(darkRootRule)
        if (darkRootRule.nodes.length === 0) {
          darkRootRule.remove()
        }
      }
    },
  }
}

function addOrUpdateVars(
  baseLayer: AtRule,
  selector: string,
  vars: Record<string, string>
) {
  let ruleNode = baseLayer.nodes?.find(
    (node): node is Rule => node.type === "rule" && node.selector === selector
  )

  if (!ruleNode) {
    if (Object.keys(vars).length > 0) {
      ruleNode = postcss.rule({
        selector,
        raws: { between: " ", before: "\n  " },
      })
      baseLayer.append(ruleNode)
    }
  }

  Object.entries(vars).forEach(([key, value]) => {
    const prop = `--${key.replace(/^--/, "")}`
    const newDecl = postcss.decl({
      prop,
      value,
      raws: { semicolon: true },
    })

    const existingDecl = ruleNode?.nodes.find(
      (node): node is postcss.Declaration =>
        node.type === "decl" && node.prop === prop
    )

    existingDecl ? existingDecl.replaceWith(newDecl) : ruleNode?.append(newDecl)
  })
}

type thing = {
  light?: string
  dark?: string
  color: boolean
}

function updateCssVarsPluginV4(
  cssVars: z.infer<typeof registryItemCssVarsSchema>
) {
  return {
    postcssPlugin: "update-css-vars-v4",
    Once(root: Root) {
      let newCssVars = new Map<string, thing>()

      // get existing light css color vars
      root.walkRules(":root", (rule) => {
        rule.walkDecls((decl) => {
          if (!decl.prop.startsWith("--")) return
          if (!isColorValue(decl.value)) return

          newCssVars.set(decl.prop.substring(2), {
            light: decl.value,
            color: true,
          })
        })
      })

      // get existing dark css color vars
      root.walkRules(".dark", (rule) => {
        rule.walkDecls((decl) => {
          if (!decl.prop.startsWith("--")) return
          if (!isColorValue(decl.value)) return

          if (newCssVars.has(decl.prop.substring(2))) {
            newCssVars.get(decl.prop.substring(2))!.dark = decl.value
          }
        })
      })

      // add new css color vars or overwrite existing ones
      Object.entries(cssVars).forEach(([key, vars]) => {
        Object.keys(vars).forEach((v) => {
          if (!isColorValue(vars[v]) && !isLocalHSLValue(vars[v])) {
            if (newCssVars.has(v)) {
              newCssVars.set(v, {
                color: false,
                ...newCssVars.get(v),
                [key]: vars[v],
              })
            } else {
              newCssVars.set(v, {
                [key]: vars[v],
                color: false,
              })
            }
          }
          else {
            if (newCssVars.has(v)) {
              newCssVars.set(v, {
                ...newCssVars.get(v),
                [key]: vars[v],
                color: true,
              })
            } else {
              newCssVars.set(v, {
                [key]: vars[v],
                color: true,
              })
            }
          }
          })
      })

      let rootRuleNode = root.nodes?.find(
        (node): node is Rule =>
          node.type === "rule" && node.selector === ":root"
      )
      if (!rootRuleNode && newCssVars.size > 0) {
        rootRuleNode = postcss.rule({
          selector: ":root",
          nodes: [],
          raws: { semicolon: true, between: " ", before: "\n" },
        })
        root.append(rootRuleNode)
        root.insertBefore(
          rootRuleNode,
          postcss.comment({ text: "---break---" })
        )
      }

      let darkRuleNode = root.nodes?.find(
        (node): node is Rule =>
          node.type === "rule" && node.selector === ".dark"
      )

      if (
        !darkRuleNode &&
        Array.from(newCssVars).some(([_, value]) => (value.dark && !value.light) || value.color === false)
      ) {
        darkRuleNode = postcss.rule({
          selector: ".dark",
          nodes: [],
          raws: { semicolon: true, between: " ", before: "\n" },
        })
        root.append(darkRuleNode)
        root.insertBefore(
          darkRuleNode,
          postcss.comment({ text: "---break---" })
        )
      }

      newCssVars.forEach((value, key) => {
        let prop = `--${key.replace(/^--/, "")}`

        // Special case for sidebar-background.
        if (prop === "--sidebar-background") {
          prop = "--sidebar"
        }

        if (value.color) {
          if (value.light && value.dark) {
            let lightVal = value.light || ""
            let darkVal = value.dark || ""
            
            if (isLocalHSLValue(lightVal)) {
              lightVal = `hsl(${lightVal})`
            }
            
            if (isLocalHSLValue(darkVal)) {
              darkVal = `hsl(${darkVal})`
            }
            
            const newDecl = postcss.decl({
              prop,
              value: `light-dark(${lightVal}, ${darkVal})`,
              raws: { semicolon: true },
            })
            
            const existingRootDecl = rootRuleNode?.nodes.find(
              (node): node is postcss.Declaration =>
                node.type === "decl" && node.prop === prop
            )
            
            const existingDarkDecl = darkRuleNode?.nodes.find(
              (node): node is postcss.Declaration =>
                node.type === "decl" && node.prop === prop
            )
            
            existingRootDecl
            ? existingRootDecl.replaceWith(newDecl)
            : rootRuleNode?.append(newDecl)
            
            existingDarkDecl?.remove()
          } else if (value.light || value.dark) {
            let val = value.light || value.dark || ""
            if (isLocalHSLValue(val)) {
              val = `hsl(${val})`
            }
            
            const newDecl = postcss.decl({
              prop,
              value: val,
              raws: { semicolon: true },
            })
            const existingDecl = (
              value.light ? rootRuleNode : darkRuleNode
            )?.nodes.find(
              (node): node is postcss.Declaration =>
                node.type === "decl" && node.prop === prop
            )
            existingDecl
            ? existingDecl.replaceWith(newDecl)
            : rootRuleNode?.append(newDecl)
          } else return
        } else {
          if (value.light && value.dark) {
            const newRootDecl = postcss.decl({
              prop,
              value: value.light,
              raws: { semicolon: true },
            })

            const newDarkDecl = postcss.decl({
              prop,
              value: value.dark,
              raws: { semicolon: true },
            })

            const existingRootDecl = rootRuleNode?.nodes.find(
              (node): node is postcss.Declaration =>
                node.type === "decl" && node.prop === prop
            )

            const existingDarkDecl = darkRuleNode?.nodes.find(
              (node): node is postcss.Declaration =>
                node.type === "decl" && node.prop === prop
            )

            existingRootDecl
            ? existingRootDecl.replaceWith(newRootDecl)
            : rootRuleNode?.append(newRootDecl)

            existingDarkDecl
            ? existingDarkDecl.replaceWith(newDarkDecl)
            : darkRuleNode?.append(newDarkDecl)

          } else if (value.light || value.dark) {
            let val = value.light || value.dark || ""

            const newDecl = postcss.decl({
              prop,
              value: val,
              raws: { semicolon: true },
            })
            const existingDecl = (
              value.light ? rootRuleNode : darkRuleNode
            )?.nodes.find(
              (node): node is postcss.Declaration =>
                node.type === "decl" && node.prop === prop
            )
            existingDecl
            ? existingDecl.replaceWith(newDecl)
            : rootRuleNode?.append(newDecl)
          } else return
        }
        })
        
      if (darkRuleNode?.nodes.length === 0) {
        darkRuleNode.remove()
      }
    },
  }
}

function updateThemePlugin(cssVars: z.infer<typeof registryItemCssVarsSchema>) {
  return {
    postcssPlugin: "update-theme",
    Once(root: Root) {
      // Find unique color names from light and dark.
      const variables = Array.from(
        new Set(
          Object.keys(cssVars).flatMap((key) =>
            Object.keys(cssVars[key as keyof typeof cssVars] || {})
          )
        )
      )

      if (!variables.length) {
        return
      }

      const themeNode = upsertThemeNode(root)

      const themeVarNodes = themeNode.nodes?.filter(
        (node): node is postcss.Declaration =>
          node.type === "decl" && node.prop.startsWith("--")
      )

      for (const variable of variables) {
        const value = Object.values(cssVars).find((vars) => vars[variable])?.[
          variable
        ]

        if (!value) {
          continue
        }

        if (variable === "radius") {
          const radiusVariables = {
            sm: "calc(var(--radius) - 4px)",
            md: "calc(var(--radius) - 2px)",
            lg: "var(--radius)",
            xl: "calc(var(--radius) + 4px)",
          }
          for (const [key, value] of Object.entries(radiusVariables)) {
            const cssVarNode = postcss.decl({
              prop: `--radius-${key}`,
              value,
              raws: { semicolon: true },
            })
            if (
              themeNode?.nodes?.find(
                (node): node is postcss.Declaration =>
                  node.type === "decl" && node.prop === cssVarNode.prop
              )
            ) {
              continue
            }
            themeNode?.append(cssVarNode)
          }
          continue
        }

        let prop =
          isLocalHSLValue(value) || isColorValue(value)
            ? `--color-${variable.replace(/^--/, "")}`
            : `--${variable.replace(/^--/, "")}`
        if (prop === "--color-sidebar-background") {
          prop = "--color-sidebar"
        }

        let propValue = `var(--${variable})`
        if (prop === "--color-sidebar") {
          propValue = "var(--sidebar)"
        }

        const cssVarNode = postcss.decl({
          prop,
          value: propValue,
          raws: { semicolon: true },
        })
        const existingDecl = themeNode?.nodes?.find(
          (node): node is postcss.Declaration =>
            node.type === "decl" && node.prop === cssVarNode.prop
        )
        if (!existingDecl) {
          if (themeVarNodes?.length) {
            themeNode?.insertAfter(
              themeVarNodes[themeVarNodes.length - 1],
              cssVarNode
            )
          } else {
            themeNode?.append(cssVarNode)
          }
        }
      }
    },
  }
}

function upsertThemeNode(root: Root): AtRule {
  let themeNode = root.nodes.find(
    (node): node is AtRule =>
      node.type === "atrule" &&
      node.name === "theme" &&
      node.params === "inline"
  )

  if (!themeNode) {
    themeNode = postcss.atRule({
      name: "theme",
      params: "inline",
      nodes: [],
      raws: { semicolon: true, between: " ", before: "\n" },
    })
    root.append(themeNode)
    root.insertBefore(themeNode, postcss.comment({ text: "---break---" }))
  }

  return themeNode
}

function addCustomVariant({ params }: { params: string }) {
  return {
    postcssPlugin: "add-custom-variant",
    Once(root: Root) {
      const customVariant = root.nodes.find(
        (node): node is AtRule =>
          node.type === "atrule" && node.name === "custom-variant"
      )
      if (!customVariant) {
        const variantNode = postcss.atRule({
          name: "custom-variant",
          params,
          raws: { semicolon: true, before: "\n" },
        })
        root.insertAfter(root.nodes[0], variantNode)
        root.insertBefore(variantNode, postcss.comment({ text: "---break---" }))
      }
    },
  }
}

function updateTailwindConfigPlugin(
  tailwindConfig: z.infer<typeof registryItemTailwindSchema>["config"]
) {
  return {
    postcssPlugin: "update-tailwind-config",
    Once(root: Root) {
      if (!tailwindConfig?.plugins) {
        return
      }

      const quoteType = getQuoteType(root)
      const quote = quoteType === "single" ? "'" : '"'

      const pluginNodes = root.nodes.filter(
        (node): node is AtRule =>
          node.type === "atrule" && node.name === "plugin"
      )

      const lastPluginNode =
        pluginNodes[pluginNodes.length - 1] || root.nodes[0]

      for (const plugin of tailwindConfig.plugins) {
        const pluginName = plugin.replace(/^require\(["']|["']\)$/g, "")

        // Check if the plugin is already present.
        if (
          pluginNodes.some((node) => {
            return node.params.replace(/["']/g, "") === pluginName
          })
        ) {
          continue
        }

        const pluginNode = postcss.atRule({
          name: "plugin",
          params: `${quote}${pluginName}${quote}`,
          raws: { semicolon: true, before: "\n" },
        })
        root.insertAfter(lastPluginNode, pluginNode)
        root.insertBefore(pluginNode, postcss.comment({ text: "---break---" }))
      }
    },
  }
}

function updateTailwindConfigKeyframesPlugin(
  tailwindConfig: z.infer<typeof registryItemTailwindSchema>["config"]
) {
  return {
    postcssPlugin: "update-tailwind-config-keyframes",
    Once(root: Root) {
      if (!tailwindConfig?.theme?.extend?.keyframes) {
        return
      }

      const themeNode = upsertThemeNode(root)
      const existingKeyFrameNodes = themeNode.nodes?.filter(
        (node): node is AtRule =>
          node.type === "atrule" && node.name === "keyframes"
      )

      const keyframeValueSchema = z.record(
        z.string(),
        z.record(z.string(), z.string())
      )

      for (const [keyframeName, keyframeValue] of Object.entries(
        tailwindConfig.theme.extend.keyframes
      )) {
        if (typeof keyframeName !== "string") {
          continue
        }

        const parsedKeyframeValue = keyframeValueSchema.safeParse(keyframeValue)

        if (!parsedKeyframeValue.success) {
          continue
        }

        if (
          existingKeyFrameNodes?.find(
            (node): node is postcss.AtRule =>
              node.type === "atrule" &&
              node.name === "keyframes" &&
              node.params === keyframeName
          )
        ) {
          continue
        }

        const keyframeNode = postcss.atRule({
          name: "keyframes",
          params: keyframeName,
          nodes: [],
          raws: { semicolon: true, between: " ", before: "\n  " },
        })

        for (const [key, values] of Object.entries(parsedKeyframeValue.data)) {
          const rule = postcss.rule({
            selector: key,
            nodes: Object.entries(values).map(([key, value]) =>
              postcss.decl({
                prop: key,
                value,
                raws: { semicolon: true, before: "\n      ", between: ": " },
              })
            ),
            raws: { semicolon: true, between: " ", before: "\n    " },
          })
          keyframeNode.append(rule)
        }

        themeNode.append(keyframeNode)
        themeNode.insertBefore(
          keyframeNode,
          postcss.comment({ text: "---break---" })
        )
      }
    },
  }
}

function updateTailwindConfigAnimationPlugin(
  tailwindConfig: z.infer<typeof registryItemTailwindSchema>["config"]
) {
  return {
    postcssPlugin: "update-tailwind-config-animation",
    Once(root: Root) {
      if (!tailwindConfig?.theme?.extend?.animation) {
        return
      }

      const themeNode = upsertThemeNode(root)
      const existingAnimationNodes = themeNode.nodes?.filter(
        (node): node is postcss.Declaration =>
          node.type === "decl" && node.prop.startsWith("--animate-")
      )

      const parsedAnimationValue = z
        .record(z.string(), z.string())
        .safeParse(tailwindConfig.theme.extend.animation)
      if (!parsedAnimationValue.success) {
        return
      }

      for (const [key, value] of Object.entries(parsedAnimationValue.data)) {
        const prop = `--animate-${key}`
        if (
          existingAnimationNodes?.find(
            (node): node is postcss.Declaration => node.prop === prop
          )
        ) {
          continue
        }

        const animationNode = postcss.decl({
          prop,
          value,
          raws: { semicolon: true, between: ": ", before: "\n  " },
        })
        themeNode.append(animationNode)
      }
    },
  }
}

function getQuoteType(root: Root): "single" | "double" {
  const firstNode = root.nodes[0]
  const raw = firstNode.toString()

  if (raw.includes("'")) {
    return "single"
  }
  return "double"
}

export function isLocalHSLValue(value: string) {
  if (
    value.startsWith("hsl") ||
    value.startsWith("rgb") ||
    value.startsWith("#") ||
    value.startsWith("oklch")
  ) {
    return false
  }

  const chunks = value.split(" ")

  return (
    chunks.length === 3 &&
    chunks.slice(1, 3).every((chunk) => chunk.includes("%"))
  )
}

export function isColorValue(value: string) {
  return (
    value.startsWith("hsl") ||
    value.startsWith("rgb") ||
    value.startsWith("#") ||
    value.startsWith("oklch")
  )
}
