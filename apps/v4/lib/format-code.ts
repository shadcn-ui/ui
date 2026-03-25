import { promises as fsPromises } from "fs"
import path from "path"
import {
  createStyleMap,
  transformIcons,
  transformMenu,
  transformRender,
  transformStyle,
} from "shadcn/utils"
import { Project, ScriptKind } from "ts-morph"

import { BASES } from "@/registry/bases"

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
