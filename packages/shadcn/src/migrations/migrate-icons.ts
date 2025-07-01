import { randomBytes } from "crypto"
import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import { getRegistryIcons } from "@/src/registry/api"
import { iconsSchema } from "@/src/registry/schema"
import { Config } from "@/src/utils/get-config"
import { highlighter } from "@/src/utils/highlighter"
import { ICON_LIBRARIES } from "@/src/utils/icon-libraries"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { updateDependencies } from "@/src/utils/updaters/update-dependencies"
import fg from "fast-glob"
import prompts from "prompts"
import { Project, ScriptKind, SyntaxKind } from "ts-morph"
import { z } from "zod"

export async function migrateIcons(config: Config) {
  if (!config.resolvedPaths.ui) {
    throw new Error(
      "We could not find a valid `ui` path in your `components.json` file. Please ensure you have a valid `ui` path in your `components.json` file."
    )
  }

  const uiPath = config.resolvedPaths.ui
  const [files, registryIcons] = await Promise.all([
    fg("**/*.{js,ts,jsx,tsx}", {
      cwd: uiPath,
    }),
    getRegistryIcons(),
  ])

  if (Object.keys(registryIcons).length === 0) {
    throw new Error("Something went wrong fetching the registry icons.")
  }

  const libraryChoices = Object.entries(ICON_LIBRARIES).map(
    ([name, iconLibrary]) => ({
      title: iconLibrary.name,
      value: name,
    })
  )

  const migrateOptions = await prompts([
    {
      type: "select",
      name: "sourceLibrary",
      message: `Which icon library would you like to ${highlighter.info(
        "migrate from"
      )}?`,
      choices: libraryChoices,
    },
    {
      type: "select",
      name: "targetLibrary",
      message: `Which icon library would you like to ${highlighter.info(
        "migrate to"
      )}?`,
      choices: libraryChoices,
    },
  ])

  if (migrateOptions.sourceLibrary === migrateOptions.targetLibrary) {
    throw new Error(
      "You cannot migrate to the same icon library. Please choose a different icon library."
    )
  }

  if (
    !(
      migrateOptions.sourceLibrary in ICON_LIBRARIES &&
      migrateOptions.targetLibrary in ICON_LIBRARIES
    )
  ) {
    throw new Error("Invalid icon library. Please choose a valid icon library.")
  }

  const sourceLibrary =
    ICON_LIBRARIES[migrateOptions.sourceLibrary as keyof typeof ICON_LIBRARIES]
  const targetLibrary =
    ICON_LIBRARIES[migrateOptions.targetLibrary as keyof typeof ICON_LIBRARIES]
  const { confirm } = await prompts({
    type: "confirm",
    name: "confirm",
    initial: true,
    message: `We will migrate ${highlighter.info(
      files.length
    )} files in ${highlighter.info(
      `./${path.relative(config.resolvedPaths.cwd, uiPath)}`
    )} from ${highlighter.info(sourceLibrary.name)} to ${highlighter.info(
      targetLibrary.name
    )}. Continue?`,
  })

  if (!confirm) {
    logger.info("Migration cancelled.")
    process.exit(0)
  }

  if (targetLibrary.package) {
    await updateDependencies([targetLibrary.package], [], config, {
      silent: false,
    })
  }

  const migrationSpinner = spinner(`Migrating icons...`)?.start()

  await Promise.all(
    files.map(async (file) => {
      migrationSpinner.text = `Migrating ${file}...`

      const filePath = path.join(uiPath, file)
      const fileContent = await fs.readFile(filePath, "utf-8")

      const content = await migrateIconsFile(
        fileContent,
        migrateOptions.sourceLibrary,
        migrateOptions.targetLibrary,
        registryIcons
      )

      await fs.writeFile(filePath, content)
    })
  )

  migrationSpinner.succeed("Migration complete.")
}

export async function migrateIconsFile(
  content: string,
  sourceLibrary: keyof typeof ICON_LIBRARIES,
  targetLibrary: keyof typeof ICON_LIBRARIES,
  iconsMapping: z.infer<typeof iconsSchema>
) {
  const sourceLibraryImport = ICON_LIBRARIES[sourceLibrary]?.import
  const targetLibraryImport = ICON_LIBRARIES[targetLibrary]?.import

  const dir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-"))
  const project = new Project({
    compilerOptions: {},
  })

  const tempFile = path.join(
    dir,
    `shadcn-icons-${randomBytes(4).toString("hex")}.tsx`
  )
  const sourceFile = project.createSourceFile(tempFile, content, {
    scriptKind: ScriptKind.TSX,
  })

  // Find all sourceLibrary imports.
  let targetedIcons: string[] = []
  for (const importDeclaration of sourceFile.getImportDeclarations() ?? []) {
    if (
      importDeclaration.getModuleSpecifier()?.getText() !==
      `"${sourceLibraryImport}"`
    ) {
      continue
    }

    for (const specifier of importDeclaration.getNamedImports() ?? []) {
      const iconName = specifier.getName()

      // TODO: this is O(n^2) but okay for now.
      const targetedIcon = Object.values(iconsMapping).find(
        (icon) => icon[sourceLibrary] === iconName
      )?.[targetLibrary]

      if (!targetedIcon || targetedIcons.includes(targetedIcon)) {
        continue
      }

      targetedIcons.push(targetedIcon)

      // Remove the named import.
      specifier.remove()

      // Replace with the targeted icon.
      sourceFile
        .getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)
        .filter((node) => node.getTagNameNode()?.getText() === iconName)
        .forEach((node) => node.getTagNameNode()?.replaceWithText(targetedIcon))
    }

    // If the named import is empty, remove the import declaration.
    if (importDeclaration.getNamedImports()?.length === 0) {
      importDeclaration.remove()
    }
  }

  if (targetedIcons.length > 0) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: targetLibraryImport,
      namedImports: targetedIcons.map((icon) => ({
        name: icon,
      })),
    })
  }

  return await sourceFile.getText()
}
