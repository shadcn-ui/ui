import path from "path"
import {
  RegistryItemNotFoundError,
  RegistryParseError,
  RegistrySourceFileError,
  RegistryValidationError,
} from "@/src/registry/errors"
import { isUrl } from "@/src/registry/utils"
import {
  registryChunkSchema,
  registryItemSchema,
  type Registry,
  type RegistryItem,
} from "@/src/schema"
import { z } from "zod"

type RegistryChunk = z.infer<typeof registryChunkSchema>

type RegistryItemSource = {
  registryFile: string
  registryDir: string
  itemIndex: number
}

type SourceRegistryLoadResult = {
  registry: Registry
  itemSources: Map<string, RegistryItemSource>
  itemSourcesByItem: Map<RegistryItem, RegistryItemSource>
  usesInclude: boolean
}

export type RegistrySourceReader = {
  readText(filePath: string): Promise<string>
}

export async function loadRegistryItemFromSource(
  itemName: string,
  reader: RegistrySourceReader,
  options: {
    registryFile?: string
    source?: string
  } = {}
) {
  const registryFile = normalizeSourcePath(
    options.registryFile ?? "registry.json"
  )
  const result = await readSourceRegistryWithIncludes(registryFile, reader, {
    source: options.source,
  })
  const item = result.registry.items.find((item) => item.name === itemName)

  if (!item) {
    throw new RegistryItemNotFoundError(itemName)
  }

  return createRegistryItemFromSource(item, result, reader)
}

export async function loadRegistryCatalogFromSource(
  reader: RegistrySourceReader,
  options: {
    registryFile?: string
    source?: string
  } = {}
) {
  const registryFile = normalizeSourcePath(
    options.registryFile ?? "registry.json"
  )
  const result = await readSourceRegistryWithIncludes(registryFile, reader, {
    source: options.source,
  })

  return createRegistryCatalogFromSource(result)
}

async function readSourceRegistryWithIncludes(
  registryFile: string,
  reader: RegistrySourceReader,
  options: {
    source?: string
  } = {}
) {
  const content = await readRegistryJson(registryFile, reader, options)
  const rootRegistry = parseRegistry(content, registryFile)
  validateRootRegistry(rootRegistry, registryFile)
  const context = {
    itemSources: new Map<string, RegistryItemSource>(),
    itemSourcesByItem: new Map<RegistryItem, RegistryItemSource>(),
    firstIncludedFrom: new Map<string, string>(),
  }
  const usesInclude = !!rootRegistry.include?.length

  if (!usesInclude) {
    const registryDir = getSourceDir(registryFile)

    rootRegistry.items.forEach((item, itemIndex) => {
      validateRegistryItemFiles(item, registryFile, registryDir)

      const source = {
        registryFile,
        registryDir,
        itemIndex,
      }
      context.itemSources.set(item.name, source)
      context.itemSourcesByItem.set(item, source)
    })
    validateDuplicateItems(rootRegistry.items, context.itemSourcesByItem)

    return {
      registry: rootRegistry,
      itemSources: context.itemSources,
      itemSourcesByItem: context.itemSourcesByItem,
      usesInclude,
    }
  }

  if (path.posix.basename(registryFile) !== "registry.json") {
    throw new RegistryValidationError(
      `Invalid source registry file at ${registryFile}: registries that use include must be named registry.json.`,
      { registryFile }
    )
  }

  const result = await readRegistryFile(
    registryFile,
    rootRegistry,
    reader,
    context,
    []
  )

  validateDuplicateItems(result.items, context.itemSourcesByItem)

  const { include, ...registry } = result
  validateRootRegistry(registry, registryFile)

  return {
    registry,
    itemSources: context.itemSources,
    itemSourcesByItem: context.itemSourcesByItem,
    usesInclude,
  }
}

async function createRegistryItemFromSource(
  item: RegistryItem,
  result: SourceRegistryLoadResult,
  reader: RegistrySourceReader
) {
  const registryItem = {
    ...rewriteRegistryItemFilePaths(item, result.itemSourcesByItem),
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
  }

  await Promise.all(
    (item.files ?? []).map(async (sourceFile, index) => {
      const file = registryItem.files?.[index]
      if (!file) {
        return
      }

      const source = result.itemSourcesByItem.get(item)
      const sourcePath = getRegistryItemFileSourceForItem(
        item,
        sourceFile.path,
        result.itemSourcesByItem
      )
      file.content = await readRegistryItemFileContent(
        item.name,
        sourceFile.path,
        sourcePath,
        source,
        reader
      )
    })
  )

  return registryItemSchema.parse(registryItem)
}

function createRegistryCatalogFromSource(result: SourceRegistryLoadResult) {
  return {
    ...result.registry,
    items: result.registry.items.map((item) =>
      stripRegistryItemFileContent(
        rewriteRegistryItemFilePaths(item, result.itemSourcesByItem)
      )
    ),
  }
}

async function readRegistryItemFileContent(
  itemName: string,
  filePath: string,
  sourcePath: string,
  source: RegistryItemSource | undefined,
  reader: RegistrySourceReader
) {
  try {
    return await reader.readText(sourcePath)
  } catch (error) {
    const isGitHubSourceFileError =
      error instanceof RegistrySourceFileError &&
      error.context?.reason === "github-source-file"

    throw new RegistrySourceFileError(sourcePath, error, {
      message: `Failed to read file "${filePath}" for registry item "${itemName}" (${formatItemSource(
        source
      )}). Expected file at ${sourcePath}.`,
      context: {
        registryFile: source?.registryFile,
        itemIndex: source?.itemIndex,
        itemName,
        itemFilePath: filePath,
        sourcePath,
      },
      suggestion:
        isGitHubSourceFileError && error.suggestion
          ? error.suggestion
          : "Make sure the file path is relative to the registry.json file that declares the item.",
    })
  }
}

function rewriteRegistryItemFilePaths(
  item: RegistryItem,
  itemSourcesByItem: Map<RegistryItem, RegistryItemSource>
) {
  return {
    ...item,
    files: item.files?.map((file) => ({
      ...file,
      path: getRegistryItemFileRootPathForItem(
        item,
        file.path,
        itemSourcesByItem
      ),
    })),
  }
}

function stripRegistryItemFileContent(item: RegistryItem) {
  return {
    ...item,
    files: item.files?.map(({ content, ...file }) => file),
  }
}

function getRegistryItemFileSourceForItem(
  item: RegistryItem,
  filePath: string,
  itemSourcesByItem: Map<RegistryItem, RegistryItemSource>
) {
  const source = itemSourcesByItem.get(item)
  return joinSourcePath(source?.registryDir ?? ".", filePath)
}

function getRegistryItemFileRootPathForItem(
  item: RegistryItem,
  filePath: string,
  itemSourcesByItem: Map<RegistryItem, RegistryItemSource>
) {
  const sourcePath = getRegistryItemFileSourceForItem(
    item,
    filePath,
    itemSourcesByItem
  )

  return relativeSourcePath(".", sourcePath)
}

async function readRegistryFile(
  registryFile: string,
  registry: RegistryChunk,
  reader: RegistrySourceReader,
  context: {
    itemSources: Map<string, RegistryItemSource>
    itemSourcesByItem: Map<RegistryItem, RegistryItemSource>
    firstIncludedFrom: Map<string, string>
  },
  chain: string[]
): Promise<RegistryChunk> {
  validateRegistryFileWithinRoot(registryFile)

  if (chain.length >= 32) {
    throw new RegistryValidationError(
      `Registry include tree is too deep at ${registryFile}. The maximum include depth is 32.`,
      {
        registryFile,
        context: {
          maxDepth: 32,
        },
        suggestion:
          "Flatten part of the registry include tree or reduce nested include depth.",
      }
    )
  }

  if (chain.includes(registryFile)) {
    throw new RegistryValidationError(
      formatIncludeCycle([...chain, registryFile]),
      {
        registryFile,
      }
    )
  }

  const includedFrom = chain.at(-1) ?? registryFile
  const existingSource = context.firstIncludedFrom.get(registryFile)
  if (existingSource) {
    throw new RegistryValidationError(
      `Registry file included more than once: ${registryFile}.\n` +
        `  - first included from ${existingSource}\n` +
        `  - included again from ${includedFrom}\n` +
        `Each registry.json file can only appear once in the resolved include tree. Remove one include or move shared items into a single included registry.json.`,
      {
        registryFile,
        context: {
          firstSource: existingSource,
          secondSource: includedFrom,
        },
      }
    )
  }

  context.firstIncludedFrom.set(registryFile, includedFrom)

  const nextChain = [...chain, registryFile]
  const registryDir = getSourceDir(registryFile)

  const includedItems: RegistryItem[] = []
  for (const includePath of registry.include ?? []) {
    const includedRegistryFile = resolveIncludePath(
      includePath,
      registryDir,
      registryFile
    )
    const content = await readRegistryJson(includedRegistryFile, reader)
    const parsedRegistry = parseRegistry(content, includedRegistryFile)
    const includedRegistry = await readRegistryFile(
      includedRegistryFile,
      parsedRegistry,
      reader,
      context,
      nextChain
    )
    includedItems.push(...includedRegistry.items)
  }

  registry.items?.forEach((item, itemIndex) => {
    validateRegistryItemFiles(item, registryFile, registryDir)
    context.itemSources.set(item.name, {
      registryFile,
      registryDir,
      itemIndex,
    })
    context.itemSourcesByItem.set(item, {
      registryFile,
      registryDir,
      itemIndex,
    })
  })

  return {
    ...registry,
    items: [...includedItems, ...(registry.items ?? [])],
  }
}

async function readRegistryJson(
  registryFile: string,
  reader: RegistrySourceReader,
  options: {
    source?: string
  } = {}
) {
  try {
    return await reader.readText(registryFile)
  } catch (error) {
    if (
      error instanceof RegistrySourceFileError &&
      (error.context?.reason === "github-ref-resolution" ||
        error.context?.reason === "github-source-file")
    ) {
      throw error
    }

    throw new RegistrySourceFileError(registryFile, error, {
      message: `Failed to read source registry file at ${formatSourcePath(
        registryFile,
        options.source
      )}.`,
      context: { registryFile, source: options.source },
      suggestion:
        registryFile === "registry.json"
          ? "Check that the repository has a registry.json file at its root."
          : "Check that the included registry.json file exists and that the include path is correct.",
    })
  }
}

function parseRegistry(content: string, registryFile: string) {
  let json: unknown
  try {
    json = JSON.parse(content)
  } catch (error) {
    throw new RegistryParseError(registryFile, error, {
      subject: "registry file",
      context: { registryFile },
      suggestion:
        "Fix the JSON syntax in the registry.json file and try again.",
    })
  }

  const result = registryChunkSchema.safeParse(json)
  if (!result.success) {
    throw new RegistryValidationError(
      `Invalid registry file at ${registryFile}:\n${formatZodIssues(
        result.error
      )}`,
      {
        registryFile,
        cause: result.error,
        suggestion:
          "Update the registry.json file so it matches the registry schema.",
      }
    )
  }

  return result.data
}

function validateRootRegistry(
  registry: RegistryChunk,
  registryFile: string
): asserts registry is Registry {
  const missingFields = []

  if (!registry.name) {
    missingFields.push("name")
  }

  if (!registry.homepage) {
    missingFields.push("homepage")
  }

  if (missingFields.length) {
    throw new RegistryValidationError(
      `Invalid root registry file at ${registryFile}: root registry.json must define ${missingFields
        .map((field) => `"${field}"`)
        .join(" and ")}. Included registry.json files may omit these fields.`,
      { registryFile }
    )
  }
}

function resolveIncludePath(
  includePath: string,
  registryDir: string,
  registryFile: string
) {
  if (isUrl(includePath)) {
    throw new RegistryValidationError(
      `Invalid include "${includePath}" in ${registryFile}: remote includes are not supported by shadcn build. Use a relative path to a registry.json file in the same repository.`,
      {
        registryFile,
        context: { includePath },
      }
    )
  }

  if (path.posix.isAbsolute(includePath)) {
    throw new RegistryValidationError(
      `Invalid include "${includePath}" in ${registryFile}: include paths must be relative. Use a path like "./registry/ui/registry.json".`,
      {
        registryFile,
        context: { includePath },
      }
    )
  }

  if (hasParentTraversal(includePath)) {
    throw new RegistryValidationError(
      `Invalid include "${includePath}" in ${registryFile}: include paths cannot use parent-directory traversal. Keep included registry.json files inside the registry root.`,
      {
        registryFile,
        context: { includePath },
      }
    )
  }

  if (path.posix.basename(includePath) !== "registry.json") {
    throw new RegistryValidationError(
      `Invalid include "${includePath}" in ${registryFile}: include paths must explicitly reference a registry.json file. Use a path like "./registry/ui/registry.json".`,
      {
        registryFile,
        context: { includePath },
      }
    )
  }

  const resolvedPath = joinSourcePath(registryDir, includePath)
  validateRegistryFileWithinRoot(resolvedPath)

  return resolvedPath
}

function validateRegistryFileWithinRoot(registryFile: string) {
  if (!isSourcePathInsideRoot(registryFile)) {
    throw new RegistryValidationError(
      `Invalid registry file at ${registryFile}: registry includes must stay inside the source registry root.`,
      {
        registryFile,
      }
    )
  }
}

function validateRegistryItemFiles(
  item: RegistryItem,
  registryFile: string,
  registryDir: string
) {
  for (const file of item.files ?? []) {
    if (isUrl(file.path)) {
      throw new RegistryValidationError(
        `Invalid file path "${file.path}" for item "${item.name}" in ${registryFile}: remote file paths are not supported by shadcn build.`,
        {
          registryFile,
          context: { itemName: item.name, filePath: file.path },
        }
      )
    }

    if (path.posix.isAbsolute(file.path)) {
      throw new RegistryValidationError(
        `Invalid file path "${file.path}" for item "${item.name}" in ${registryFile}: file paths must be relative.`,
        {
          registryFile,
          context: { itemName: item.name, filePath: file.path },
        }
      )
    }

    if (hasParentTraversal(file.path)) {
      throw new RegistryValidationError(
        `Invalid file path "${file.path}" for item "${item.name}" in ${registryFile}: file paths cannot use parent-directory traversal.`,
        {
          registryFile,
          context: { itemName: item.name, filePath: file.path },
        }
      )
    }

    const resolvedPath = joinSourcePath(registryDir, file.path)
    if (!isSourcePathInsideRoot(resolvedPath, registryDir)) {
      throw new RegistryValidationError(
        `Invalid file path "${file.path}" for item "${item.name}" in ${registryFile}: file paths must stay inside the registry chunk directory.`,
        {
          registryFile,
          context: { itemName: item.name, filePath: file.path },
        }
      )
    }
  }
}

function validateDuplicateItems(
  items: RegistryItem[],
  itemSources: Map<RegistryItem, RegistryItemSource>
) {
  const seen = new Map<string, RegistryItem>()

  for (const item of items) {
    const existing = seen.get(item.name)
    if (!existing) {
      seen.set(item.name, item)
      continue
    }

    const firstSource = itemSources.get(existing)
    const secondSource = itemSources.get(item)
    throw new RegistryValidationError(
      `Duplicate registry item name "${item.name}". Registry item names must be unique.\n` +
        `  - ${formatItemSource(firstSource)}\n` +
        `  - ${formatItemSource(secondSource)}\n` +
        `Rename one of these items so each name is unique across the resolved registry.`,
      {
        context: {
          itemName: item.name,
          firstSource: formatItemSource(firstSource),
          secondSource: formatItemSource(secondSource),
        },
      }
    )
  }
}

function getSourceDir(filePath: string) {
  const dirname = path.posix.dirname(filePath)
  return dirname === "." ? "." : dirname
}

function joinSourcePath(...segments: string[]) {
  const normalized = path.posix.normalize(path.posix.join(...segments))
  return normalized === "." ? "" : normalized
}

function normalizeSourcePath(filePath: string) {
  const normalized = path.posix.normalize(filePath)
  return normalized.startsWith("./") ? normalized.slice(2) : normalized
}

function relativeSourcePath(from: string, to: string) {
  const relative = path.posix.relative(from, to)
  return relative || path.posix.basename(to)
}

function isSourcePathInsideRoot(filePath: string, root = ".") {
  const relative = path.posix.relative(root, filePath)
  return (
    !!relative && !relative.startsWith("..") && !path.posix.isAbsolute(relative)
  )
}

function hasParentTraversal(filePath: string) {
  return filePath.split(/[\\/]+/).includes("..")
}

function formatIncludeCycle(chain: string[]) {
  return `Registry include cycle detected:\n${chain
    .map((file) => `  - ${file}`)
    .join("\n")}`
}

function formatItemSource(source: RegistryItemSource | undefined) {
  if (!source) {
    return "unknown source"
  }

  return `${source.registryFile} items[${source.itemIndex}]`
}

function formatSourcePath(registryFile: string, source?: string) {
  return source ? `${source}/${registryFile}` : registryFile
}

function formatZodIssues(error: z.ZodError) {
  return error.errors
    .map((issue) => {
      const issuePath = issue.path.length ? issue.path.join(".") : "(root)"
      return `  - ${issuePath}: ${issue.message}`
    })
    .join("\n")
}
