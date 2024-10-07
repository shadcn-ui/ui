import { existsSync, promises as fs } from "fs"
import path, { basename } from "path"
import { Config } from "@/src/utils/get-config"
import { getProjectInfo } from "@/src/utils/get-project-info"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import {
  getRegistryBaseColor,
  getRegistryItemFileTargetPath,
} from "@/src/utils/registry"
import { RegistryItem } from "@/src/utils/registry/schema"
import { spinner } from "@/src/utils/spinner"
import { transform } from "@/src/utils/transformers"
import { transformCssVars } from "@/src/utils/transformers/transform-css-vars"
import { transformImport } from "@/src/utils/transformers/transform-import"
import { transformRsc } from "@/src/utils/transformers/transform-rsc"
import { transformTwPrefixes } from "@/src/utils/transformers/transform-tw-prefix"
import prompts from "prompts"

export function resolveTargetDir(
  projectInfo: Awaited<ReturnType<typeof getProjectInfo>>,
  config: Config,
  target: string
) {
  if (target.startsWith("~/")) {
    return path.join(config.resolvedPaths.cwd, target.replace("~/", ""))
  }
  return projectInfo?.isSrcDir
    ? path.join(config.resolvedPaths.cwd, "src", target)
    : path.join(config.resolvedPaths.cwd, target)
}

export async function updateFiles(
  files: RegistryItem["files"],
  config: Config,
  options: {
    overwrite?: boolean
    force?: boolean
    silent?: boolean
  }
) {
  if (!files?.length) {
    return
  }
  options = {
    overwrite: false,
    force: false,
    silent: false,
    ...options,
  }
  const filesCreatedSpinner = spinner(`Updating files.`, {
    silent: options.silent,
  })?.start()

  const [projectInfo, baseColor] = await Promise.all([
    getProjectInfo(config.resolvedPaths.cwd),
    getRegistryBaseColor(config.tailwind.baseColor),
  ])

  const filesCreated = []
  const filesUpdated = []
  const filesSkipped = []

  for (const file of files) {
    if (!file.content) {
      continue
    }

    let targetDir = getRegistryItemFileTargetPath(file, config)
    const fileName = basename(file.path)
    let filePath = path.join(targetDir, fileName)

    if (file.target) {
      filePath = resolveTargetDir(projectInfo, config, file.target)
      targetDir = path.dirname(filePath)
    }

    if (!config.tsx) {
      filePath = filePath.replace(/\.tsx?$/, (match) =>
        match === ".tsx" ? ".jsx" : ".js"
      )
    }

    const existingFile = existsSync(filePath)
    if (existingFile && !options.overwrite) {
      filesCreatedSpinner.stop()
      const { overwrite } = await prompts({
        type: "confirm",
        name: "overwrite",
        message: `The file ${highlighter.info(
          fileName
        )} already exists. Would you like to overwrite?`,
        initial: false,
      })

      if (!overwrite) {
        filesSkipped.push(path.relative(config.resolvedPaths.cwd, filePath))
        continue
      }
      filesCreatedSpinner?.start()
    }

    // Create the target directory if it doesn't exist.
    if (!existsSync(targetDir)) {
      await fs.mkdir(targetDir, { recursive: true })
    }

    // Run our transformers.
    const content = await transform(
      {
        filename: file.path,
        raw: file.content,
        config,
        baseColor,
        transformJsx: !config.tsx,
      },
      [transformImport, transformRsc, transformCssVars, transformTwPrefixes]
    )

    await fs.writeFile(filePath, content, "utf-8")
    existingFile
      ? filesUpdated.push(path.relative(config.resolvedPaths.cwd, filePath))
      : filesCreated.push(path.relative(config.resolvedPaths.cwd, filePath))
  }

  const hasUpdatedFiles = filesCreated.length || filesUpdated.length
  if (!hasUpdatedFiles && !filesSkipped.length) {
    filesCreatedSpinner?.info("No files updated.")
  }

  if (filesCreated.length) {
    filesCreatedSpinner?.succeed(
      `Created ${filesCreated.length} ${
        filesCreated.length === 1 ? "file" : "files"
      }:`
    )
    if (!options.silent) {
      for (const file of filesCreated) {
        logger.log(`  - ${file}`)
      }
    }
  } else {
    filesCreatedSpinner?.stop()
  }

  if (filesUpdated.length) {
    spinner(
      `Updated ${filesUpdated.length} ${
        filesUpdated.length === 1 ? "file" : "files"
      }:`,
      {
        silent: options.silent,
      }
    )?.info()
    if (!options.silent) {
      for (const file of filesUpdated) {
        logger.log(`  - ${file}`)
      }
    }
  }

  if (filesSkipped.length) {
    spinner(
      `Skipped ${filesSkipped.length} ${
        filesUpdated.length === 1 ? "file" : "files"
      }:`,
      {
        silent: options.silent,
      }
    )?.info()
    if (!options.silent) {
      for (const file of filesSkipped) {
        logger.log(`  - ${file}`)
      }
    }
  }

  if (!options.silent) {
    logger.break()
  }
}

export async function removeFiles(
  files: RegistryItem["files"],
  config: Config,
  options: {
    force?: boolean
    silent?: boolean
  }
  // components: string[]
) {
  if (!files?.length) {
    return
  }
  options = {
    force: false,
    silent: false,
    ...options,
  }

  const filesDeletedSpinner = spinner(`removing files.`, {
    silent: options.silent,
  })?.start()

  const projectInfo = await getProjectInfo(config.resolvedPaths.cwd)

  const filesDeleted: string[] = []
  // const filesSkipped: string[] = []
  const filesNotFound: string[] = []

  for (const file of files) {
    let targetDir = getRegistryItemFileTargetPath(file, config)
    const fileName = basename(file.path)
    let filePath = path.join(targetDir, fileName)

    if (file.target) {
      filePath = resolveTargetDir(projectInfo, config, file.target)
      targetDir = path.dirname(filePath)
    }

    if (!config.tsx) {
      filePath = filePath.replace(/\.tsx?$/, (match) =>
        match === ".tsx" ? ".jsx" : ".js"
      )
    }
    const existingFile = existsSync(filePath)
    if (!existingFile) {
      filesNotFound.push(path.relative(config.resolvedPaths.cwd, filePath))
      continue
    }
 
    await fs.rm(filePath)
    filesDeleted.push(path.relative(config.resolvedPaths.cwd, filePath))
  }
  filesDeletedSpinner.stop()

  if (filesNotFound.length) {
    spinner(
      `${filesNotFound.length} ${
        filesNotFound.length === 1 ? "file" : "files"
      } Not found :`
    )?.fail()
    if (!options.silent) {
      for (const file of filesNotFound) {
        logger.log(`  - ${file}`)
      }
    }
  }
  if (!filesDeleted.length) {
    spinner("No files deleted.").fail()
    return
  }
  spinner(
    `deleted ${filesDeleted.length} ${
      filesDeleted.length === 1 ? "file" : "files"
    }:`
  )?.succeed()
  if (!options.silent) {
    for (const file of filesDeleted) {
      logger.log(`  - ${file}`)
    }
  }

  if (!options.silent) {
    logger.break()
  }
}
