import * as fs from "fs/promises"
import * as path from "path"
import {
  RegistryItemNotFoundError,
  RegistryLocalFileError,
  RegistryParseError,
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

const MAX_INCLUDE_DEPTH = 32

type RegistryItemSource = {
  registryFile: string
  registryDir: string
  itemIndex: number
}

type RegistryLoadResult = {
  registry: Registry
  itemSources: Map<string, RegistryItemSource>
  itemSourcesByItem: Map<RegistryItem, RegistryItemSource>
  usesInclude: boolean
}

export type LoadRegistryOptions = {
  cwd?: string
  registryFile?: string
}

export async function loadRegistry(options?: LoadRegistryOptions) {
  const { cwd, registryFile } = resolveLoadRegistryOptions(options)
  const result = await readRegistryWithIncludes(registryFile, { cwd })
  const rootDir = getRegistryRootDir(result, cwd, registryFile)

  return createRegistryCatalog(result, rootDir, cwd)
}

export async function loadRegistryItem(
  itemName: string,
  options?: LoadRegistryOptions
) {
  const { cwd, registryFile } = resolveLoadRegistryOptions(options)
  const result = await readRegistryWithIncludes(registryFile, { cwd })
  const item = result.registry.items.find((item) => item.name === itemName)

  if (!item) {
    throw new RegistryItemNotFoundError(itemName)
  }

  const rootDir = getRegistryRootDir(result, cwd, registryFile)

  return createRegistryItem(item, result, rootDir, cwd)
}

export async function readRegistryWithIncludes(
  registryFile: string,
  options: {
    cwd: string
  }
) {
  const rootFile = path.resolve(options.cwd, registryFile)
  const content = await readRegistryJson(rootFile)
  const rootRegistry = parseRegistry(content, rootFile)
  validateRootRegistry(rootRegistry, rootFile)
  const context = {
    cwd: path.resolve(options.cwd),
    itemSources: new Map<string, RegistryItemSource>(),
    itemSourcesByItem: new Map<RegistryItem, RegistryItemSource>(),
    firstIncludedFrom: new Map<string, string>(),
  }
  const usesInclude = !!rootRegistry.include?.length

  if (!usesInclude) {
    rootRegistry.items.forEach((item, itemIndex) => {
      const source = {
        registryFile: rootFile,
        registryDir: context.cwd,
        itemIndex,
      }
      context.itemSources.set(item.name, source)
      context.itemSourcesByItem.set(item, source)
    })

    return {
      registry: rootRegistry,
      itemSources: context.itemSources,
      itemSourcesByItem: context.itemSourcesByItem,
      usesInclude,
    }
  }

  if (path.basename(rootFile) !== "registry.json") {
    throw new RegistryValidationError(
      `Invalid registry file at ${rootFile}: registries that use include must be named registry.json.`,
      { registryFile: rootFile }
    )
  }

  const result = await readRegistryFile(rootFile, rootRegistry, context, [])

  validateDuplicateItems(result.items, context.itemSourcesByItem)

  const { include, ...registry } = result
  validateRootRegistry(registry, rootFile)

  return {
    registry,
    itemSources: context.itemSources,
    itemSourcesByItem: context.itemSourcesByItem,
    usesInclude,
  }
}

export function createRegistryCatalog(
  result: RegistryLoadResult,
  rootDir: string,
  fallbackDir: string
) {
  return {
    ...result.registry,
    items: result.registry.items.map((item) =>
      stripRegistryItemFileContent(
        rewriteRegistryItemFilePaths(
          item,
          result.itemSourcesByItem,
          rootDir,
          fallbackDir
        )
      )
    ),
  }
}

export async function createRegistryItem(
  item: RegistryItem,
  result: RegistryLoadResult,
  rootDir: string,
  fallbackDir: string
) {
  const registryItem = {
    ...rewriteRegistryItemFilePaths(
      item,
      result.itemSourcesByItem,
      rootDir,
      fallbackDir
    ),
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
        result.itemSourcesByItem,
        fallbackDir
      )
      file.content = await readRegistryItemFileContent(
        item.name,
        sourceFile.path,
        sourcePath,
        source
      )
    })
  )

  return registryItemSchema.parse(registryItem)
}

async function readRegistryItemFileContent(
  itemName: string,
  filePath: string,
  sourcePath: string,
  source: RegistryItemSource | undefined
) {
  try {
    return await fs.readFile(sourcePath, "utf-8")
  } catch (error) {
    throw new RegistryLocalFileError(sourcePath, error, {
      message: `Failed to read file "${filePath}" for registry item "${itemName}" (${formatItemSource(
        source
      )}). Expected file at ${sourcePath}.`,
      context: {
        itemName,
        itemFilePath: filePath,
        sourcePath,
      },
      suggestion:
        "Make sure the file path is relative to the registry.json file that declares the item.",
    })
  }
}

function rewriteRegistryItemFilePaths(
  item: RegistryItem,
  itemSourcesByItem: Map<RegistryItem, RegistryItemSource>,
  rootDir: string,
  fallbackDir: string
) {
  return {
    ...item,
    files: item.files?.map((file) => ({
      ...file,
      path: getRegistryItemFileRootPathForItem(
        item,
        file.path,
        itemSourcesByItem,
        rootDir,
        fallbackDir
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

export function getRegistryItemFileSource(
  itemName: string,
  filePath: string,
  itemSources: Map<string, RegistryItemSource>,
  fallbackDir: string
) {
  const source = itemSources.get(itemName)
  return path.resolve(source?.registryDir ?? fallbackDir, filePath)
}

function getRegistryItemFileSourceForItem(
  item: RegistryItem,
  filePath: string,
  itemSourcesByItem: Map<RegistryItem, RegistryItemSource>,
  fallbackDir: string
) {
  const source = itemSourcesByItem.get(item)
  return path.resolve(source?.registryDir ?? fallbackDir, filePath)
}

export function getRegistryItemFileRootPath(
  itemName: string,
  filePath: string,
  itemSources: Map<string, RegistryItemSource>,
  rootDir: string,
  fallbackDir: string
) {
  const sourcePath = getRegistryItemFileSource(
    itemName,
    filePath,
    itemSources,
    fallbackDir
  )

  return path.relative(rootDir, sourcePath).split(path.sep).join("/")
}

function getRegistryItemFileRootPathForItem(
  item: RegistryItem,
  filePath: string,
  itemSourcesByItem: Map<RegistryItem, RegistryItemSource>,
  rootDir: string,
  fallbackDir: string
) {
  const sourcePath = getRegistryItemFileSourceForItem(
    item,
    filePath,
    itemSourcesByItem,
    fallbackDir
  )

  return path.relative(rootDir, sourcePath).split(path.sep).join("/")
}

async function readRegistryFile(
  registryFile: string,
  registry: RegistryChunk,
  context: {
    cwd: string
    itemSources: Map<string, RegistryItemSource>
    itemSourcesByItem: Map<RegistryItem, RegistryItemSource>
    firstIncludedFrom: Map<string, string>
  },
  chain: string[]
): Promise<RegistryChunk> {
  validateRegistryFileWithinRoot(registryFile, context.cwd)

  if (chain.length >= MAX_INCLUDE_DEPTH) {
    throw new RegistryValidationError(
      `Registry include tree is too deep at ${registryFile}. The maximum include depth is ${MAX_INCLUDE_DEPTH}.`,
      {
        registryFile,
        context: {
          maxDepth: MAX_INCLUDE_DEPTH,
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
  const registryDir = path.dirname(registryFile)

  const includedItems: RegistryItem[] = []
  for (const includePath of registry.include ?? []) {
    const includedRegistryFile = resolveIncludePath(
      includePath,
      registryDir,
      context.cwd,
      registryFile
    )
    const content = await readRegistryJson(includedRegistryFile)
    const parsedRegistry = parseRegistry(content, includedRegistryFile)
    const includedRegistry = await readRegistryFile(
      includedRegistryFile,
      parsedRegistry,
      context,
      nextChain
    )
    includedItems.push(...includedRegistry.items)
  }

  registry.items.forEach((item, itemIndex) => {
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
    items: [...includedItems, ...registry.items],
  }
}

async function readRegistryJson(registryFile: string) {
  try {
    return await fs.readFile(registryFile, "utf-8")
  } catch (error) {
    throw new RegistryLocalFileError(registryFile, error, {
      message: `Failed to read registry file at ${registryFile}.`,
      context: { registryFile },
      suggestion:
        "Check that the registry.json file exists and that the path is correct.",
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
  cwd: string,
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

  if (path.isAbsolute(includePath)) {
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

  if (path.basename(includePath) !== "registry.json") {
    throw new RegistryValidationError(
      `Invalid include "${includePath}" in ${registryFile}: include paths must explicitly reference a registry.json file. Use a path like "./registry/ui/registry.json".`,
      {
        registryFile,
        context: { includePath },
      }
    )
  }

  const resolvedPath = path.resolve(registryDir, includePath)
  validateRegistryFileWithinRoot(resolvedPath, cwd)

  return resolvedPath
}

function validateRegistryFileWithinRoot(registryFile: string, cwd: string) {
  if (!isPathInside(registryFile, cwd)) {
    throw new RegistryValidationError(
      `Invalid registry file at ${registryFile}: registry includes must stay inside ${cwd}.`,
      {
        registryFile,
        context: { cwd },
      }
    )
  }
}

function resolveLoadRegistryOptions(options?: LoadRegistryOptions) {
  return {
    cwd: path.resolve(options?.cwd ?? process.cwd()),
    registryFile: options?.registryFile ?? "registry.json",
  }
}

function getRegistryRootDir(
  result: Pick<RegistryLoadResult, "usesInclude">,
  cwd: string,
  registryFile: string
) {
  return result.usesInclude
    ? path.dirname(path.resolve(cwd, registryFile))
    : cwd
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

    if (path.isAbsolute(file.path)) {
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

    const resolvedPath = path.resolve(registryDir, file.path)
    if (!isPathInside(resolvedPath, registryDir)) {
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

function hasParentTraversal(filePath: string) {
  return filePath.split(/[\\/]+/).includes("..")
}

function isPathInside(filePath: string, root: string) {
  const relative = path.relative(root, filePath)
  return !!relative && !relative.startsWith("..") && !path.isAbsolute(relative)
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

function formatZodIssues(error: z.ZodError) {
  return error.errors
    .map((issue) => {
      const issuePath = issue.path.length ? issue.path.join(".") : "(root)"
      return `  - ${issuePath}: ${issue.message}`
    })
    .join("\n")
}
