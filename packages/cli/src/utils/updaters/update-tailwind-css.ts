import { promises as fs } from "fs"
import { Config } from "@/src/utils/get-config"
import { registryCssVarsSchema } from "@/src/utils/registry/schema"
import postcss from "postcss"
import AtRule from "postcss/lib/at-rule"
import Root from "postcss/lib/root"
import Rule from "postcss/lib/rule"
import { z } from "zod"

export async function updateTailwindCss(
  cssVars: z.infer<typeof registryCssVarsSchema>,
  config: Config
) {
  const raw = await fs.readFile(config.resolvedPaths.tailwindCss, "utf8")
  let output = await transformTailwindCss(raw, cssVars)

  await fs.writeFile(config.resolvedPaths.tailwindCss, output, "utf8")
}

export async function transformTailwindCss(
  input: string,
  cssVars: z.infer<typeof registryCssVarsSchema>
) {
  const result = await postcss([
    updateCssVarsPlugin(cssVars),
    updateBaseLayerPlugin(),
  ]).process(input, {
    from: undefined,
  })

  return result.css
}

function updateBaseLayerPlugin() {
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
          raws: { semicolon: true, between: " " },
        })
        root.append(baseLayer)
      }

      requiredRules.forEach(({ selector, apply }) => {
        const existingRule = baseLayer.nodes?.find(
          (node): node is Rule =>
            node.type === "rule" && node.selector === selector
        )

        if (!existingRule) {
          baseLayer.append(
            postcss.rule({
              selector,
              nodes: [
                postcss.atRule({
                  name: "apply",
                  params: apply,
                }),
              ],
              raws: { semicolon: true, between: " " },
            })
          )
        }
      })
    },
  }
}

function updateCssVarsPlugin(cssVars: z.infer<typeof registryCssVarsSchema>) {
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
          raws: { semicolon: true },
        })
        root.append(baseLayer)
      }

      // Add variables for each key in cssVars
      Object.entries(cssVars).forEach(([key, vars]) => {
        const selector = key === "light" ? ":root" : `.${key}`
        addOrUpdateVars(baseLayer, selector, vars)
      })
    },
  }
}

// Function to add or update variables for a given selector
function addOrUpdateVars(
  baseLayer: AtRule,
  selector: string,
  vars: Record<string, string>
) {
  let ruleNode = baseLayer.nodes?.find(
    (node): node is Rule => node.type === "rule" && node.selector === selector
  )

  if (!ruleNode) {
    ruleNode = postcss.rule({ selector })
    baseLayer.append(ruleNode)
  }

  Object.entries(vars).forEach(([key, value]) => {
    const prop = `--${key}`
    const newDecl = postcss.decl({
      prop,
      value,
      raws: { semicolon: true },
    })

    const existingDecl = ruleNode.nodes.find(
      (node): node is postcss.Declaration =>
        node.type === "decl" && node.prop === prop
    )

    existingDecl ? existingDecl.replaceWith(newDecl) : ruleNode.append(newDecl)
  })
}
