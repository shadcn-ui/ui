import * as path from "path"
import { validateRegistry } from "@/src/registry/validate"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { Command } from "commander"
import { z } from "zod"

const validateOptionsSchema = z.object({
  cwd: z.string(),
  registryFile: z.string(),
})

export const validate = new Command()
  .name("validate")
  .description("validate a shadcn registry")
  .argument("[registry]", "path to registry.json file", "./registry.json")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async (registryFile: string, opts) => {
    let validationSpinner: ReturnType<typeof spinner> | undefined

    try {
      const options = validateOptionsSchema.parse({
        cwd: path.resolve(opts.cwd),
        registryFile,
      })
      validationSpinner = spinner("Validating registry.").start()
      const report = await validateRegistry(options)

      printRegistryValidationReport(report, validationSpinner)

      if (!report.valid) {
        process.exitCode = 1
      }
    } catch (error) {
      validationSpinner?.fail("Registry validation failed.")
      logger.break()
      handleError(error)
    }
  })

function printRegistryValidationReport(
  report: Awaited<ReturnType<typeof validateRegistry>>,
  validationSpinner: ReturnType<typeof spinner>
) {
  if (report.valid) {
    validationSpinner.succeed("Registry is valid.")
    printRegistryValidationStats(report, { success: true })
    return
  }

  validationSpinner.fail("Registry validation failed.")
  printRegistryValidationStats(report)
  logger.break()

  for (const [registryFile, diagnostics] of Array.from(
    groupDiagnostics(report)
  )) {
    logger.log(highlighter.info(formatPath(registryFile, report.cwd)))

    for (const diagnostic of diagnostics) {
      logger.error(`  - ${formatDiagnostic(diagnostic)}`)
      if (diagnostic.suggestion) {
        logger.log(`    ${diagnostic.suggestion}`)
      }
    }

    logger.break()
  }
}

function printRegistryValidationStats(
  report: Awaited<ReturnType<typeof validateRegistry>>,
  options: {
    success?: boolean
  } = {}
) {
  const message = `Checked ${formatCount(
    report.registryFiles,
    "registry file",
    "registry files"
  )} and ${formatCount(report.items, "item", "items")}.`

  if (options.success) {
    printSuccess(message)
  } else {
    logger.log(`  ${message}`)
  }

  for (const registryFile of report.registryFilePaths) {
    logger.log(`  - ${formatPath(registryFile, report.cwd)}`)
  }
}

function groupDiagnostics(
  report: Awaited<ReturnType<typeof validateRegistry>>
) {
  const groups = new Map<string, typeof report.diagnostics>()

  for (const diagnostic of report.diagnostics) {
    const diagnostics = groups.get(diagnostic.registryFile) ?? []
    diagnostics.push(diagnostic)
    groups.set(diagnostic.registryFile, diagnostics)
  }

  return groups
}

function formatDiagnostic(
  diagnostic: Awaited<
    ReturnType<typeof validateRegistry>
  >["diagnostics"][number]
) {
  const context = []

  if (diagnostic.itemIndex !== undefined) {
    context.push(`items[${diagnostic.itemIndex}]`)
  }

  if (diagnostic.itemName) {
    context.push(`"${diagnostic.itemName}"`)
  }

  if (diagnostic.includePath) {
    context.push(`include "${diagnostic.includePath}"`)
  }

  if (diagnostic.filePath) {
    context.push(`file "${diagnostic.filePath}"`)
  }

  if (!context.length) {
    return diagnostic.message
  }

  return `${context.join(" ")}: ${diagnostic.message}`
}

function formatPath(filePath: string, cwd: string) {
  const relativePath = path.relative(cwd, filePath)

  if (
    relativePath &&
    !relativePath.startsWith("..") &&
    !path.isAbsolute(relativePath)
  ) {
    return relativePath.split(path.sep).join("/")
  }

  if (!relativePath) {
    return "."
  }

  return filePath
}

function printSuccess(message: string) {
  spinner(message).succeed()
}

function formatCount(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`
}
