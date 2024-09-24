import { promises as fs } from "fs"
import path from "path"
import { Config } from "@/src/utils/get-config"
import { highlighter } from "@/src/utils/highlighter"
import { registryItemCssVarsSchema } from "@/src/utils/registry/schema"
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
    registryName?: string
  }
) {
  if (
    !cssVars ||
    !Object.keys(cssVars).length ||
    !config.resolvedPaths.tailwindCss
  ) {
    return
  }

  options = {
    cleanupDefaultNextStyles: false,
    silent: false,
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
  let output = await transformCssVars(raw, cssVars, config, {
    cleanupDefaultNextStyles: options.cleanupDefaultNextStyles,
    registryName: options.registryName,
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
    registryName?: string
  }
) {
  options = {
    cleanupDefaultNextStyles: false,
    ...options,
  }

  const plugins = [updateCssVarsPlugin(cssVars, options.registryName)]
  if (options.cleanupDefaultNextStyles) {
    plugins.push(cleanupDefaultNextStylesPlugin())
  }

  // Only add the base layer plugin if we're using css variables.
  if (config.tailwind.cssVariables) {
    plugins.push(updateBaseLayerPlugin(options.registryName))
  }

  const result = await postcss(plugins).process(input, {
    from: undefined,
  })

  return result.css
}

function updateBaseLayerPlugin(registryName?: string) {
  return {
    postcssPlugin: "update-base-layer",
    Once(root: Root) {
      const requiredRules = [
        { selector: "*", apply: "border-border" },
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
      }

      requiredRules.forEach(({ selector, apply }) => {
        const existingRule = baseLayer?.nodes?.find(
          (node): node is Rule =>
            node.type === "rule" && node.selector === selector
        )

        if (!existingRule) {
          baseLayer?.append(
            postcss.rule({
              selector: registryName
                ? `[data-registry="${registryName}"] ${selector}`
                : selector,
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
  cssVars: z.infer<typeof registryItemCssVarsSchema>,
  registryName?: string
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
      }

      if (baseLayer !== undefined) {
        // Add variables for each key in cssVars
        Object.entries(cssVars).forEach(([key, vars]) => {
          const selector =
            key === "light"
              ? registryName
                ? `[data-registry="${registryName}"]`
                : ":root"
              : registryName
              ? `[data-registry="${registryName}"].dark`
              : ".dark"
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
