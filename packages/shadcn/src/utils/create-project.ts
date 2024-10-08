import path from "path"
import { initOptionsSchema } from "@/src/commands/init"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { execa } from "execa"
import fs from "fs-extra"
import prompts from "prompts"
import { z } from "zod"

export async function createProject(
  options: Pick<z.infer<typeof initOptionsSchema>, "cwd" | "force" | "srcDir">
) {
  options = {
    srcDir: false,
    ...options,
  }

  if (!options.force) {
    const { proceed } = await prompts({
      type: "confirm",
      name: "proceed",
      message: `The path ${highlighter.info(
        options.cwd
      )} does not contain a package.json file. Would you like to start a new ${highlighter.info(
        "Next.js"
      )} project?`,
      initial: true,
    })
    if (!proceed) {
      return {
        projectPath: null,
        projectName: null,
      }
    }
  }

  const packageManager = await getPackageManager(options.cwd)
  
  const { name } = await prompts({
    type: "text",
    name: "name",
    message: "What is your project named?",
    initial: "my-app",
    format: (value: string) => value.trim(),
  })

  const projectPath = path.join(options.cwd, name)

  // Check if path is writable
  try {
    await fs.access(options.cwd, fs.constants.W_OK)
  } catch (error) {
    logger.break()
    logger.error(`The path ${highlighter.info(options.cwd)} is not writable.`)
    logger.error(
      `It is likely you do not have write permissions for this folder or the path ${highlighter.info(
        options.cwd
      )} does not exist.`
    )
    logger.break()
    process.exit(1)
  }

  if (fs.existsSync(path.resolve(projectPath, "package.json"))) {
    logger.break()
    logger.error(
      `A project with the name ${highlighter.info(name)} already exists.`
    )
    logger.error(`Please choose a different name and try again.`)
    logger.break()
    process.exit(1)
  }

  const createSpinner = spinner(
    `Creating a new Next.js project. This may take a few minutes.`
  ).start()

  const args = [
    "--tailwind",
    "--eslint",
    "--typescript",
    "--app",
    options.srcDir ? "--src-dir" : "--no-src-dir",
    "--no-import-alias",
    `--use-${packageManager}`,
  ]

  try {
    // Run create-next-app in dry-run mode first to validate the project name
    await execa(
      "npx",
      ["create-next-app@latest", projectPath, "--dry-run", ...args],
      {
        cwd: options.cwd,
      }
    )

    // If dry-run succeeds, proceed with actual creation
    await execa(
      "npx",
      ["create-next-app@latest", projectPath, "--silent", ...args],
      {
        cwd: options.cwd,
      }
    )
    
    createSpinner?.succeed("Created a new Next.js project successfully.")
  } catch (error) {
    createSpinner?.fail("Failed to create Next.js project")
    logger.break()
    
    if (error instanceof Error) {
      // Extract and format the Next.js error message
      const errorMessage = error.message
      const nextJsError = errorMessage.includes('Invalid project name:') 
        ? errorMessage.split('Invalid project name:')[1].trim()
        : 'Project name validation failed. Please ensure your project name follows Next.js naming conventions.'
      
      logger.error(`Next.js validation error: ${nextJsError}`)
      logger.info("Next.js requires project names to be lowercase, with no spaces.")
    } else {
      logger.error(
        "Something went wrong creating a new Next.js project. Please try again with a different project name."
      )
    }
    
    logger.break()
    process.exit(1)
  }

  return {
    projectPath,
    projectName: name,
  }
}
