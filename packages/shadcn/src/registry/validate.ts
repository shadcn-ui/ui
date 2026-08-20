import * as fs from "fs/promises"
import * as path from "path"
import { isUrl } from "@/src/registry/utils"
import {
  registryItemSchema,
  registryItemTypeSchema,
  type RegistryItem,
} from "@/src/schema"
import { z } from "zod"

type RegistryChunk = {
  $schema?: string
  name?: string
  homepage?: string
  hasName?: boolean
  hasHomepage?: boolean
  include?: string[]
  items: RegistryItem[]
}

type RegistryItemSource = {
  registryFile: string
  registryDir: string
  itemIndex: number
}

type RegistryValidationDiagnostic = {
  registryFile: string
  message: string
  suggestion?: string
  itemName?: string
  itemIndex?: number
  includePath?: string
  filePath?: string
}

type RegistryValidationContext = {
  cwd: string
  rootFile: string
  usesInclude: boolean
  diagnostics: RegistryValidationDiagnostic[]
  registryFiles: Set<string>
  checkedRegistryFiles: Set<string>
  itemsChecked: number
  itemSourcesByItem: Map<RegistryItem, RegistryItemSource>
  firstIncludedFrom: Map<string, string>
}

const MAX_INCLUDE_DEPTH = 32
const PUBLIC_REGISTRY_ITEM_TYPES = registryItemTypeSchema.options.filter(
  (type) => type !== "registry:example" && type !== "registry:internal"
)
const registryObjectSchema = z.record(z.string(), z.unknown())
const registryIncludeSchema = z.array(z.string())
const registryItemsSchema = z.array(z.unknown())

export async function validateRegistry(options: {
  cwd: string
  registryFile: string
}) {
  const cwd = path.resolve(options.cwd)
  const rootFile = path.resolve(cwd, options.registryFile)
  const context: RegistryValidationContext = {
    cwd,
    rootFile,
    usesInclude: false,
    diagnostics: [],
    registryFiles: new Set(),
    checkedRegistryFiles: new Set(),
    itemsChecked: 0,
    itemSourcesByItem: new Map(),
    firstIncludedFrom: new Map(),
  }

  if (path.basename(rootFile) !== "registry.json") {
    addDiagnostic(context, {
      registryFile: rootFile,
      message: "Root source registry file must be named registry.json.",
      suggestion:
        "Rename the file to registry.json and pass that file to shadcn registry validate.",
    })
  }

  if (!isPathInside(rootFile, cwd)) {
    addDiagnostic(context, {
      registryFile: rootFile,
      message: `Root registry file must stay inside ${formatPath(cwd, cwd)}.`,
      suggestion:
        "Run the command from the registry root or pass a registry.json file inside --cwd.",
    })
    return createValidationResult(context, [])
  }

  const rootRegistry = await readRegistryFile(rootFile, context)
  if (!rootRegistry) {
    return createValidationResult(context, [])
  }

  context.usesInclude = !!rootRegistry.include?.length
  validateRootRegistry(rootRegistry, rootFile, context)

  const items = await collectRegistryItems(rootFile, rootRegistry, context, [])

  validateDuplicateItems(items, context)
  await validateRegistryItems(items, context)

  return createValidationResult(context, items)
}

async function collectRegistryItems(
  registryFile: string,
  registry: RegistryChunk,
  context: RegistryValidationContext,
  chain: string[]
): Promise<RegistryItem[]> {
  if (chain.length >= MAX_INCLUDE_DEPTH) {
    addDiagnostic(context, {
      registryFile,
      message: `Registry include tree is too deep. The maximum include depth is ${MAX_INCLUDE_DEPTH}.`,
      suggestion:
        "Flatten part of the registry include tree or reduce nested include depth.",
    })
    return []
  }

  if (chain.includes(registryFile)) {
    addDiagnostic(context, {
      registryFile,
      message: `Registry include cycle detected: ${formatIncludeCycle([
        ...chain,
        registryFile,
      ])}.`,
      suggestion: "Remove one include so the registry graph is acyclic.",
    })
    return []
  }

  const includedFrom = chain.at(-1) ?? registryFile
  const existingSource = context.firstIncludedFrom.get(registryFile)
  if (existingSource) {
    addDiagnostic(context, {
      registryFile,
      message: `Registry file included more than once. First included from ${formatPath(
        existingSource,
        context.cwd
      )}, then included from ${formatPath(includedFrom, context.cwd)}.`,
      suggestion:
        "Remove one include or move shared items into a single included registry.json.",
    })
    return []
  }

  context.registryFiles.add(registryFile)
  context.firstIncludedFrom.set(registryFile, includedFrom)

  const registryDir = path.dirname(registryFile)
  const nextChain = [...chain, registryFile]
  const includedItems: RegistryItem[] = []

  for (const includePath of registry.include ?? []) {
    const includedRegistryFile = resolveIncludePath(
      includePath,
      registryFile,
      registryDir,
      context
    )
    if (!includedRegistryFile) {
      continue
    }

    const includedRegistry = await readRegistryFile(
      includedRegistryFile,
      context
    )
    if (!includedRegistry) {
      continue
    }

    const items = await collectRegistryItems(
      includedRegistryFile,
      includedRegistry,
      context,
      nextChain
    )
    includedItems.push(...items)
  }

  const itemRegistryDir =
    // Preserve legacy single-file registry behavior: item files resolve from cwd.
    !context.usesInclude && registryFile === context.rootFile
      ? context.cwd
      : registryDir

  registry.items.forEach((item, itemIndex) => {
    context.itemSourcesByItem.set(item, {
      registryFile,
      registryDir: itemRegistryDir,
      itemIndex,
    })
  })

  return [...includedItems, ...registry.items]
}

async function readRegistryFile(
  registryFile: string,
  context: RegistryValidationContext
) {
  context.checkedRegistryFiles.add(registryFile)

  let content: string
  try {
    content = await fs.readFile(registryFile, "utf-8")
  } catch {
    addDiagnostic(context, {
      registryFile,
      message: "Registry file was not found or could not be read.",
      suggestion: "Check that the registry.json file exists and is readable.",
    })
    return null
  }

  let json: unknown
  try {
    json = JSON.parse(content)
  } catch {
    addDiagnostic(context, {
      registryFile,
      message: "Registry file contains invalid JSON.",
      suggestion: "Fix the JSON syntax in the registry.json file.",
    })
    return null
  }

  return parseRegistryJson(json, registryFile, context)
}

function validateRootRegistry(
  registry: RegistryChunk,
  registryFile: string,
  context: RegistryValidationContext
) {
  if (!registry.name && !registry.hasName) {
    addDiagnostic(context, {
      registryFile,
      message: 'Root registry.json must define "name".',
      suggestion: 'Add a top-level "name" field to the root registry.json.',
    })
  }

  if (!registry.homepage && !registry.hasHomepage) {
    addDiagnostic(context, {
      registryFile,
      message: 'Root registry.json must define "homepage".',
      suggestion: 'Add a top-level "homepage" field to the root registry.json.',
    })
  }
}

function resolveIncludePath(
  includePath: string,
  registryFile: string,
  registryDir: string,
  context: RegistryValidationContext
) {
  if (isUrl(includePath)) {
    addDiagnostic(context, {
      registryFile,
      includePath,
      message: `Remote include "${includePath}" is not supported.`,
      suggestion:
        "Use a relative path to an explicit registry.json file in the same repository.",
    })
    return null
  }

  if (path.isAbsolute(includePath)) {
    addDiagnostic(context, {
      registryFile,
      includePath,
      message: `Include "${includePath}" must be relative.`,
      suggestion: 'Use a path like "components/ui/registry.json".',
    })
    return null
  }

  if (hasParentTraversal(includePath)) {
    addDiagnostic(context, {
      registryFile,
      includePath,
      message: `Include "${includePath}" cannot use parent-directory traversal.`,
      suggestion:
        "Registry includes must descend from the including chunk. Move shared registries into the registry root and include them from there.",
    })
    return null
  }

  if (path.basename(includePath) !== "registry.json") {
    addDiagnostic(context, {
      registryFile,
      includePath,
      message: `Include "${includePath}" must explicitly reference a registry.json file.`,
      suggestion: 'Use a path like "components/ui/registry.json".',
    })
    return null
  }

  const resolvedPath = path.resolve(registryDir, includePath)
  if (!isPathInside(resolvedPath, context.cwd)) {
    addDiagnostic(context, {
      registryFile,
      includePath,
      message: `Include "${includePath}" must stay inside ${formatPath(
        context.cwd,
        context.cwd
      )}.`,
      suggestion: "Keep included registry.json files inside the registry root.",
    })
    return null
  }

  return resolvedPath
}

function validateDuplicateItems(
  items: RegistryItem[],
  context: RegistryValidationContext
) {
  const seen = new Map<string, RegistryItem>()

  for (const item of items) {
    const existing = seen.get(item.name)
    if (!existing) {
      seen.set(item.name, item)
      continue
    }

    const firstSource = context.itemSourcesByItem.get(existing)
    const secondSource = context.itemSourcesByItem.get(item)
    addDiagnostic(context, {
      registryFile: secondSource?.registryFile ?? context.rootFile,
      itemName: item.name,
      itemIndex: secondSource?.itemIndex,
      message: `Duplicate registry item name "${item.name}". First defined at ${formatItemSource(
        firstSource,
        context.cwd
      )}.`,
      suggestion:
        "Rename one of these items so each name is unique across the resolved registry.",
    })
  }
}

async function validateRegistryItems(
  items: RegistryItem[],
  context: RegistryValidationContext
) {
  const registryRootDir = getRegistryRootDir(context)

  for (const item of items) {
    const source = context.itemSourcesByItem.get(item)
    const registryItem = {
      ...rewriteRegistryItemFilePaths(item, context, registryRootDir),
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
    }

    for (let index = 0; index < (item.files?.length ?? 0); index++) {
      const file = item.files?.[index]
      if (!file || !source) {
        continue
      }

      const sourcePath = validateRegistryItemFilePath(
        item,
        file.path,
        source,
        context
      )
      if (!sourcePath) {
        continue
      }

      try {
        await fs.readFile(sourcePath, "utf-8")
      } catch {
        addDiagnostic(context, {
          registryFile: source.registryFile,
          itemName: item.name,
          itemIndex: source.itemIndex,
          filePath: file.path,
          message: `File "${file.path}" was not found or could not be read.`,
          suggestion:
            "Make sure the file path is relative to the registry.json file that declares the item.",
        })
      }
    }

    const result = registryItemSchema.safeParse(registryItem)
    if (!result.success) {
      addZodDiagnostics(
        result.error,
        source?.registryFile ?? context.rootFile,
        context,
        {
          itemName: item.name,
          itemIndex: source?.itemIndex,
          suggestion:
            "Update the registry item so the built item matches the registry item schema.",
        }
      )
    }
  }
}

function validateRegistryItemFilePath(
  item: RegistryItem,
  filePath: string,
  source: RegistryItemSource,
  context: RegistryValidationContext
) {
  if (isUrl(filePath)) {
    addDiagnostic(context, {
      registryFile: source.registryFile,
      itemName: item.name,
      itemIndex: source.itemIndex,
      filePath,
      message: `File path "${filePath}" cannot be remote.`,
      suggestion:
        "Use a local file path relative to the registry.json file that declares the item.",
    })
    return null
  }

  if (path.isAbsolute(filePath)) {
    addDiagnostic(context, {
      registryFile: source.registryFile,
      itemName: item.name,
      itemIndex: source.itemIndex,
      filePath,
      message: `File path "${filePath}" must be relative.`,
      suggestion:
        "Use a local file path relative to the registry.json file that declares the item.",
    })
    return null
  }

  if (hasParentTraversal(filePath)) {
    addDiagnostic(context, {
      registryFile: source.registryFile,
      itemName: item.name,
      itemIndex: source.itemIndex,
      filePath,
      message: `File path "${filePath}" cannot use parent-directory traversal.`,
      suggestion: "Keep item files inside the registry chunk directory.",
    })
    return null
  }

  const sourcePath = path.resolve(source.registryDir, filePath)
  if (!isPathInside(sourcePath, source.registryDir)) {
    addDiagnostic(context, {
      registryFile: source.registryFile,
      itemName: item.name,
      itemIndex: source.itemIndex,
      filePath,
      message: `File path "${filePath}" must stay inside the registry chunk directory.`,
      suggestion:
        "Move the file into the same registry chunk directory or update the registry item path.",
    })
    return null
  }

  return sourcePath
}

function rewriteRegistryItemFilePaths(
  item: RegistryItem,
  context: RegistryValidationContext,
  rootDir: string
) {
  const source = context.itemSourcesByItem.get(item)

  return {
    ...item,
    files: item.files?.map((file) => {
      const sourcePath = path.resolve(
        source?.registryDir ?? context.cwd,
        file.path
      )

      return {
        ...file,
        path: path.relative(rootDir, sourcePath).split(path.sep).join("/"),
      }
    }),
  }
}

function parseRegistryJson(
  json: unknown,
  registryFile: string,
  context: RegistryValidationContext
) {
  const registryResult = registryObjectSchema.safeParse(json)
  if (!registryResult.success) {
    addZodDiagnostics(registryResult.error, registryFile, context, {
      suggestion: "Update the registry.json file so it matches the schema.",
    })
    return null
  }

  const registry = registryResult.data
  const chunk: RegistryChunk = {
    $schema: getOptionalString(registry, "$schema", registryFile, context),
    name: getOptionalString(registry, "name", registryFile, context),
    homepage: getOptionalString(registry, "homepage", registryFile, context),
    hasName: registry.name !== undefined,
    hasHomepage: registry.homepage !== undefined,
    items: [],
  }

  if (registry.include !== undefined) {
    const result = registryIncludeSchema.safeParse(registry.include)
    if (!result.success) {
      addZodDiagnostics(result.error, registryFile, context, {
        pathPrefix: ["include"],
        suggestion: "Update include so it is an array of registry.json paths.",
      })
    } else {
      chunk.include = result.data
    }
  }

  if (registry.items !== undefined) {
    const result = registryItemsSchema.safeParse(registry.items)
    if (!result.success) {
      addZodDiagnostics(result.error, registryFile, context, {
        pathPrefix: ["items"],
        suggestion: "Update items so it is an array of registry items.",
      })
    } else {
      context.itemsChecked += result.data.length
      chunk.items = parseRegistryItems(result.data, registryFile, context)
    }
  }

  if (registry.items === undefined && registry.include === undefined) {
    addDiagnostic(context, {
      registryFile,
      message: "Registry must define at least one of `items` or `include`.",
      suggestion:
        'Add an "items" array, an "include" array, or both to registry.json.',
    })
  }

  return chunk
}

function parseRegistryItems(
  items: unknown[],
  registryFile: string,
  context: RegistryValidationContext
) {
  const registryItems: RegistryItem[] = []

  items.forEach((item, itemIndex) => {
    const result = registryItemSchema.safeParse(item)
    if (!result.success) {
      addZodDiagnostics(result.error, registryFile, context, {
        itemName: getRawItemName(item),
        itemIndex,
        suggestion:
          "Update the registry item so it matches the registry item schema.",
      })
      return
    }

    registryItems.push(result.data)
  })

  return registryItems
}

function getOptionalString(
  registry: Record<string, unknown>,
  key: string,
  registryFile: string,
  context: RegistryValidationContext
) {
  const value = registry[key]
  if (value === undefined) {
    return undefined
  }

  if (typeof value === "string") {
    return value
  }

  addDiagnostic(context, {
    registryFile,
    message: `${key}: Expected string, received ${typeof value}.`,
    suggestion: `Update "${key}" so it is a string.`,
  })
}

function getRawItemName(item: unknown) {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    return undefined
  }

  const name = (item as Record<string, unknown>).name
  return typeof name === "string" ? name : undefined
}

function addZodDiagnostics(
  error: z.ZodError,
  registryFile: string,
  context: RegistryValidationContext,
  options: {
    itemName?: string
    itemIndex?: number
    pathPrefix?: (string | number)[]
    suggestion?: string
  }
) {
  for (const issue of error.errors) {
    addDiagnostic(context, {
      registryFile,
      itemName: options.itemName,
      itemIndex: options.itemIndex,
      message: formatZodIssue(issue, options.pathPrefix),
      suggestion: options.suggestion,
    })
  }
}

function addDiagnostic(
  context: RegistryValidationContext,
  diagnostic: RegistryValidationDiagnostic
) {
  context.diagnostics.push(diagnostic)
}

function createValidationResult(
  context: RegistryValidationContext,
  items: RegistryItem[]
) {
  return {
    valid: context.diagnostics.length === 0,
    cwd: context.cwd,
    registryFiles: context.checkedRegistryFiles.size,
    registryFilePaths: Array.from(context.checkedRegistryFiles),
    items: context.itemsChecked,
    diagnostics: context.diagnostics,
  }
}

function getRegistryRootDir(context: RegistryValidationContext) {
  return context.usesInclude ? path.dirname(context.rootFile) : context.cwd
}

function hasParentTraversal(filePath: string) {
  return filePath.split(/[\\/]+/).includes("..")
}

function isPathInside(filePath: string, root: string) {
  const relative = path.relative(root, filePath)
  return !!relative && !relative.startsWith("..") && !path.isAbsolute(relative)
}

function formatIncludeCycle(chain: string[]) {
  return chain
    .map((file) => formatPath(file, path.dirname(chain[0])))
    .join(" -> ")
}

function formatItemSource(source: RegistryItemSource | undefined, cwd: string) {
  if (!source) {
    return "unknown source"
  }

  return `${formatPath(source.registryFile, cwd)} items[${source.itemIndex}]`
}

function formatZodPath(issuePath: (string | number)[]) {
  return issuePath.length ? issuePath.join(".") : "(root)"
}

function formatZodIssue(
  issue: z.ZodIssue,
  pathPrefix: (string | number)[] = []
) {
  const path = [...pathPrefix, ...issue.path]

  if (
    issue.code === z.ZodIssueCode.invalid_union_discriminator &&
    issue.path.at(-1) === "type"
  ) {
    return `${formatZodPath(path)}: Invalid registry item type. Expected ${PUBLIC_REGISTRY_ITEM_TYPES.map(
      (type) => `"${type}"`
    ).join(" | ")}.`
  }

  return `${formatZodPath(path)}: ${issue.message}`
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
