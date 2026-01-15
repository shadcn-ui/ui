import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import { Config } from "@/src/utils/get-config"
import { getProjectInfo, TailwindVersion } from "@/src/utils/get-project-info"
import { highlighter } from "@/src/utils/highlighter"
import { spinner } from "@/src/utils/spinner"
import { Project, ScriptKind, SyntaxKind } from "ts-morph"

export async function updateWxtConfig(
  config: Config,
  options: {
    silent?: boolean
    tailwindVersion?: TailwindVersion
  }
) {
  const projectInfo = await getProjectInfo(config.resolvedPaths.cwd)

  // Only run for WXT projects with Tailwind v4.
  if (
    projectInfo?.framework.name !== "wxt" ||
    options.tailwindVersion !== "v4"
  ) {
    return
  }

  const wxtConfigPath = await findWxtConfigFile(config.resolvedPaths.cwd)
  if (!wxtConfigPath) {
    return
  }

  const wxtConfigRelativePath = path.relative(
    config.resolvedPaths.cwd,
    wxtConfigPath
  )
  const wxtSpinner = spinner(
    `Updating ${highlighter.info(wxtConfigRelativePath)}`,
    {
      silent: options.silent,
    }
  ).start()

  try {
    const raw = await fs.readFile(wxtConfigPath, "utf8")
    const output = await transformWxtConfig(raw)
    await fs.writeFile(wxtConfigPath, output, "utf8")
    wxtSpinner?.succeed()
  } catch (error) {
    wxtSpinner?.fail()
    throw error
  }
}

async function findWxtConfigFile(cwd: string): Promise<string | null> {
  const possibleFiles = ["wxt.config.ts", "wxt.config.js"]

  for (const file of possibleFiles) {
    const filePath = path.resolve(cwd, file)
    try {
      await fs.access(filePath)
      return filePath
    } catch {
      // File doesn't exist, continue.
    }
  }

  return null
}

export async function transformWxtConfig(input: string): Promise<string> {
  const sourceFile = await createSourceFile(input)

  // Check if @tailwindcss/vite import already exists.
  const existingImport = sourceFile.getImportDeclaration(
    (decl) => decl.getModuleSpecifierValue() === "@tailwindcss/vite"
  )

  if (!existingImport) {
    // Add import statement at the top.
    sourceFile.insertImportDeclaration(0, {
      defaultImport: "tailwindcss",
      moduleSpecifier: "@tailwindcss/vite",
    })
  }

  // Find the defineConfig call.
  const defineConfigCall = sourceFile
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .find((call) => call.getExpression().getText() === "defineConfig")

  if (!defineConfigCall) {
    return sourceFile.getFullText()
  }

  // Get the first argument (config object).
  const args = defineConfigCall.getArguments()
  if (args.length === 0) {
    return sourceFile.getFullText()
  }

  const configArg = args[0]
  if (!configArg.isKind(SyntaxKind.ObjectLiteralExpression)) {
    return sourceFile.getFullText()
  }

  const configObject = configArg.asKindOrThrow(
    SyntaxKind.ObjectLiteralExpression
  )

  // Check if vite property already exists.
  const viteProperty = configObject.getProperty("vite")

  if (!viteProperty) {
    // Add vite property with tailwindcss plugin.
    configObject.addPropertyAssignment({
      name: "vite",
      initializer: `() => ({
    plugins: [tailwindcss()],
  })`,
    })
  } else if (viteProperty.isKind(SyntaxKind.PropertyAssignment)) {
    // vite property exists, need to add plugin to existing config.
    const initializer = viteProperty.getInitializer()

    if (initializer?.isKind(SyntaxKind.ArrowFunction)) {
      // vite: () => ({ ... })
      const body = initializer.getBody()

      if (body.isKind(SyntaxKind.ParenthesizedExpression)) {
        const innerExpr = body.getExpression()
        if (innerExpr.isKind(SyntaxKind.ObjectLiteralExpression)) {
          addTailwindPluginToViteConfig(innerExpr)
        }
      } else if (body.isKind(SyntaxKind.ObjectLiteralExpression)) {
        addTailwindPluginToViteConfig(body)
      }
    } else if (initializer?.isKind(SyntaxKind.ObjectLiteralExpression)) {
      // vite: { ... }
      addTailwindPluginToViteConfig(initializer)
    }
  }

  return sourceFile.getFullText()
}

function addTailwindPluginToViteConfig(
  viteConfig: import("ts-morph").ObjectLiteralExpression
) {
  const pluginsProperty = viteConfig.getProperty("plugins")

  if (!pluginsProperty) {
    // Add plugins array with tailwindcss.
    viteConfig.addPropertyAssignment({
      name: "plugins",
      initializer: "[tailwindcss()]",
    })
  } else if (pluginsProperty.isKind(SyntaxKind.PropertyAssignment)) {
    const initializer = pluginsProperty.getInitializer()

    if (initializer?.isKind(SyntaxKind.ArrayLiteralExpression)) {
      // Check if tailwindcss() is already in the array.
      const hasPlugin = initializer.getElements().some((el) => {
        const text = el.getText()
        return text === "tailwindcss()" || text.startsWith("tailwindcss(")
      })

      if (!hasPlugin) {
        initializer.addElement("tailwindcss()")
      }
    }
  }
}

async function createSourceFile(input: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-"))
  const tempFile = path.join(dir, "wxt.config.ts")

  const project = new Project({
    compilerOptions: {},
  })

  return project.createSourceFile(tempFile, input, {
    scriptKind: ScriptKind.TS,
  })
}