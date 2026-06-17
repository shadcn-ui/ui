import { spawn } from "child_process"
import { createHash } from "crypto"
import { promises as fs } from "fs"
import { availableParallelism } from "os"
import path from "path"
import prettier from "prettier"
import { rimraf } from "rimraf"
import { registrySchema, type RegistryItem } from "shadcn/schema"
import {
  createStyleMap,
  transformDirection,
  transformIcons,
  transformStyle,
} from "shadcn/utils"
import { Project, ScriptKind } from "ts-morph"

import { getAllBlocks } from "@/lib/blocks"
import { legacyStyles } from "@/registry/_legacy-styles"
import { BASE_COLORS } from "@/registry/base-colors"
import { BASES, type Base } from "@/registry/bases"
import { PRESETS } from "@/registry/config"
import { STYLES } from "@/registry/styles"

// [FORCE-UI] Framework ports live in packages/registry-{name}, not registry/bases/{name}
const FRAMEWORK_PORT_BASES = new Set(["vue", "svelte", "ember"])
function getBaseSrcDir(baseName: string): string {
  if (FRAMEWORK_PORT_BASES.has(baseName)) {
    return path.resolve(process.cwd(), `../../packages/registry-${baseName}`)
  }
  return path.resolve(process.cwd(), `registry/bases/${baseName}`)
}

/*
 * build-registry.mts is the single v4 registry pipeline.
 *
 * Source of truth:
 * - Authored raw component/registry source lives in registry/bases/base and
 *   registry/bases/radix.
 * - Authored demo source lives in examples/base and examples/radix.
 * - Style tokens live in registry/styles/style-*.css.
 *
 * Persistent outputs:
 * - registry/bases/__index__.tsx
 * - registry/__index__.tsx
 * - examples/__index__.tsx
 * - styles/<base-style>/ui/*
 * - styles/<base-style>/ui-rtl/* for base-nova and radix-nova only
 * - public/r/*
 *
 * Temporary outputs:
 * - registry/<base-style>/*
 * - registry-<style>.json
 *
 * Execution order:
 * 1. Build registry/bases/__index__.tsx from the authored base registries.
 * 2. Build temporary styled registries under registry/<base-style>.
 * 3. Build registry/__index__.tsx for runtime lookup across legacy styles and
 *    generated base-style combinations.
 * 4. Build examples/__index__.tsx from authored demos.
 * 5. Export public/r/* for every style through the shadcn CLI.
 * 6. Copy compiled ui/* from the temporary registries into styles/<style>/ui.
 * 7. Build styles/<style>/ui-rtl for base-force-ui and radix-force-ui.
 * 8. Format the generated persistent outputs.
 * 9. Clean up the temporary registry/<base-style> trees and registry-*.json.
 */

const STYLE_COMBINATIONS = Array.from(BASES).flatMap((base) =>
  STYLES.map((style) => ({
    base,
    style,
    name: `${base.name}-${style.name}`,
    title: `${base.title} ${style.title}`,
  }))
)

const CPU_COUNT = availableParallelism()
const STYLE_BUILD_CONCURRENCY = Math.max(1, Math.min(CPU_COUNT, 4))
const FILE_BUILD_CONCURRENCY = Math.max(4, Math.min(CPU_COUNT, 8))
const COPY_CONCURRENCY = Math.max(4, Math.min(CPU_COUNT, 8))
const CLI_BUILD_CONCURRENCY = Math.max(
  1,
  Math.min(Math.floor(CPU_COUNT / 2), 4)
)
const TRANSFORM_CACHE_VERSION = "2"
const CACHE_ROOT = path.join(
  process.cwd(),
  "node_modules/.cache/build-registry"
)
const TRANSFORM_CACHE_ROOT = path.join(CACHE_ROOT, "transforms")
const TRANSFORM_CACHE_MANIFEST_PATH = path.join(
  CACHE_ROOT,
  "transform-manifest.json"
)

const transformCacheManifest = new Map<string, string>()
let transformCacheDirty = false
let prettierConfigPromise: Promise<prettier.Options | null> | null = null

const iconProject = new Project({
  compilerOptions: {},
})

function getStylesToBuild() {
  const stylesToBuild = new Map<string, { name: string; title: string }>()

  for (const style of legacyStyles) {
    stylesToBuild.set(style.name, style)
  }

  for (const style of STYLE_COMBINATIONS) {
    stylesToBuild.set(style.name, {
      name: style.name,
      title: style.title,
    })
  }

  return Array.from(stylesToBuild.values())
}

function getStyleCombination(styleName: string) {
  return STYLE_COMBINATIONS.find((style) => style.name === styleName) ?? null
}

function stripFileExtension(filePath: string) {
  return filePath.replace(/\.(tsx|ts|json|mdx|vue|svelte|gts)$/, "")
}

function normalizeRegistryFiles(item: RegistryItem): Array<{
  path: string
  type: string
  target?: string
}> {
  return (
    item.files?.map((file) => ({
      path: typeof file === "string" ? file : file.path,
      type: typeof file === "string" ? item.type : file.type,
      target: typeof file === "string" ? undefined : file.target,
    })) ?? []
  )
}

function shouldGenerateRtlStyles(styleName: string) {
  return styleName === "base-force-ui" || styleName === "radix-force-ui" // [FORCE-UI]
}

function getTemporaryRegistryRoot(styleName: string) {
  return path.join(process.cwd(), `registry/${styleName}`)
}

function getPersistentStyleRoot(styleName: string) {
  return path.join(process.cwd(), "styles", styleName)
}

function hashContent(...parts: string[]) {
  const hash = createHash("sha256")

  for (const part of parts) {
    hash.update(part)
    hash.update("\0")
  }

  return hash.digest("hex")
}

async function readFileIfExists(filePath: string) {
  try {
    return await fs.readFile(filePath, "utf8")
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null
    }

    throw error
  }
}

async function writeIfChanged(filePath: string, content: string) {
  const existingContent = await readFileIfExists(filePath)
  if (existingContent === content) {
    return false
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content)

  return true
}

async function formatGeneratedSource(content: string, filePath: string) {
  // Skip formatting for .gts files — no prettier parser available
  if (filePath.endsWith(".gts")) {
    return content
  }

  prettierConfigPromise ??= prettier.resolveConfig(
    path.join(process.cwd(), "package.json")
  )

  const prettierConfig = (await prettierConfigPromise) ?? {}

  return prettier.format(content, {
    ...prettierConfig,
    filepath: filePath,
    plugins: [
      "@ianvs/prettier-plugin-sort-imports",
      "prettier-plugin-tailwindcss",
      "prettier-plugin-svelte",
    ],
  })
}

async function formatGeneratedJson(value: unknown, filePath: string) {
  return formatGeneratedSource(JSON.stringify(value, null, 2), filePath)
}

async function loadTransformCache() {
  const existingManifest = await readFileIfExists(TRANSFORM_CACHE_MANIFEST_PATH)
  if (!existingManifest) {
    return
  }

  const payload = JSON.parse(existingManifest) as Record<string, string>

  for (const [key, value] of Object.entries(payload)) {
    transformCacheManifest.set(key, value)
  }
}

async function saveTransformCache() {
  if (!transformCacheDirty) {
    return
  }

  await fs.mkdir(CACHE_ROOT, { recursive: true })

  const payload = Object.fromEntries(
    Array.from(transformCacheManifest.entries()).sort(([a], [b]) =>
      a.localeCompare(b)
    )
  )

  await fs.writeFile(
    TRANSFORM_CACHE_MANIFEST_PATH,
    JSON.stringify(payload, null, 2)
  )

  transformCacheDirty = false
}

async function getCachedStyledContent({
  styleName,
  baseName,
  filePath,
  source,
  styleHash,
  styleMap,
}: {
  styleName: string
  baseName: string
  filePath: string
  source: string
  styleHash: string
  styleMap: Record<string, string>
}) {
  const cacheKey = `${styleName}:${filePath}`
  const cachePath = path.join(TRANSFORM_CACHE_ROOT, styleName, filePath)
  const inputHash = hashContent(
    TRANSFORM_CACHE_VERSION,
    styleName,
    baseName,
    filePath,
    styleHash,
    source
  )

  if (transformCacheManifest.get(cacheKey) === inputHash) {
    const cachedContent = await readFileIfExists(cachePath)
    if (cachedContent !== null) {
      return cachedContent
    }
  }

  let transformedContent = await transformStyle(source, { styleMap })
  transformedContent = transformedContent.replace(
    new RegExp(`@/registry/bases/${baseName}/`, "g"),
    `@/registry/${styleName}/`
  )
  transformedContent = await formatGeneratedSource(
    transformedContent,
    path.join(getTemporaryRegistryRoot(styleName), filePath)
  )

  await fs.mkdir(path.dirname(cachePath), { recursive: true })
  await fs.writeFile(cachePath, transformedContent)

  if (transformCacheManifest.get(cacheKey) !== inputHash) {
    transformCacheManifest.set(cacheKey, inputHash)
    transformCacheDirty = true
  }

  return transformedContent
}

async function runWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>
) {
  const results = new Array<R>(items.length)
  let currentIndex = 0

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (true) {
        const index = currentIndex++
        if (index >= items.length) {
          return
        }

        results[index] = await worker(items[index], index)
      }
    })
  )

  return results
}

try {
  const totalStart = performance.now()

  await loadTransformCache()

  console.log("🏗️ Building bases...")
  await buildBasesIndex(Array.from(BASES))
  await buildBases(Array.from(BASES))

  const stylesToBuild = getStylesToBuild()

  console.log("\n📦 Building registry/__index__.tsx...")
  await buildRegistryIndex(stylesToBuild)

  console.log("\n📋 Building examples/__index__.tsx...")
  await buildExamplesIndex()

  console.log("\n💅 Building styles...")
  await runWithConcurrency(
    stylesToBuild,
    CLI_BUILD_CONCURRENCY,
    async (style) => {
      await buildRegistryJsonFile(style.name)
      await buildRegistry(style.name)
      console.log(`   ✅ ${style.name}`)
    }
  )

  console.log("\n🗂️ Building registry/__blocks__.json...")
  await buildBlocksIndex()

  console.log("\n⚙️ Building public/r/config.json...")
  await buildConfig()

  console.log("\n📦 Building public/r/index.json...")
  await buildIndex()

  console.log("\n📋 Building public/r/registries.json...")
  await buildRegistriesJson()

  console.log("\n🎨 Building public/r/colors...")
  await buildColors()

  console.log("\n📋 Copying compiled ui to styles...")
  await copyUIToStyles()

  console.log("\n🔄 Building RTL styles...")
  await buildRtlStyles()

  console.log("\n🧹 Cleaning up...")
  await cleanUp(stylesToBuild)
  await saveTransformCache()

  const elapsed = ((performance.now() - totalStart) / 1000).toFixed(2)
  console.log(`\n✅ Build complete in ${elapsed}s!`)
} catch (error) {
  await saveTransformCache().catch(console.error)
  console.error(error)
  process.exit(1)
}

async function buildBasesIndex(bases: Base[]) {
  const registryImports = await Promise.all(
    bases.map(async (base) => {
      const { registry: importedRegistry } = await import(
        path.join(getBaseSrcDir(base.name), "registry.ts")
      )
      return { base, importedRegistry }
    })
  )

  let index = `// @ts-nocheck
// This file is autogenerated by scripts/build-registry.ts
// Do not edit this file directly.
import "server-only"
import * as React from "react"

export const Index: Record<string, Record<string, any>> = {`

  for (const { base, importedRegistry } of registryImports) {
    const parseResult = registrySchema.safeParse(importedRegistry)
    if (!parseResult.success) {
      console.error(`❌ Registry validation failed for ${base.name}:`)
      console.error(parseResult.error.format())
      throw new Error(`Invalid registry schema for ${base.name}`)
    }

    const registry = parseResult.data

    index += `
  "${base.name}": {`

    for (const item of registry.items) {
      if (item.type === "registry:internal") {
        continue
      }

      const files = normalizeRegistryFiles(item)

      if (files.length === 0) {
        continue
      }

      const componentPath = files[0]?.path
        ? `@/registry/bases/${base.name}/${stripFileExtension(files[0].path)}`
        : ""
      const firstFileExt = files[0]?.path ? path.extname(files[0].path) : ""
      const isNonReactBase = base.name === "vue" || base.name === "svelte" || base.name === "ember"
      const isReactComponent = !isNonReactBase && (firstFileExt === ".tsx" || firstFileExt === ".ts")

      index += `
    "${item.name}": {
      name: "${item.name}",
      title: "${item.title}",
      description: "${item.description ?? ""}",
      type: "${item.type}",
      registryDependencies: ${JSON.stringify(item.registryDependencies)},
      files: [${files.map((file) => {
        const filePath = `registry/bases/${base.name}/${file.path}`
        return `{
        path: "${filePath}",
        type: "${file.type}",
        target: "${file.target ?? ""}"
      }`
      })}],
      component: ${
        componentPath && isReactComponent
          ? `React.lazy(async () => {
        const mod = await import("${componentPath}")
        const exportName = Object.keys(mod).find(key => typeof mod[key] === 'function' || typeof mod[key] === 'object') || "${item.name}"
        return { default: mod.default || mod[exportName] }
      })`
          : "null"
      },
      categories: ${JSON.stringify(item.categories)},
      meta: ${JSON.stringify(item.meta)},
    },`
    }

    index += `
  },`
  }

  index += `
}`

  const outputPath = path.join(process.cwd(), "registry/bases/__index__.tsx")
  await writeIfChanged(
    outputPath,
    await formatGeneratedSource(index, outputPath)
  )
}

async function buildBases(bases: Base[]) {
  const [baseImports, styleMaps] = await Promise.all([
    Promise.all(
      bases.map(async (base) => {
        const { registry: baseRegistry } = await import(
          path.join(getBaseSrcDir(base.name), "registry.ts")
        )
        const result = registrySchema.safeParse(baseRegistry)
        if (!result.success) {
          console.error(`❌ Registry validation failed for ${base.name}:`)
          console.error(result.error.format())
          throw new Error(`Invalid registry schema for ${base.name}`)
        }

        const registryItems = result.data.items.filter(
          (item) => item.type !== "registry:internal"
        )

        const sourceFilePaths = Array.from(
          new Set(
            registryItems.flatMap((item) =>
              normalizeRegistryFiles(item).map((file) => file.path)
            )
          )
        )

        const sourceFiles = new Map(
          await Promise.all(
            sourceFilePaths.map(
              async (filePath): Promise<readonly [string, string]> =>
                [
                  filePath,
                  await fs.readFile(
                    path.join(getBaseSrcDir(base.name), filePath),
                    "utf8"
                  ),
                ] as const
            )
          )
        )

        return { base, baseRegistry, registryItems, sourceFiles }
      })
    ),
    Promise.all(
      STYLES.map(async (style) => {
        const styleContent = await fs.readFile(
          path.join(process.cwd(), `registry/styles/style-${style.name}.css`),
          "utf8"
        )
        return {
          style,
          styleHash: hashContent(styleContent),
          styleMap: createStyleMap(styleContent),
        }
      })
    ),
  ])

  const combinations: Array<{
    base: Base
    style: (typeof STYLES)[number]
    baseRegistry: (typeof baseImports)[number]["baseRegistry"]
    registryItems: (typeof baseImports)[number]["registryItems"]
    sourceFiles: (typeof baseImports)[number]["sourceFiles"]
    styleHash: string
    styleMap: Record<string, string>
  }> = []

  for (const {
    base,
    baseRegistry,
    registryItems,
    sourceFiles,
  } of baseImports) {
    for (const { style, styleHash, styleMap } of styleMaps) {
      combinations.push({
        base,
        style,
        baseRegistry,
        registryItems,
        sourceFiles,
        styleHash,
        styleMap,
      })
    }
  }

  await runWithConcurrency(
    combinations,
    STYLE_BUILD_CONCURRENCY,
    async ({
      base,
      style,
      baseRegistry,
      registryItems,
      sourceFiles,
      styleHash,
      styleMap,
    }) => {
      const styleName = `${base.name}-${style.name}`
      const styleOutputDir = getTemporaryRegistryRoot(styleName)

      console.log(`   ✅ ${styleName}...`)

      await rimraf(styleOutputDir)
      await fs.mkdir(styleOutputDir, { recursive: true })

      const styleRegistry = { ...baseRegistry, items: registryItems }
      const registryTs = `export const registry = ${JSON.stringify(styleRegistry, null, 2)}\n`
      await fs.writeFile(path.join(styleOutputDir, "registry.ts"), registryTs)

      const filesToBuild = registryItems.flatMap((registryItem) =>
        normalizeRegistryFiles(registryItem)
      )

      await runWithConcurrency(
        filesToBuild,
        FILE_BUILD_CONCURRENCY,
        async (file) => {
          const source = sourceFiles.get(file.path)
          if (typeof source !== "string") {
            throw new Error(
              `Missing cached source for ${base.name}/${file.path}`
            )
          }

          const fileExtension = path.extname(file.path)
          const shouldTransform =
            fileExtension === ".tsx" ||
            fileExtension === ".ts" ||
            fileExtension === ".vue" ||
            fileExtension === ".svelte" ||
            fileExtension === ".gts"

          const transformedContent = shouldTransform
            ? await getCachedStyledContent({
                styleName,
                baseName: base.name,
                filePath: file.path,
                source,
                styleHash,
                styleMap,
              })
            : source

          const outputPath = path.join(styleOutputDir, file.path)
          await fs.mkdir(path.dirname(outputPath), { recursive: true })
          await fs.writeFile(outputPath, transformedContent)
        }
      )
    }
  )
}

async function buildExamplesIndex() {
  const examplesDir = path.join(process.cwd(), "examples")

  const baseResults = await Promise.all(
    Array.from(BASES).map(async (base) => {
      const baseDir = path.join(examplesDir, base.name)

      try {
        await fs.access(baseDir)
      } catch {
        console.log(`   Skipping ${base.name} - directory does not exist`)
        return null
      }

      const allEntries = await fs.readdir(baseDir, { withFileTypes: true })
      const DEMO_EXTENSIONS = [".tsx", ".vue", ".svelte", ".gts"]
      const files = allEntries
        .filter(
          (entry) =>
            entry.isFile() &&
            DEMO_EXTENSIONS.some((ext) => entry.name.endsWith(ext))
        )
        .map((entry) => entry.name)
        .sort()

      console.log(`   Found ${files.length} demos for ${base.name}`)

      return { baseName: base.name, files }
    })
  )

  let index = `// @ts-nocheck
// This file is autogenerated by scripts/build-registry.mts
// Do not edit this file directly.
import * as React from "react"

export const ExamplesIndex: Record<string, Record<string, any>> = {`

  for (const result of baseResults) {
    if (!result) continue

    const { baseName, files } = result

    index += `
  "${baseName}": {`

    for (const file of files) {
      const name = file.replace(/\.(tsx|vue|svelte|gts)$/, "")
      const isReactFile = file.endsWith(".tsx")

      index += `
    "${name}": {
      name: "${name}",
      filePath: "examples/${baseName}/${file}",
      component: ${
        isReactFile
          ? `React.lazy(async () => {
        const mod = await import("./${baseName}/${name}")
        const exportName = Object.keys(mod).find(key => typeof mod[key] === 'function' || typeof mod[key] === 'object') || "${name}"
        return { default: mod.default || mod[exportName] }
      })`
          : "null"
      },
    },`
    }

    index += `
  },`
  }

  index += `
}
`

  const outputPath = path.join(examplesDir, "__index__.tsx")
  await writeIfChanged(
    outputPath,
    await formatGeneratedSource(index, outputPath)
  )
}

async function buildRegistryIndex(styles: { name: string; title: string }[]) {
  let index = `// @ts-nocheck
// This file is autogenerated by scripts/build-registry.ts
// Do not edit this file directly.
import * as React from "react"

export const Index: Record<string, Record<string, any>> = {`

  for (const style of styles) {
    const styleCombination = getStyleCombination(style.name)
    const { registry: importedRegistry } = styleCombination
      ? await import(
          path.join(getBaseSrcDir(styleCombination.base.name), "registry.ts")
        )
      : await import(`../registry/${style.name}/registry.ts`)

    const parseResult = registrySchema.safeParse(importedRegistry)
    if (!parseResult.success) {
      console.error(`❌ Registry validation failed for ${style.name}:`)
      console.error(parseResult.error.format())
      throw new Error(`Invalid registry schema for ${style.name}`)
    }

    const registry = parseResult.data

    index += `
  "${style.name}": {`

    for (const item of registry.items) {
      if (item.type === "registry:internal") {
        continue
      }

      if (styleCombination && item.type !== "registry:ui") {
        continue
      }

      const files = normalizeRegistryFiles(item)

      if (files.length === 0) {
        continue
      }

      const resolvedFiles = styleCombination
        ? files.map((file) => ({
            ...file,
            path: file.path.startsWith("ui/")
              ? `styles/${style.name}/${file.path}`
              : `registry/bases/${styleCombination.base.name}/${file.path}`,
          }))
        : files.map((file) => ({
            ...file,
            path: `registry/${style.name}/${file.path}`,
          }))

      const componentPath = files[0]?.path
        ? styleCombination
          ? files[0].path.startsWith("ui/")
            ? `@/styles/${style.name}/${stripFileExtension(files[0].path)}`
            : `@/registry/bases/${styleCombination.base.name}/${stripFileExtension(files[0].path)}`
          : `@/registry/${style.name}/${stripFileExtension(files[0].path)}`
        : ""
      const firstFileExt = files[0]?.path ? path.extname(files[0].path) : ""
      const isNonReactBase = styleCombination && (styleCombination.base.name === "vue" || styleCombination.base.name === "svelte" || styleCombination.base.name === "ember")
      const isReactComponent = !isNonReactBase && (firstFileExt === ".tsx" || firstFileExt === ".ts")

      index += `
    "${item.name}": {
      name: "${item.name}",
      title: "${item.title}",
      description: "${item.description ?? ""}",
      type: "${item.type}",
      registryDependencies: ${JSON.stringify(item.registryDependencies)},
      files: [${resolvedFiles.map((file) => {
        return `{
        path: "${file.path}",
        type: "${file.type}",
        target: "${file.target ?? ""}"
      }`
      })}],
      component: ${
        componentPath && isReactComponent
          ? `React.lazy(async () => {
        const mod = await import("${componentPath}")
        const exportName = Object.keys(mod).find(key => typeof mod[key] === 'function' || typeof mod[key] === 'object') || "${item.name}"
        return { default: mod.default || mod[exportName] }
      })`
          : "null"
      },
      categories: ${JSON.stringify(item.categories)},
      meta: ${JSON.stringify(item.meta)},
    },`
    }

    index += `
  },`
  }

  index += `
}`

  const outputPath = path.join(process.cwd(), "registry/__index__.tsx")
  await writeIfChanged(
    outputPath,
    await formatGeneratedSource(index, outputPath)
  )
}

async function buildRegistryJsonFile(styleName: string) {
  const { registry: importedRegistry } = await import(
    `../registry/${styleName}/registry.ts`
  )

  const parseResult = registrySchema.safeParse(importedRegistry)
  if (!parseResult.success) {
    console.error(`❌ Registry validation failed for ${styleName}:`)
    console.error(parseResult.error.format())
    throw new Error(`Invalid registry schema for ${styleName}`)
  }

  const registry = parseResult.data

  const fixedRegistry = {
    ...registry,
    items: registry.items.map((item) => {
      const files = normalizeRegistryFiles(item).map((file) => ({
        ...file,
        path: `registry/${styleName}/${file.path}`,
      }))
      return files.length > 0 ? { ...item, files } : item
    }),
  }

  const outputDir = path.join(process.cwd(), `public/r/styles/${styleName}`)
  await fs.mkdir(outputDir, { recursive: true })

  const registryJsonPath = path.join(outputDir, "registry.json")
  const fixedRegistryJson = await formatGeneratedJson(
    fixedRegistry,
    registryJsonPath
  )
  await writeIfChanged(registryJsonPath, fixedRegistryJson)

  const tempRegistryPath = path.join(
    process.cwd(),
    `registry-${styleName}.json`
  )
  await fs.writeFile(tempRegistryPath, fixedRegistryJson)
}

async function buildRegistry(styleName: string) {
  const outputPath = `public/r/styles/${styleName}`
  await new Promise<void>((resolve, reject) => {
    const proc = spawn(
      "node",
      [
        "../../packages/shadcn/dist/index.js",
        "build",
        `registry-${styleName}.json`,
        "--output",
        outputPath,
      ],
      { cwd: process.cwd(), stdio: "pipe" }
    )
    let stderr = ""
    proc.stderr?.on("data", (data) => (stderr += data))
    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Process exited with code ${code}: ${stderr}`))
      } else {
        resolve()
      }
    })
    proc.on("error", reject)
  })
}

async function buildBlocksIndex() {
  const blocks = await getAllBlocks(["registry:block"])

  const payload = blocks.map((block) => ({
    name: block.name,
    description: block.description,
    categories: block.categories,
  }))

  const blocksJsonPath = path.join(process.cwd(), "registry/__blocks__.json")
  await writeIfChanged(
    blocksJsonPath,
    await formatGeneratedJson(payload, blocksJsonPath)
  )
}

async function cleanUp(stylesToBuild: { name: string; title: string }[]) {
  const cleanupTasks: Promise<boolean>[] = stylesToBuild.map((style) =>
    rimraf(path.join(process.cwd(), `registry-${style.name}.json`))
  )

  for (const style of STYLE_COMBINATIONS) {
    const tempRegistryRoot = getTemporaryRegistryRoot(style.name)
    console.log(`   🗑️ registry/${style.name}`)
    cleanupTasks.push(rimraf(tempRegistryRoot))
  }

  await Promise.all(cleanupTasks)
}

async function buildConfig() {
  const config = { presets: PRESETS }
  const outputPath = path.join(process.cwd(), "public/r/config.json")
  await writeIfChanged(
    outputPath,
    await formatGeneratedJson(config, outputPath)
  )
}

async function applyIconTransform(content: string, filename: string) {
  if (!content.includes("IconPlaceholder")) {
    return content
  }

  const sourceFile = iconProject.createSourceFile(filename, content, {
    scriptKind: ScriptKind.TSX,
    overwrite: true,
  })

  type TransformIconsConfig = Parameters<typeof transformIcons>[0]["config"]
  type IconTransformInput = {
    filename: string
    raw: string
    sourceFile: typeof sourceFile
    config: TransformIconsConfig
  }
  const config = { iconLibrary: "lucide" } as TransformIconsConfig

  await (transformIcons as (opts: IconTransformInput) => Promise<unknown>)({
    filename,
    raw: content,
    sourceFile,
    config,
  })

  return sourceFile.getText()
}

async function copyUIToStyles() {
  await runWithConcurrency(
    STYLE_COMBINATIONS,
    COPY_CONCURRENCY,
    async ({ name: styleName }) => {
      const sourceDir = path.join(getTemporaryRegistryRoot(styleName), "ui")
      const styleRoot = getPersistentStyleRoot(styleName)
      const targetDir = path.join(styleRoot, "ui")

      try {
        await fs.access(sourceDir)
      } catch {
        console.log(`   ⚠️ registry/${styleName}/ui not found, skipping`)
        return
      }

      await syncDirectory({
        fromDir: sourceDir,
        toDir: targetDir,
        transformContent: async (content, filePath, targetPath) => {
          let nextContent = rewriteRegistryUiImportsToStyle(content, styleName)

          if (filePath.endsWith(".tsx")) {
            nextContent = await applyIconTransform(
              nextContent,
              path.basename(filePath)
            )
          }

          if (targetPath.endsWith(".ts") || targetPath.endsWith(".tsx")) {
            return formatGeneratedSource(nextContent, targetPath)
          }

          return nextContent
        },
      })

      if (!shouldGenerateRtlStyles(styleName)) {
        await rimraf(path.join(styleRoot, "ui-rtl"))
      }

      console.log(`   ✅ registry/${styleName}/ui → styles/${styleName}/ui`)
    }
  )
}

async function buildRtlStyles() {
  await runWithConcurrency(
    STYLE_COMBINATIONS.filter((style) => shouldGenerateRtlStyles(style.name)),
    COPY_CONCURRENCY,
    async ({ name: styleName }) => {
      const sourceDir = path.join(getPersistentStyleRoot(styleName), "ui")
      const targetDir = path.join(getPersistentStyleRoot(styleName), "ui-rtl")

      try {
        await fs.access(sourceDir)
      } catch {
        console.log(`   ⚠️ styles/${styleName}/ui not found, skipping`)
        return
      }

      await syncDirectory({
        fromDir: sourceDir,
        toDir: targetDir,
        transformContent: async (content, filePath, targetPath) => {
          if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) {
            return content
          }

          return formatGeneratedSource(
            rewriteStyleDirectionImports(
              await transformDirection(content, true),
              styleName
            ),
            targetPath
          )
        },
      })

      console.log(`   ✅ styles/${styleName}/ui-rtl`)
    }
  )
}

async function buildIndex() {
  const baseUiRegistries = await Promise.all(
    Array.from(BASES).map(async (base) => {
      const { ui } = await import(
        path.join(getBaseSrcDir(base.name), "ui/_registry.ts")
      )
      return { baseName: base.name, items: ui as RegistryItem[] }
    })
  )

  type IndexItem = Omit<RegistryItem, "meta"> & {
    meta?: { links?: Record<string, RegistryItem["meta"]> }
  }

  const componentMap = new Map<string, IndexItem>()
  for (const { baseName, items } of baseUiRegistries) {
    for (const item of items) {
      if (!componentMap.has(item.name)) {
        const { meta, ...rest } = item
        componentMap.set(item.name, {
          ...rest,
          ...(meta?.links
            ? { meta: { links: { [baseName]: meta.links } } }
            : {}),
        })
      } else if (item.meta?.links) {
        const existing = componentMap.get(item.name)!
        existing.meta = existing.meta || {}
        existing.meta.links = existing.meta.links || {}
        existing.meta.links[baseName] = item.meta.links
      }
    }
  }

  const index = Array.from(componentMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  const outputPath = path.join(process.cwd(), "public/r/index.json")
  await writeIfChanged(outputPath, await formatGeneratedJson(index, outputPath))
}

async function buildRegistriesJson() {
  const directoryPath = path.join(process.cwd(), "registry/directory.json")
  const directoryContent = await fs.readFile(directoryPath, "utf8")
  const directory = JSON.parse(directoryContent) as Array<{
    name: string
    homepage?: string
    url: string
    description?: string
    featured?: boolean
    logo?: string
  }>

  const registries = directory.map((entry) => ({
    name: entry.name,
    homepage: entry.homepage,
    url: entry.url,
    description: entry.description,
  }))

  const outputPath = path.join(process.cwd(), "public/r/registries.json")
  await writeIfChanged(
    outputPath,
    await formatGeneratedJson(registries, outputPath)
  )
}

async function readDirectoryEntries(dirPath: string) {
  try {
    return await fs.readdir(dirPath, { withFileTypes: true })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return []
    }

    throw error
  }
}

async function syncDirectory({
  fromDir,
  toDir,
  transformContent,
}: {
  fromDir: string
  toDir: string
  transformContent?: (
    content: string,
    filePath: string,
    targetPath: string
  ) => Promise<string>
}): Promise<string[]> {
  await fs.mkdir(toDir, { recursive: true })

  const [sourceEntries, targetEntries] = await Promise.all([
    fs.readdir(fromDir, { withFileTypes: true }),
    readDirectoryEntries(toDir),
  ])

  const targetEntriesByName = new Map(
    targetEntries.map((entry) => [entry.name, entry])
  )
  const sourceNames = new Set(sourceEntries.map((entry) => entry.name))

  await Promise.all(
    targetEntries.map(async (entry) => {
      if (!sourceNames.has(entry.name)) {
        await rimraf(path.join(toDir, entry.name))
      }
    })
  )

  const changedPaths: string[][] = await runWithConcurrency(
    sourceEntries,
    COPY_CONCURRENCY,
    async (entry) => {
      const sourcePath = path.join(fromDir, entry.name)
      const targetPath = path.join(toDir, entry.name)
      const existingTargetEntry = targetEntriesByName.get(entry.name)

      if (entry.isDirectory()) {
        if (existingTargetEntry && !existingTargetEntry.isDirectory()) {
          await rimraf(targetPath)
        }

        return await syncDirectory({
          fromDir: sourcePath,
          toDir: targetPath,
          transformContent,
        })
      }

      if (existingTargetEntry?.isDirectory()) {
        await rimraf(targetPath)
      }

      let content = await fs.readFile(sourcePath, "utf8")

      if (transformContent) {
        content = await transformContent(content, sourcePath, targetPath)
      }

      return (await writeIfChanged(targetPath, content)) ? [targetPath] : []
    }
  )

  return changedPaths.flat()
}

function rewriteRegistryUiImportsToStyle(content: string, styleName: string) {
  return content
    .replaceAll(`@/registry/${styleName}/ui/`, `@/styles/${styleName}/ui/`)
    .replaceAll(`@/registry/${styleName}/lib/utils`, `@/lib/utils`)
    .replaceAll(
      `@/registry/${styleName}/hooks/use-mobile`,
      `@/hooks/use-mobile`
    )
    .replaceAll(`@/registry/${styleName}/lib/`, `@/lib/`)
    .replaceAll(`@/registry/${styleName}/hooks/`, `@/hooks/`)
}

function rewriteStyleDirectionImports(content: string, styleName: string) {
  return content.replaceAll(
    `@/styles/${styleName}/ui/`,
    `@/styles/${styleName}/ui-rtl/`
  )
}

async function buildColors() {
  const colorsTargetPath = path.join(process.cwd(), "public/r/colors")
  await fs.mkdir(colorsTargetPath, { recursive: true })

  await Promise.all(
    BASE_COLORS.map(async (baseColor) => {
      const light = (baseColor.cssVars?.light ?? {}) as Record<string, string>
      const dark = (baseColor.cssVars?.dark ?? {}) as Record<string, string>

      const cssVarKeys = Object.keys(light).filter(
        (key) => !key.startsWith("sidebar")
      )

      const rootVars = cssVarKeys
        .map((key) => `    --${key}: ${light[key]};`)
        .join("\n")
      const darkVars = cssVarKeys
        .filter((key) => dark[key])
        .map((key) => `    --${key}: ${dark[key]};`)
        .join("\n")

      const payload = {
        inlineColors: { light, dark },
        cssVars: { light, dark },
        cssVarsV4: baseColor.cssVars,
        inlineColorsTemplate:
          "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n  ",
        cssVarsTemplate: `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n@layer base {\n  :root {\n${rootVars}\n  }\n\n  .dark {\n${darkVars}\n  }\n}\n\n@layer base {\n  * {\n    @apply border-border;\n  }\n  body {\n    @apply bg-background text-foreground;\n  }\n}`,
      }

      const outputPath = path.join(colorsTargetPath, `${baseColor.name}.json`)
      await writeIfChanged(
        outputPath,
        await formatGeneratedJson(payload, outputPath)
      )
      console.log(`   ✅ ${baseColor.name}.json`)
    })
  )
}
