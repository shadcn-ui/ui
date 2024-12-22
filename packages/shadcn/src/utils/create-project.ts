import os from "os"
import path from "path"
import { initOptionsSchema } from "@/src/commands/init"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { fetchRegistry } from "@/src/utils/registry"
import { spinner } from "@/src/utils/spinner"
import { execa } from "execa"
import fs from "fs-extra"
import prompts from "prompts"
import { z } from "zod"

const MONOREPO_TEMPLATE_URL =
  "https://codeload.github.com/shadcn-ui/ui/tar.gz/main"

export async function createProject(
  options: Pick<
    z.infer<typeof initOptionsSchema>,
    "cwd" | "force" | "srcDir" | "components"
  >
) {
  options = {
    srcDir: false,
    ...options,
  }

  let projectType: "next" | "monorepo" = "next"
  let projectName: string = "my-app"
  let nextVersion = "15.1.0"

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
    } catch (error) {
      logger.break()
      handleError(error)
    }
  }

  if (!options.force) {
    const { type, name } = await prompts([
      {
        type: "select",
        name: "type",
        message: `The path ${highlighter.info(
          options.cwd
        )} does not contain a package.json file.\n  Would you like to start a new project?`,
        choices: [
          { title: "Next.js", value: "next" },
          { title: "Next.js (Monorepo)", value: "monorepo" },
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

    projectType = type
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

  if (projectType === "next") {
    await createNextProject(projectPath, {
      version: nextVersion,
      cwd: options.cwd,
      packageManager,
      srcDir: !!options.srcDir,
    })
  }

  if (projectType === "monorepo") {
    await createMonorepoProject(projectPath, {
      packageManager,
    })
  }

  return {
    projectPath,
    projectName,
    projectType,
  }
}

async function createNextProject(
  projectPath: string,
  options: {
    version: string
    cwd: string
    packageManager: string
    srcDir: boolean
  }
) {
  const createSpinner = spinner(
    `Creating a new Next.js project. This may take a few minutes.`
  ).start()

  // Note: pnpm fails here. Fallback to npx with --use-PACKAGE-MANAGER.
  const args = [
    "--tailwind",
    "--eslint",
    "--typescript",
    "--app",
    options.srcDir ? "--src-dir" : "--no-src-dir",
    "--no-import-alias",
    `--use-${options.packageManager}`,
  ]

  if (options.version.startsWith("15")) {
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
  } catch (error) {
    logger.break()
    logger.error(
      `Something went wrong creating a new Next.js project. Please try again.`
    )
    process.exit(1)
  }

  createSpinner?.succeed("Creating a new Next.js project.")
}

async function createMonorepoProject(
  projectPath: string,
  options: {
    packageManager: string
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

    // Try git init.
    const cwd = process.cwd()
    await execa("git", ["--version"], { cwd: projectPath })
    await execa("git", ["init"], { cwd: projectPath })
    await execa("git", ["add", "-A"], { cwd: projectPath })
    await execa("git", ["commit", "-m", "Initial commit"], {
      cwd: projectPath,
    })
    await execa("cd", [cwd])

    createSpinner?.succeed("Creating a new Next.js monorepo.")
  } catch (error) {
    createSpinner?.fail("Something went wrong creating a new Next.js monorepo.")
    handleError(error)
  }
}
