import os from "os"
import path from "path"
import { initOptionsSchema } from "@/src/commands/init"
import { fetchRegistry } from "@/src/registry/api"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import {
  LINTERS,
  Linter,
  removeEslintConfigs,
  removeEslintDependencies,
} from "@/src/utils/linter"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { execa } from "execa"
import fs from "fs-extra"
import prompts from "prompts"
import { z } from "zod"

const MONOREPO_TEMPLATE_URL =
  "https://codeload.github.com/shadcn-ui/ui/tar.gz/main"

export const TEMPLATES = {
  next: "next",
  "next-monorepo": "next-monorepo",
} as const

/**
 * Setup Biome in the specified directory
 * @param directory - The directory to set up Biome in
 * @param packageManager - The package manager to use
 * @param spinnerInstance - Optional spinner to update during setup
 */
async function setupBiome(
  directory: string,
  packageManager: string,
  spinnerInstance?: ReturnType<typeof spinner>
) {
  try {
    if (spinnerInstance) {
      spinnerInstance.text = "Setting up Biome..."
    }

    // Install biome
    await execa(
      packageManager,
      ["add", "-D", "@biomejs/biome", "--save-exact"],
      { cwd: directory }
    )

    // Run biome init to create the configuration file based on package manager
    let biomeInitCmd: string
    let biomeInitArgs: string[]

    switch (packageManager) {
      case "npm":
        biomeInitCmd = "npx"
        biomeInitArgs = ["@biomejs/biome", "init"]
        break
      case "yarn":
        biomeInitCmd = "yarn"
        biomeInitArgs = ["biome", "init"]
        break
      case "pnpm":
        biomeInitCmd = "pnpm"
        biomeInitArgs = ["biome", "init"]
        break
      case "bun":
        biomeInitCmd = "bunx"
        biomeInitArgs = ["@biomejs/biome", "init"]
        break
      default:
        biomeInitCmd = "npx"
        biomeInitArgs = ["@biomejs/biome", "init"]
    }

    await execa(biomeInitCmd, biomeInitArgs, { cwd: directory })

    // Update package.json scripts to use biome
    const pkgJsonPath = path.join(directory, "package.json")
    const pkgJson = await fs.readJSON(pkgJsonPath)

    pkgJson.scripts = {
      ...pkgJson.scripts,
      lint: "biome lint .",
      format: "biome format --write .",
      check: "biome check .",
    }

    // Remove ESLint configurations if they exist
    await removeEslintConfigs(directory)

    // Remove ESLint dependencies if they exist
    if (pkgJson.devDependencies) {
      const eslintDeps = Object.keys(pkgJson.devDependencies).filter((dep) =>
        dep.includes("eslint")
      )

      if (eslintDeps.length > 0 && spinnerInstance) {
        spinnerInstance.text = "Removing ESLint dependencies..."
      }

      // Remove ESLint dependencies using the utility function
      pkgJson.devDependencies = removeEslintDependencies(
        pkgJson.devDependencies
      )
    }

    await fs.writeJSON(pkgJsonPath, pkgJson, { spaces: 2 })

    return true
  } catch (error) {
    handleError(error)
    return false
  }
}

export async function createProject(
  options: Pick<
    z.infer<typeof initOptionsSchema>,
    "cwd" | "force" | "srcDir" | "components" | "template" | "linter"
  >
) {
  options = {
    srcDir: false,
    ...options,
  }

  let template: keyof typeof TEMPLATES =
    options.template && TEMPLATES[options.template as keyof typeof TEMPLATES]
      ? (options.template as keyof typeof TEMPLATES)
      : "next"
  let projectName: string =
    template === TEMPLATES.next ? "my-app" : "my-monorepo"
  let nextVersion = "latest"

  const isRemoteComponent =
    options.components?.length === 1 &&
    !!options.components[0].match(/\/chat\/b\//)

  if (options.components && isRemoteComponent) {
    try {
      const [result] = await fetchRegistry(options.components)
      const { meta } = z
        .object({
          meta: z.object({
            nextVersion: z.string(),
          }),
        })
        .parse(result)
      nextVersion = meta.nextVersion

      // Force template to next for remote components.
      template = TEMPLATES.next
    } catch (error) {
      logger.break()
      handleError(error)
    }
  }

  if (!options.force) {
    const { type, name } = await prompts([
      {
        type: options.template || isRemoteComponent ? null : "select",
        name: "type",
        message: `The path ${highlighter.info(
          options.cwd
        )} does not contain a package.json file.\n  Would you like to start a new project?`,
        choices: [
          { title: "Next.js", value: "next" },
          { title: "Next.js (Monorepo)", value: "next-monorepo" },
        ],
        initial: 0,
      },
      {
        type: "text",
        name: "name",
        message: "What is your project named?",
        initial: projectName,
        format: (value: string) => value.trim(),
        validate: (value: string) =>
          value.length > 128
            ? `Name should be less than 128 characters.`
            : true,
      },
    ])

    template = type ?? template
    projectName = name
  }

  const packageManager = await getPackageManager(options.cwd, {
    withFallback: true,
  })

  const projectPath = `${options.cwd}/${projectName}`

  // Check if path is writable.
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

  if (fs.existsSync(path.resolve(options.cwd, projectName, "package.json"))) {
    logger.break()
    logger.error(
      `A project with the name ${highlighter.info(projectName)} already exists.`
    )
    logger.error(`Please choose a different name and try again.`)
    logger.break()
    process.exit(1)
  }

  if (template === TEMPLATES.next) {
    await createNextProject(projectPath, {
      version: nextVersion,
      cwd: options.cwd,
      packageManager,
      srcDir: !!options.srcDir,
      linter: options.linter || "eslint",
    })
  }

  if (template === TEMPLATES["next-monorepo"]) {
    await createMonorepoProject(projectPath, {
      packageManager,
      linter: options.linter || "eslint",
    })
  }

  return {
    projectPath,
    projectName,
    template,
  }
}

async function createNextProject(
  projectPath: string,
  options: {
    version: string
    cwd: string
    packageManager: string
    srcDir: boolean
    linter: Linter
  }
) {
  const createSpinner = spinner(
    `Creating a new Next.js project. This may take a few minutes.`
  ).start()

  // Note: pnpm fails here. Fallback to npx with --use-PACKAGE-MANAGER.
  const args = [
    "--tailwind",
    options.linter === LINTERS.eslint ? "--eslint" : "--no-eslint",
    "--typescript",
    "--app",
    options.srcDir ? "--src-dir" : "--no-src-dir",
    "--no-import-alias",
    `--use-${options.packageManager}`,
  ]

  if (
    options.version.startsWith("15") ||
    options.version.startsWith("latest") ||
    options.version.startsWith("canary")
  ) {
    args.push("--turbopack")
  }

  try {
    await execa(
      "npx",
      [`create-next-app@${options.version}`, projectPath, "--silent", ...args],
      {
        cwd: options.cwd,
      }
    )

    // If Biome is selected, set it up
    if (options.linter === LINTERS.biome) {
      await setupBiome(projectPath, options.packageManager, createSpinner)
    }
  } catch (error) {
    logger.break()
    logger.error(
      `Something went wrong creating a new Next.js project. Please try again.`
    )
    process.exit(1)
  }

  createSpinner?.succeed(
    `Creating a new Next.js project with ${
      options.linter === LINTERS.eslint ? "ESLint" : "Biome"
    }.`
  )
}

async function createMonorepoProject(
  projectPath: string,
  options: {
    packageManager: string
    linter: Linter
  }
) {
  const createSpinner = spinner(
    `Creating a new Next.js monorepo. This may take a few minutes.`
  ).start()

  try {
    // Get the template.
    const templatePath = path.join(os.tmpdir(), `shadcn-template-${Date.now()}`)
    await fs.ensureDir(templatePath)
    const response = await fetch(MONOREPO_TEMPLATE_URL)
    if (!response.ok) {
      throw new Error(`Failed to download template: ${response.statusText}`)
    }

    // Write the tar file
    const tarPath = path.resolve(templatePath, "template.tar.gz")
    await fs.writeFile(tarPath, Buffer.from(await response.arrayBuffer()))
    await execa("tar", [
      "-xzf",
      tarPath,
      "-C",
      templatePath,
      "--strip-components=2",
      "ui-main/templates/monorepo-next",
    ])
    const extractedPath = path.resolve(templatePath, "monorepo-next")
    await fs.move(extractedPath, projectPath)
    await fs.remove(templatePath)

    // Run install.
    await execa(options.packageManager, ["install"], {
      cwd: projectPath,
    })

    // If Biome is selected, set it up at the monorepo root
    if (options.linter === LINTERS.biome) {
      await setupBiome(projectPath, options.packageManager, createSpinner)

      // Remove ESLint configurations from workspace packages
      const packagesPath = path.join(projectPath, "packages")
      const appsPath = path.join(projectPath, "apps")

      if (await fs.pathExists(packagesPath)) {
        const packages = await fs.readdir(packagesPath)
        for (const pkg of packages) {
          const packagePath = path.join(packagesPath, pkg)
          await removeEslintConfigs(packagePath)
        }
      }

      if (await fs.pathExists(appsPath)) {
        const apps = await fs.readdir(appsPath)
        for (const app of apps) {
          const appPath = path.join(appsPath, app)
          await removeEslintConfigs(appPath)
        }
      }
    }

    // Try git init.
    const cwd = process.cwd()
    await execa("git", ["--version"], { cwd: projectPath })
    await execa("git", ["init"], { cwd: projectPath })
    await execa("git", ["add", "-A"], { cwd: projectPath })
    await execa("git", ["commit", "-m", "Initial commit"], {
      cwd: projectPath,
    })
    await execa("cd", [cwd])

    createSpinner?.succeed(
      `Creating a new Next.js monorepo with ${
        options.linter === LINTERS.eslint ? "ESLint" : "Biome"
      }.`
    )
  } catch (error) {
    createSpinner?.fail("Something went wrong creating a new Next.js monorepo.")
    handleError(error)
  }
}
