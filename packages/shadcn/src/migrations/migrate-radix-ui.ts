import { randomBytes } from "crypto"
import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import { getRegistryIndex } from "@/src/registry/api"
import { Config, getWorkspaceConfig } from "@/src/utils/get-config"
import { getPackageInfo } from "@/src/utils/get-package-info"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { getProjectTailwindVersionFromConfig } from "@/src/utils/get-project-info"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { execa } from "execa"
import fg from "fast-glob"
import prompts from "prompts"
import {
  Project,
  ScriptKind,
  SyntaxKind,
  TypeReferenceNode,
  VariableDeclaration,
} from "ts-morph"
import { z } from "zod"

export async function migrateRadixUi(config: Config) {
  if (!config.resolvedPaths.ui) {
    throw new Error(
      "We could not find a valid `ui` path in your `components.json` file. Please ensure you have a valid `ui` path in your `components.json` file."
    )
  }

  const workspaceConfig = await getWorkspaceConfig(config)

  // TODO: Temporary workaround for monorepo. Update the `ui` path and `cwd` to match the workspace config
  if (
    workspaceConfig &&
    workspaceConfig.ui &&
    workspaceConfig.ui.resolvedPaths.cwd !== config.resolvedPaths.cwd
  ) {
    config.resolvedPaths.ui = workspaceConfig.ui.resolvedPaths.ui
    config.resolvedPaths.cwd = workspaceConfig.ui.resolvedPaths.cwd
  }

  const tailwindVersion = await getProjectTailwindVersionFromConfig(config)

  if (tailwindVersion !== "v4") {
    logger.break()
    logger.info("No Migration Required for this project.")
    logger.break()
    process.exit(0)
  }

  const uiPath = config.resolvedPaths.ui
  const fileWithRadixImports = await findRadixUiImports(uiPath)

  if (!fileWithRadixImports.length) {
    logger.break()
    logger.info("No Components installed that require migration.")
    logger.break()
    process.exit(0)
  }

  logger.info(" The following files require migration:")
  fileWithRadixImports.sort().forEach((file) => {
    logger.log(`  - ${file}`)
  })
  logger.break()

  const { confirm } = await prompts([
    {
      type: "confirm",
      name: "confirm",
      initial: true,
      message: `${highlighter.info(fileWithRadixImports.length)} ${
        fileWithRadixImports.length === 1 ? "component" : "components"
      } will be updated in ${highlighter.info(
        `./${path.relative(config.resolvedPaths.cwd, uiPath)}`
      )}. Continue?`,
    },
  ])

  logger.break()

  if (!confirm) {
    logger.break()
    logger.warn("Migration cancelled.")
    logger.break()
    process.exit(1)
  }

  // Check if radix-ui is installed
  const radixUiInstalled = await fs
    .access(path.join(config.resolvedPaths.cwd, "node_modules", "radix-ui"))
    .then(() => true)
    .catch(() => false)

  if (!radixUiInstalled) {
    await installRadixUi(config)
  } else {
    // TODO: Check if radix-ui is up to date
    const { update } = await prompts([
      {
        type: "toggle",
        name: "update",
        message: `Would you like to update radix-ui ${highlighter.warn(
          "(Recommended)"
        )}?`,
        initial: true,
        active: "yes",
        inactive: "no",
      },
    ])

    if (update) {
      await installRadixUi(config)
    } else {
      spinner("radix-ui is already installed.").succeed()
    }
  }

  const updatingSpinner = spinner("Updating files...")?.start()
  logger.break()

  await Promise.all(
    fileWithRadixImports.map(async (file) => {
      logger.log(
        `  - ${path.relative(
          config.resolvedPaths.cwd,
          path.join(uiPath, file)
        )}`
      )
      // updatingSpinner.text = `Migrating ${file}...`
      const filePath = path.join(uiPath, file)
      const fileContent = await fs.readFile(filePath, "utf-8")
      const updatedContent = await updateFilesContent(fileContent)
      await fs.writeFile(filePath, updatedContent)
    })
  )
  updatingSpinner.succeed("Updating files.")

  logger.break()
  // Could be selection if user wants to keep some packages
  const { uninstall } = await prompts([
    {
      type: "toggle",
      name: "uninstall",
      message: `Would you like to uninstall @radix-ui/* packages ${highlighter.warn(
        "(Recommended)"
      )}?`,
      initial: true,
      active: "yes",
      inactive: "no",
    },
  ])

  if (uninstall) {
    await uninstallRadixUiPackages(config)
  }

  logger.break()
  spinner(highlighter.success("Migration completed."))?.succeed()
  logger.break()
}

export async function updateFilesContent(fileContent: string): Promise<string> {
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-"))
  const tempFile = path.join(
    tempDir,
    `shadcn-radix-ui-${randomBytes(4).toString("hex")}.tsx`
  )

  const project = new Project()
  const sourceFile = project.createSourceFile(tempFile, fileContent, {
    scriptKind: ScriptKind.TSX,
  })

  let modified = false

  sourceFile.getImportDeclarations().forEach((fileImport) => {
    const mod = fileImport.getModuleSpecifierValue()
    const isRadixImport = mod.match(/^@radix-ui\/react-([\w-]+)$/)

    if (isRadixImport) {
      const name = isRadixImport[1]
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")
      const namespaceImport = fileImport.getNamespaceImport()
      const namedImport = fileImport.getNamedImports()

      if (namespaceImport) {
        // import * as DialogPrimitive from ...
        const alias = namespaceImport.getText()
        fileImport.replaceWithText(
          `import { ${name} as ${alias} } from "radix-ui"`
        )
        modified = true
      } else if (namedImport.length) {
        // import { Slot } from ...
        const renamed = namedImport.map((i) => {
          const importedName = i.getName()
          const asName = `${importedName}Primitive`
          return `${importedName} as ${asName}`
        })
        fileImport.replaceWithText(
          `import { ${renamed.join(", ")} } from "radix-ui"`
        )
        modified = true
      }
    }
  })

  // 2. <Slot> → <SlotPrimitive.Root>
  const jsxKinds = [
    SyntaxKind.JsxOpeningElement,
    SyntaxKind.JsxSelfClosingElement,
    SyntaxKind.JsxClosingElement,
  ] as const

  jsxKinds.forEach((kind) => {
    sourceFile.getDescendantsOfKind(kind).forEach((node) => {
      const tag = node.getTagNameNode().getText()
      if (tag === "Slot") {
        node.getTagNameNode().replaceWithText("SlotPrimitive.Root")
        modified = true
      }
    })
  })

  // 3. typeof Slot → typeof SlotPrimitive.Root
  sourceFile.getDescendantsOfKind(SyntaxKind.TypeReference).forEach((node) => {
    const typeNode = node as TypeReferenceNode
    if (typeNode.getTypeName().getText() === "React.ComponentProps") {
      const args = typeNode.getTypeArguments()
      if (
        args.length === 1 &&
        args[0].getKind() === SyntaxKind.TypeQuery &&
        args[0].getText() === "typeof Slot"
      ) {
        args[0].replaceWithText("typeof SlotPrimitive.Root")
        modified = true
      }
    }
  })

  // 4. const Comp = asChild ? Slot : ...
  sourceFile
    .getDescendantsOfKind(SyntaxKind.VariableDeclaration)
    .forEach((variable) => {
      const init = (variable as VariableDeclaration).getInitializer()
      if (
        init?.getKind() === SyntaxKind.ConditionalExpression &&
        init.getText().includes("? Slot :")
      ) {
        const cond = init.asKindOrThrow(SyntaxKind.ConditionalExpression)
        if (cond.getWhenTrue().getText() === "Slot") {
          cond.getWhenTrue().replaceWithText("SlotPrimitive.Root")
          modified = true
        }
      }
    })

  if (modified) {
    const radixImports = sourceFile
      .getImportDeclarations()
      .filter((d) => d.getModuleSpecifierValue() === "radix-ui")

    if (radixImports.length > 1) {
      const allNamedImports = radixImports
        .flatMap((d) => d.getNamedImports().map((i) => i.getText()))
        // Sort imports
        .sort()

      const firstRadixImport = radixImports[0].getChildIndex()
      radixImports.forEach((d) => d.remove())

      sourceFile.insertImportDeclaration(firstRadixImport, {
        moduleSpecifier: "radix-ui",
        namedImports: allNamedImports,
      })
    }

    return sourceFile.getText()
  }

  return modified ? sourceFile.getText() : fileContent
}

async function findRadixUiImports(uiPath: string): Promise<string[]> {
  const files = await fg("**/*.{js,ts,jsx,tsx}", { cwd: uiPath })
  const project = new Project()

  const componentsWithRadixImports: string[] = []
  const registryIndex = await getRegistryIndex()

  if (!registryIndex) {
    handleError(new Error("Failed to fetch registry index."))
    process.exit(1)
  }

  const registryComponents = registryIndex
    .filter((entry) => entry.type === "registry:ui")
    .map((entry) => entry.name)

  for (const file of files) {
    const filePath = path.resolve(uiPath, file)
    const component = file.replace(/\.[^/.]+$/, "")

    const result = z.array(z.string()).safeParse([component])
    if (!result.success) {
      logger.error("")
      handleError(new Error("Something went wrong. Please try again."))
      return []
    }

    if (registryComponents.includes(component)) {
      const sourceFile = project.addSourceFileAtPath(filePath)
      const fileImports = sourceFile.getImportDeclarations()

      const isRadixImport = fileImports.some((fileImport) =>
        fileImport.getModuleSpecifierValue().startsWith("@radix-ui/")
      )

      if (isRadixImport) {
        componentsWithRadixImports.push(file)
      }
    }
  }

  return componentsWithRadixImports
}

async function installRadixUi(config: Config) {
  const packageManager = await getPackageManager(config.resolvedPaths.cwd)

  const installSpinner = spinner("Installing radix-ui...")?.start()

  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", "radix-ui@latest"],
    {
      cwd: config.resolvedPaths.cwd,
    }
  )

  installSpinner?.succeed("Installing radix-ui.")
}

async function uninstallRadixUiPackages(config: Config) {
  const pkgInfo = getPackageInfo(config.resolvedPaths.cwd)

  const radixPackages = Object.keys({
    ...pkgInfo?.dependencies,
    ...pkgInfo?.devDependencies,
  }).filter((pkg) => pkg.startsWith("@radix-ui/react-"))

  const packageManager = await getPackageManager(config.resolvedPaths.cwd)
  const uninstallSpinner = spinner(
    "Uninstalling @radix-ui/* packages..."
  )?.start()

  await execa(
    packageManager,
    [packageManager === "npm" ? "uninstall" : "remove", ...radixPackages],
    {
      cwd: config.resolvedPaths.cwd,
    }
  )

  uninstallSpinner?.succeed("Uninstalling @radix-ui/* packages.")
}
