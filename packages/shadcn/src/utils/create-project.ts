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

/**
 * Validates a project name against Next.js naming conventions
 * @param name - The project name to validate
 * @returns An object containing isValid boolean and optional error message
 */
function isValidProjectName(name: string): { isValid: boolean; message?: string } {
  if (!name) {
    return { isValid: false, message: "Project name cannot be empty." }
  }

  if (name.length > 128) {
    return { isValid: false, message: "Project name should be less than 128 characters." }
  }
  
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    return { 
      isValid: false, 
      message: "Project name must start with a lowercase letter and can only contain lowercase letters, numbers, and hyphens."
    }
  }
  
  return { isValid: true }
}

/**
 * Creates a new Next.js project with shadcn-ui configuration
 */
export async function createProject(
  options: Pick<z.infer<typeof initOptionsSchema>, "cwd" | "force" | "srcDir">
) {
  // Set default options
  options = {
    srcDir: false,
    ...options,
  }

  // Confirm project creation if not forced
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

  // Get package manager preference
  const packageManager = await getPackageManager(options.cwd)
  
  // Prompt for project name with validation
  const { name } = await prompts({
    type: "text",
    name: "name",
    message: "What is your project named?",
    initial: "my-app",
    format: (value: string) => value.trim(),
    validate: (value: string) => {
      const validation = isValidProjectName(value)
      return validation.isValid || validation.message
    },
  })

  const projectPath = path.join(options.cwd, name)

  // Verify write permissions
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

  // Check if project already exists
  if (fs.existsSync(path.resolve(projectPath, "package.json"))) {
    logger.break()
    logger.error(
      `A project with the name ${highlighter.info(name)} already exists.`
    )
    logger.error(`Please choose a different name and try again.`)
    logger.break()
    process.exit(1)
  }

  // Start project creation
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
    
    // Handle different types of errors
    if (error instanceof Error) {
      logger.error(`Error creating Next.js project: ${error.message}`)
      
      // Log additional context for common errors
      if (error.message.includes("EACCES")) {
        logger.error("This appears to be a permissions error. Please check your file system permissions.")
      } else if (error.message.includes("NETWORK")) {
        logger.error("This appears to be a network error. Please check your internet connection.")
      }
    } else {
      logger.error(
        "Something went wrong creating a new Next.js project. Please ensure your project name follows Next.js naming conventions (lowercase letters, numbers, and hyphens only)."
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
