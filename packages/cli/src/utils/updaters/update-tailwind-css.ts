import { promises as fs } from "fs"
import { Config } from "@/src/utils/get-config"
import { registryCssVarsSchema } from "@/src/utils/registry/schema"
import postcss from "postcss"
import AtRule from "postcss/lib/at-rule"
import Node from "postcss/lib/node"
import Root from "postcss/lib/root"
import Rule from "postcss/lib/rule"
import { z } from "zod"

export async function updateTailwindCss(
  cssVars: z.infer<typeof registryCssVarsSchema>,
  config: Config
) {
  const raw = await fs.readFile(config.resolvedPaths.tailwindCss, "utf8")
  const output = await transformTailwindCss(raw, cssVars)
  await fs.writeFile(config.resolvedPaths.tailwindCss, output, "utf8")
}

export async function transformTailwindCss(
  input: string,
  cssVars: z.infer<typeof registryCssVarsSchema>
) {
  const insertCssVarsPlugin = () => {
    return {
      postcssPlugin: "insert-css-vars",
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

        // First pass: Add or update variables
        if (cssVars.light) {
          let lightVars = baseLayer.nodes?.find(
            (node: Node) => node instanceof Rule && node.selector === ":root"
          ) as Rule | undefined

          if (!lightVars) {
            lightVars = postcss.rule({ selector: ":root" })
            baseLayer.append(lightVars)
          }

          Object.entries(cssVars.light).forEach(([key, value]) => {
            const existingDecl = lightVars.nodes.find(
              (node) => node.type === "decl" && node.prop === `--${key}`
            )
            if (existingDecl) {
              existingDecl.replaceWith(
                postcss.decl({
                  prop: `--${key}`,
                  value,
                  raws: { semicolon: true },
                })
              )
            } else {
              lightVars.append({
                prop: `--${key}`,
                value,
                raws: { semicolon: true },
              })
            }
          })
        }

        if (cssVars.dark) {
          let darkVars = baseLayer.nodes?.find(
            (node: Node) => node instanceof Rule && node.selector === ".dark"
          ) as Rule | undefined

          if (!darkVars) {
            darkVars = postcss.rule({ selector: ".dark" })
            baseLayer.append(darkVars)
          }

          Object.entries(cssVars.dark).forEach(([key, value]) => {
            const existingDecl = darkVars.nodes.find(
              (node) => node.type === "decl" && node.prop === `--${key}`
            )
            if (existingDecl) {
              existingDecl.replaceWith(
                postcss.decl({
                  prop: `--${key}`,
                  value,
                  raws: { semicolon: true },
                })
              )
            } else {
              darkVars.append({
                prop: `--${key}`,
                value,
                raws: { semicolon: true },
              })
            }
          })
        }

        // Second pass: Add missing semicolons
        // baseLayer.walkRules((rule) => {
        //   if (rule.selector === ":root" || rule.selector === ".dark") {
        //     rule.walkDecls((decl) => {
        //       decl.value = decl.value.replace(/;$/, "") + ";"
        //     })
        //   }
        // })
      },
    }
  }

  const result = await postcss([insertCssVarsPlugin()]).process(input, {
    from: undefined,
  })

  return result.css
}
