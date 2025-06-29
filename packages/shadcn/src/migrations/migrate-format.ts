import { promises as fs } from "fs"
import path from "path"
import { addComponents } from "@/src/utils/add-components"
import { Config } from "@/src/utils/get-config"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import fg from "fast-glob"
import prompts from "prompts"

export async function migrateFormat(config: Config) {
  if (!config.resolvedPaths.ui) {
    throw new Error(
      "We could not find a valid `ui` path in your `components.json` file. Please ensure you have a valid `ui` path in your `components.json` file."
    )
  }

  const uiPath = config.resolvedPaths.ui
  const files = await fg("**/*.{js,ts,jsx,tsx}", { cwd: uiPath })

  if (files.length === 0) {
    throw new Error("No files found in the `ui` directory to migrate format.")
  }

  const formatChoices = [
    { title: "JSX", value: "jsx" },
    { title: "TSX", value: "tsx" },
  ]

  const migrateOptions = await prompts([
    {
      type: "select",
      name: "from",
      message: `Which format would you like to ${highlighter.info(
        "migrate from"
      )}?`,
      choices: formatChoices,
    },
    {
      type: "select",
      name: "to",
      message: `Which format would you like to ${highlighter.info(
        "migrate to"
      )}?`,
      choices: formatChoices,
    },
  ])

  if (migrateOptions.from === migrateOptions.to) {
    throw new Error("You cannot migrate to the same format.")
  }

  const sourceFiles = files.filter((file) =>
    file.endsWith(`.${migrateOptions.from}`)
  )
  if (sourceFiles.length === 0) {
    throw new Error(`No .${migrateOptions.from} files found to migrate.`)
  }

  const { confirm } = await prompts({
    type: "confirm",
    name: "confirm",
    initial: true,
    message: `We will migrate ${highlighter.info(
      sourceFiles.length
    )} files in ${highlighter.info(
      `./${path.relative(config.resolvedPaths.cwd, uiPath)}`
    )} from ${highlighter.info(migrateOptions.from)} to ${highlighter.info(
      migrateOptions.to
    )}. Continue?`,
  })

  if (!confirm) {
    logger.info("Migration cancelled.")
    process.exit(0)
  }

  const migrationSpinner = spinner("Migrating format...")?.start()

  const componentNames = sourceFiles.map((file) =>
    file.replace(/\.[^/.]+$/, "")
  )
  const failedComponents: string[] = []
  const successfulComponents: string[] = []

  // Intercept process.exit
  const originalExit = process.exit
  process.exit = ((code: number) => {
    throw { __intercepted: true, code }
  }) as any
  const originalConsoleError = console.error
  const originalConsoleLog = console.log
  console.error = () => {}
  console.log = () => {}

  // Migrate components
  for (const componentName of componentNames) {
    migrationSpinner.text = `Migrating ${componentName}...`
    try {
      await addComponents(
        [componentName],
        { ...config, tsx: migrateOptions.to === "tsx" },
        { overwrite: true, silent: true }
      )
      successfulComponents.push(componentName)
    } catch (err) {
      failedComponents.push(componentName)
    }
  }

  process.exit = originalExit
  console.error = originalConsoleError
  console.log = originalConsoleLog

  // Delete old files
  await Promise.all(
    sourceFiles.map(async (file) => {
      const component = file.replace(/\.[^/.]+$/, "")
      migrationSpinner.text = `Deleting ${component}...`
      if (successfulComponents.includes(component)) {
        await fs.unlink(path.join(uiPath, file))
      }
    })
  )

  // Update components.json
  const { resolvedPaths, ...rest } = config
  const updatedConfig = {
    ...rest,
    tsx: migrateOptions.to === "tsx",
  }
  await fs.writeFile(
    path.join(resolvedPaths.cwd, "components.json"),
    JSON.stringify(updatedConfig, null, 2)
  )

  migrationSpinner?.stop()

  logger.info("")
  if (successfulComponents.length > 0) {
    logger.log(
      `Migrated ${successfulComponents.length} ${
        successfulComponents.length === 1 ? "file" : "files"
      }:`
    )
    for (const file of successfulComponents) {
      logger.log(`  - ${file}.${migrateOptions.to}`)
    }
  }
  if (failedComponents.length > 0) {
    logger.warn(
      `Skipped ${failedComponents.length} ${
        failedComponents.length === 1 ? "file" : "files"
      } (invalid or not found in registry):`
    )
    for (const file of failedComponents) {
      logger.warn(`  - ${file}.${migrateOptions.from}`)
    }
  }
}
