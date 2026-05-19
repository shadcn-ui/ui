import * as fs from "fs/promises"
import * as path from "path"
import { isUrl } from "@/src/registry/utils"
import {
  registryChunkSchema,
  registryItemSchema,
  registrySchema,
  type Registry,
  type RegistryItem,
} from "@/src/schema"
import { z } from "zod"

type RegistryChunk = z.infer<typeof registryChunkSchema>

export type RegistryItemSource = {
  registryFile: string
  registryDir: string
  itemIndex: number
}

export type RegistryLoadResult = {
  registry: Registry
  itemSources: Map<string, RegistryItemSource>
  usesInclude: boolean
}

export type RegistryLoadOptions = {
  cwd: string
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
    throw new Error(`Registry item "${itemName}" was not found.`)
  }

  const rootDir = getRegistryRootDir(result, cwd, registryFile)

  return createRegistryItem(item, result, rootDir, cwd)
}

export async function readRegistryWithIncludes(
  registryFile: string,
  options: RegistryLoadOptions
): Promise<RegistryLoadResult> {
  const rootFile = path.resolve(options.cwd, registryFile)
  const content = await readRegistryJson(rootFile)
  const rootRegistry = parseRegistry(content, rootFile)
  validateRootRegistry(rootRegistry, rootFile)
  const context = {
    cwd: path.resolve(options.cwd),
    itemSources: new Map<string, RegistryItemSource>(),
    itemSourcesByItem: new Map<RegistryItem, RegistryItemSource>(),
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
      usesInclude,
    }
  }

  if (path.basename(rootFile) !== "registry.json") {
    throw new Error(
      `Invalid registry file at ${rootFile}: registries that use include must be named registry.json.`
    )
  }

  const result = await readRegistryFile(rootFile, rootRegistry, context, [])

  validateDuplicateItems(result.items, context.itemSourcesByItem)
  validateRegistryDependencies(result.items, context.itemSources)

  const { include, ...registry } = result
  validateRootRegistry(registry, rootFile)

  return {
    registry,
    itemSources: context.itemSources,
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
      normalizeRegistryItemFilePaths(
        item,
        result.itemSources,
        rootDir,
        fallbackDir
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
    ...normalizeRegistryItemFilePaths(
      item,
      result.itemSources,
      rootDir,
      fallbackDir
    ),
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
  }

  for (let index = 0; index < (registryItem.files ?? []).length; index++) {
    const file = registryItem.files?.[index]
    const sourceFile = item.files?.[index]
    if (!file || !sourceFile) {
      continue
    }

    const sourcePath = getRegistryItemFileSource(
      item,
      sourceFile.path,
      result.itemSources,
      fallbackDir
    )
    ;(file as typeof file & { content?: string }).content = await fs.readFile(
      sourcePath,
      "utf-8"
    )
  }

  return registryItemSchema.parse(registryItem)
}

export function normalizeRegistryItemFilePaths(
  item: RegistryItem,
  itemSources: Map<string, RegistryItemSource>,
  rootDir: string,
  fallbackDir: string
) {
  return {
    ...item,
    files: item.files?.map(({ content, ...file }) => ({
      ...file,
      path: getRegistryItemFileRootPath(
        item,
        file.path,
        itemSources,
        rootDir,
        fallbackDir
      ),
    })),
  }
}

export function getRegistryItemFileSource(
  item: Pick<RegistryItem, "name">,
  filePath: string,
  itemSources: Map<string, RegistryItemSource>,
  fallbackDir: string
) {
  const source = itemSources.get(item.name)
  return path.resolve(source?.registryDir ?? fallbackDir, filePath)
}

export function getRegistryItemFileRootPath(
  item: Pick<RegistryItem, "name">,
  filePath: string,
  itemSources: Map<string, RegistryItemSource>,
  rootDir: string,
  fallbackDir: string
) {
  const sourcePath = getRegistryItemFileSource(
    item,
    filePath,
    itemSources,
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
  },
  chain: string[]
): Promise<RegistryChunk> {
  validateRegistryFileWithinRoot(registryFile, context.cwd)

  if (chain.includes(registryFile)) {
    throw new Error(formatIncludeCycle([...chain, registryFile]))
  }

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
    throw new Error(
      `Failed to read registry file at ${registryFile}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    )
  }
}

function parseRegistry(content: string, registryFile: string) {
  let json: unknown
  try {
    json = JSON.parse(content)
  } catch (error) {
    throw new Error(
      `Invalid JSON in registry file at ${registryFile}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    )
  }

  const result = registryChunkSchema.safeParse(json)
  if (!result.success) {
    throw new Error(
      `Invalid registry file at ${registryFile}:\n${formatZodIssues(
        result.error
      )}`
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
    throw new Error(
      `Invalid root registry file at ${registryFile}: missing required field${missingFields.length > 1 ? "s" : ""} ${missingFields
        .map((field) => `"${field}"`)
        .join(", ")}.`
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
    throw new Error(
      `Invalid include "${includePath}" in ${registryFile}: remote includes are not supported by shadcn build.`
    )
  }

  if (path.isAbsolute(includePath)) {
    throw new Error(
      `Invalid include "${includePath}" in ${registryFile}: include paths must be relative.`
    )
  }

  if (hasParentTraversal(includePath)) {
    throw new Error(
      `Invalid include "${includePath}" in ${registryFile}: include paths cannot use parent-directory traversal.`
    )
  }

  if (path.basename(includePath) !== "registry.json") {
    throw new Error(
      `Invalid include "${includePath}" in ${registryFile}: include paths must explicitly reference a registry.json file.`
    )
  }

  const resolvedPath = path.resolve(registryDir, includePath)
  validateRegistryFileWithinRoot(resolvedPath, cwd)

  return resolvedPath
}

function validateRegistryFileWithinRoot(registryFile: string, cwd: string) {
  if (!isPathInside(registryFile, cwd)) {
    throw new Error(
      `Invalid registry file at ${registryFile}: registry includes must stay inside ${cwd}.`
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
      throw new Error(
        `Invalid file path "${file.path}" for item "${item.name}" in ${registryFile}: remote file paths are not supported by shadcn build.`
      )
    }

    if (path.isAbsolute(file.path)) {
      throw new Error(
        `Invalid file path "${file.path}" for item "${item.name}" in ${registryFile}: file paths must be relative.`
      )
    }

    if (hasParentTraversal(file.path)) {
      throw new Error(
        `Invalid file path "${file.path}" for item "${item.name}" in ${registryFile}: file paths cannot use parent-directory traversal.`
      )
    }

    const resolvedPath = path.resolve(registryDir, file.path)
    if (!isPathInside(resolvedPath, registryDir)) {
      throw new Error(
        `Invalid file path "${file.path}" for item "${item.name}" in ${registryFile}: file paths must stay inside the registry chunk directory.`
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
    throw new Error(
      `Duplicate registry item name "${item.name}". Registry item names must be unique.\n` +
        `  - ${formatItemSource(firstSource)}\n` +
        `  - ${formatItemSource(secondSource)}`
    )
  }
}

function validateRegistryDependencies(
  items: RegistryItem[],
  itemSources: Map<string, RegistryItemSource>
) {
  const itemNames = new Set(items.map((item) => item.name))

  for (const item of items) {
    for (const dependency of item.registryDependencies ?? []) {
      if (
        dependency.startsWith("@") ||
        isUrl(dependency) ||
        itemNames.has(dependency)
      ) {
        continue
      }

      const source = itemSources.get(item.name)
      console.warn(
        `Warning: Registry item "${item.name}" depends on "${dependency}", but it was not found in the resolved registry catalog (${formatItemSource(
          source
        )}). It will be resolved externally during install.`
      )
    }
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
