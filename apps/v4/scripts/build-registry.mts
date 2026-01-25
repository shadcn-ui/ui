import { exec, execFile } from "child_process"
import { promises as fs } from "fs"
import path from "path"
import { rimraf } from "rimraf"
import { registrySchema } from "shadcn/schema"
import { createStyleMap, transformDirection, transformStyle } from "shadcn/utils"
import type { z } from "zod"

import { getAllBlocks } from "@/lib/blocks"
import { legacyStyles } from "@/registry/_legacy-styles"
import { BASES, type Base } from "@/registry/bases"
import { PRESETS } from "@/registry/config"
import { STYLES } from "@/registry/styles"

// This is a list of styles that we want to check into tracking.
// This is used by the v4 site.
const WHITELISTED_STYLES = ["new-york-v4"]

// Concurrency limit for parallel operations.
const CONCURRENCY_LIMIT = 6

// Registry cache to avoid duplicate imports and validations.
type Registry = z.infer<typeof registrySchema>
const registryCache = new Map<string, Registry>()

// Collect files to format with prettier at the end.
const filesToFormat: string[] = []

// Simple concurrency limiter.
async function pMap<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const results: R[] = []
  const executing: Promise<void>[] = []

  for (const [index, item] of items.entries()) {
    const promise = Promise.resolve().then(async () => {
      results[index] = await fn(item)
    })

    executing.push(promise)

    if (executing.length >= concurrency) {
      await Promise.race(executing)
      executing.splice(
        executing.findIndex((p) => p === promise),
        1
      )
    }
  }

  await Promise.all(executing)
  return results
}

async function getBaseRegistry(baseName: string) {
  const cacheKey = `base:${baseName}`
  if (registryCache.has(cacheKey)) {
    return registryCache.get(cacheKey)!
  }

  const { registry: importedRegistry } = await import(
    `../registry/bases/${baseName}/registry.ts`
  )

  const parseResult = registrySchema.safeParse(importedRegistry)
  if (!parseResult.success) {
    console.error(`❌ Registry validation failed for ${baseName}:`)
    console.error(parseResult.error.format())
    throw new Error(`Invalid registry schema for ${baseName}`)
  }

  registryCache.set(cacheKey, parseResult.data)
  return parseResult.data
}

async function getStyleRegistry(styleName: string) {
  const cacheKey = `style:${styleName}`
  if (registryCache.has(cacheKey)) {
    return registryCache.get(cacheKey)!
  }

  const { registry: importedRegistry } = await import(
    `../registry/${styleName}/registry.ts`
  )

  const parseResult = registrySchema.safeParse(importedRegistry)
  if (!parseResult.success) {
    console.error(`❌ Registry validation failed for ${styleName}:`)
    console.error(parseResult.error.format())
    throw new Error(`Invalid registry schema for ${styleName}`)
  }

  registryCache.set(cacheKey, parseResult.data)
  return parseResult.data
}

function getStylesToBuild() {
  const stylesToBuild: { name: string; title: string }[] = [...legacyStyles]

  for (const base of BASES) {
    for (const style of STYLES) {
      stylesToBuild.push({
        name: `${base.name}-${style.name}`,
        title: `${base.title} ${style.title}`,
      })
    }
  }

  return stylesToBuild
}

try {
  const startTime = performance.now()

  console.log("🏗️ Building bases...")
  await buildBasesIndex(Array.from(BASES))
  await buildBases(Array.from(BASES))

  const stylesToBuild = getStylesToBuild()

  // Build index for legacy styles and whitelisted base-style combinations.
  console.log(`📦 Building registry/__index__.tsx...`)
  const stylesForIndex = WHITELISTED_STYLES.map((name) => ({
    name,
    title: name,
  }))
  await buildRegistryIndex(stylesForIndex)

  console.log("💅 Building styles...")
  await pMap(
    stylesToBuild,
    async (style) => {
      await buildRegistryJsonFile(style.name)
      await buildRegistry(style.name)
      console.log(`   ✅ ${style.name}`)
    },
    CONCURRENCY_LIMIT
  )

  console.log("\n🗂️ Building registry/__blocks__.json...")
  await buildBlocksIndex()

  console.log("\n⚙️ Building public/r/config.json...")
  await buildConfig()

  // Copy UI to examples before cleanup.
  console.log("\n📋 Copying UI to examples...")
  await copyUIToExamples()

  // Build RTL variants of examples.
  console.log("\n🔄 Building RTL examples...")
  await buildRtlExamples()

  console.log("\n📋 Building public/r/registries.json...")
  await buildRegistriesJson()

  // Format all collected files with prettier in one batch.
  if (filesToFormat.length > 0) {
    console.log(`\n🎨 Formatting ${filesToFormat.length} files with prettier...`)
    await new Promise<void>((resolve, reject) => {
      execFile("prettier", ["--write", ...filesToFormat], (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  // Clean up intermediate files and generated base directories.
  console.log("\n🧹 Cleaning up...")
  await cleanUp(stylesToBuild)

  const endTime = performance.now()
  const duration = ((endTime - startTime) / 1000).toFixed(2)
  console.log(`\n✅ Build complete in ${duration}s!`)
} catch (error) {
  console.error(error)
  process.exit(1)
}

async function buildBasesIndex(bases: Base[]) {
  let index = `// @ts-nocheck
// This file is autogenerated by scripts/build-registry.ts
// Do not edit this file directly.
import "server-only"
import * as React from "react"

export const Index: Record<string, Record<string, any>> = {`

  for (const base of bases) {
    const registry = await getBaseRegistry(base.name)

    index += `
  "${base.name}": {`

    for (const item of registry.items) {
      // Skip demos - they're handled by the examples index.
      if (item.type === "registry:internal") {
        continue
      }

      const files =
        item.files?.map((file) => ({
          path: typeof file === "string" ? file : file.path,
          type: typeof file === "string" ? item.type : file.type,
          target: typeof file === "string" ? undefined : file.target,
        })) ?? []

      if (files.length === 0) {
        continue
      }

      const componentPath = item.files?.[0]?.path
        ? `@/registry/bases/${base.name}/${item.files[0].path}`
        : ""

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
        componentPath
          ? `React.lazy(async () => {
        const mod = await import("${componentPath}")
        const exportName = Object.keys(mod).find(key => typeof mod[key] === 'function' || typeof mod[key] === 'object') || item.name
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

  // Write unified index.
  rimraf.sync(path.join(process.cwd(), "registry/bases/__index__.tsx"))
  await fs.writeFile(
    path.join(process.cwd(), "registry/bases/__index__.tsx"),
    index
  )
}

async function buildBases(bases: Base[]) {
  // Pre-load all style maps in parallel.
  const styleMaps = new Map<string, Map<string, string>>()
  await Promise.all(
    Array.from(STYLES).map(async (style) => {
      const styleContent = await fs.readFile(
        path.join(process.cwd(), `registry/styles/style-${style.name}.css`),
        "utf8"
      )
      styleMaps.set(style.name, createStyleMap(styleContent))
    })
  )

  // Build all base-style combinations in parallel.
  const tasks: { base: Base; style: (typeof STYLES)[number] }[] = []
  for (const base of bases) {
    for (const style of STYLES) {
      tasks.push({ base, style })
    }
  }

  await pMap(
    tasks,
    async ({ base, style }) => {
      const registry = await getBaseRegistry(base.name)

      // Filter out demos - they're handled by the examples index.
      const registryItems = registry.items.filter(
        (item) => item.type !== "registry:internal"
      )

      console.log(`   ✅ ${base.name}-${style.name}...`)

      // Create the base-style output directory if it doesn't exist.
      const styleOutputDir = path.join(
        process.cwd(),
        `registry/${base.name}-${style.name}`
      )
      rimraf.sync(styleOutputDir)
      await fs.mkdir(styleOutputDir, { recursive: true })

      // Create a registry.ts file in the output directory.
      const styleRegistry = {
        ...registry,
        items: registryItems,
      }
      const registryTs = `export const registry = ${JSON.stringify(styleRegistry, null, 2)}\n`
      await fs.writeFile(path.join(styleOutputDir, "registry.ts"), registryTs)

      const styleMap = styleMaps.get(style.name)!

      // Collect all file transformation tasks.
      const fileTasks: {
        file: { path: string }
        registryItem: (typeof registryItems)[number]
      }[] = []
      for (const registryItem of registryItems) {
        if (!registryItem.files || registryItem.files.length === 0) {
          continue
        }
        for (const file of registryItem.files) {
          fileTasks.push({ file, registryItem })
        }
      }

      // Process all files in parallel.
      await Promise.all(
        fileTasks.map(async ({ file }) => {
          const source = await fs.readFile(
            path.join(process.cwd(), `registry/bases/${base.name}/${file.path}`),
            "utf8"
          )

          // Transform the file if it's a TSX/TS file that needs style transformation.
          const fileExtension = path.extname(file.path)
          const shouldTransform =
            fileExtension === ".tsx" || fileExtension === ".ts"

          let transformedContent = source

          if (shouldTransform) {
            // Transform style classes (cn-* -> Tailwind).
            transformedContent = await transformStyle(source, {
              styleMap: styleMap,
            })

            // Transform import paths from base to style-specific paths.
            // e.g., @/registry/bases/radix/ui/button -> @/registry/radix-nova/ui/button
            transformedContent = transformedContent.replace(
              new RegExp(`@/registry/bases/${base.name}/`, "g"),
              `@/registry/${base.name}-${style.name}/`
            )
          }

          const outputPath = path.join(
            process.cwd(),
            `registry/${base.name}-${style.name}/${file.path}`
          )
          const outputDir = path.dirname(outputPath)
          await fs.mkdir(outputDir, { recursive: true })
          await fs.writeFile(outputPath, transformedContent)
        })
      )
    },
    CONCURRENCY_LIMIT
  )
}

async function buildRegistryIndex(styles: { name: string; title: string }[]) {
  let index = `// @ts-nocheck
// This file is autogenerated by scripts/build-registry.ts
// Do not edit this file directly.
import * as React from "react"

export const Index: Record<string, Record<string, any>> = {`

  for (const style of styles) {
    const registry = await getStyleRegistry(style.name)

    index += `
  "${style.name}": {`

    for (const item of registry.items) {
      // Skip demos - they're handled by the examples index.
      if (item.type === "registry:internal") {
        continue
      }

      const files =
        item.files?.map((file) => ({
          path: typeof file === "string" ? file : file.path,
          type: typeof file === "string" ? item.type : file.type,
          target: typeof file === "string" ? undefined : file.target,
        })) ?? []

      if (files.length === 0) {
        continue
      }

      const componentPath = item.files?.[0]?.path
        ? `@/registry/${style.name}/${item.files[0].path}`
        : ""

      index += `
    "${item.name}": {
      name: "${item.name}",
      title: "${item.title}",
      description: "${item.description ?? ""}",
      type: "${item.type}",
      registryDependencies: ${JSON.stringify(item.registryDependencies)},
      files: [${files.map((file) => {
        const filePath = `registry/${style.name}/${file.path}`
        return `{
        path: "${filePath}",
        type: "${file.type}",
        target: "${file.target ?? ""}"
      }`
      })}],
      component: ${
        componentPath
          ? `React.lazy(async () => {
        const mod = await import("${componentPath}")
        const exportName = Object.keys(mod).find(key => typeof mod[key] === 'function' || typeof mod[key] === 'object') || item.name
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

  // Write unified index.
  rimraf.sync(path.join(process.cwd(), "registry/__index__.tsx"))
  await fs.writeFile(path.join(process.cwd(), "registry/__index__.tsx"), index)
}

async function buildRegistryJsonFile(styleName: string) {
  const registry = await getStyleRegistry(styleName)

  // Fix the path for registry items.
  const fixedRegistry = {
    ...registry,
    items: registry.items.map((item) => {
      const files = item.files?.map((file) => {
        return {
          ...file,
          path: `registry/${styleName}/${file.path}`,
        }
      })

      return {
        ...item,
        files,
      }
    }),
  }

  // Create the output directory and write registry.json.
  const outputDir = path.join(process.cwd(), `public/r/styles/${styleName}`)
  await fs.mkdir(outputDir, { recursive: true })

  // Write registry.json to output directory.
  const registryJsonPath = path.join(outputDir, "registry.json")
  await fs.writeFile(registryJsonPath, JSON.stringify(fixedRegistry, null, 2))
  filesToFormat.push(registryJsonPath)

  // Write temporary registry file needed by shadcn build.
  const tempRegistryPath = path.join(
    process.cwd(),
    `registry-${styleName}.json`
  )
  await fs.writeFile(tempRegistryPath, JSON.stringify(fixedRegistry, null, 2))
}

async function buildRegistry(styleName: string) {
  return new Promise((resolve, reject) => {
    const outputPath = `public/r/styles/${styleName}`
    const childProcess = exec(
      `node ../../packages/shadcn/dist/index.js build registry-${styleName}.json --output ${outputPath}`
    )

    childProcess.on("exit", (code) => {
      if (code === 0) {
        resolve(undefined)
      } else {
        reject(new Error(`Process exited with code ${code}`))
      }
    })
  })
}

async function buildBlocksIndex() {
  const blocks = await getAllBlocks(["registry:block"])

  const payload = blocks.map((block) => ({
    name: block.name,
    description: block.description,
    categories: block.categories,
  }))

  const outputPath = path.join(process.cwd(), "registry/__blocks__.json")
  rimraf.sync(outputPath)
  await fs.writeFile(outputPath, JSON.stringify(payload, null, 2))
  filesToFormat.push(outputPath)
}

async function cleanUp(stylesToBuild: { name: string; title: string }[]) {
  // Clean up intermediate registry JSON files in parallel.
  await Promise.all(
    stylesToBuild.map((style) =>
      rimraf(path.join(process.cwd(), `registry-${style.name}.json`))
    )
  )

  // Clean up generated base directories except whitelisted ones.
  const dirsToClean: string[] = []
  for (const base of BASES) {
    for (const style of STYLES) {
      const baseName = `${base.name}-${style.name}`
      if (!WHITELISTED_STYLES.includes(baseName)) {
        dirsToClean.push(baseName)
      }
    }
  }

  await Promise.all(
    dirsToClean.map(async (baseName) => {
      const baseDir = path.join(process.cwd(), `registry/${baseName}`)
      console.log(`   🗑️ ${baseName}`)
      await rimraf(baseDir)
    })
  )
}

async function buildConfig() {
  const config = {
    presets: PRESETS,
  }

  const outputPath = path.join(process.cwd(), "public/r/config.json")
  await fs.writeFile(outputPath, JSON.stringify(config, null, 2))
  filesToFormat.push(outputPath)
}

async function copyUIToExamples() {
  const defaultStyle = "nova"
  const directories = ["ui", "lib", "hooks"]

  // Build list of copy tasks.
  const copyTasks: { base: Base; dir: string }[] = []
  for (const base of BASES) {
    for (const dir of directories) {
      copyTasks.push({ base, dir })
    }
  }

  await pMap(
    copyTasks,
    async ({ base, dir }) => {
      const sourceStyle = `${base.name}-${defaultStyle}`
      const fromDir = path.join(process.cwd(), `registry/${sourceStyle}/${dir}`)
      const toDir = path.join(process.cwd(), `examples/${base.name}/${dir}`)

      try {
        await fs.access(fromDir)
      } catch {
        console.log(`   ⚠️ registry/${sourceStyle}/${dir} not found, skipping`)
        return
      }

      rimraf.sync(toDir)
      await fs.mkdir(toDir, { recursive: true })

      const files = await fs.readdir(fromDir)

      // Copy all files in parallel.
      await Promise.all(
        files.map(async (file) => {
          const sourcePath = path.join(fromDir, file)
          const targetPath = path.join(toDir, file)

          let content = await fs.readFile(sourcePath, "utf-8")
          content = content.replace(
            new RegExp(`@/registry/${sourceStyle}/`, "g"),
            `@/examples/${base.name}/`
          )
          await fs.writeFile(targetPath, content)
        })
      )

      console.log(
        `   ✅ registry/${sourceStyle}/${dir} → examples/${base.name}/${dir}`
      )
    },
    CONCURRENCY_LIMIT
  )
}

// Build public/r/registries.json from registry/directory.json.
// This generates a slim version without logos for CLI consumption.
async function buildRegistriesJson() {
  // Read the source directory.json.
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

  // Transform to slim format (without logos and featured).
  const registries = directory.map((entry) => ({
    name: entry.name,
    homepage: entry.homepage,
    url: entry.url,
    description: entry.description,
  }))

  // Write to public/r/registries.json.
  const outputPath = path.join(process.cwd(), "public/r/registries.json")
  await fs.writeFile(outputPath, JSON.stringify(registries, null, 2))
  filesToFormat.push(outputPath)
}

// Build RTL variants of examples.
async function buildRtlExamples() {
  await pMap(
    Array.from(BASES),
    async (base) => {
      const sourceDir = path.join(process.cwd(), `examples/${base.name}/ui`)
      const targetDir = path.join(process.cwd(), `examples/${base.name}/ui-rtl`)

      // Check if source directory exists.
      try {
        await fs.access(sourceDir)
      } catch {
        console.log(`   ⚠️ examples/${base.name}/ui not found, skipping`)
        return
      }

      // Create target directory.
      rimraf.sync(targetDir)
      await fs.mkdir(targetDir, { recursive: true })

      // Get all UI component files.
      const files = await fs.readdir(sourceDir)

      // Process files in parallel.
      await Promise.all(
        files
          .filter((file) => file.endsWith(".tsx") || file.endsWith(".ts"))
          .map(async (file) => {
            const sourcePath = path.join(sourceDir, file)
            const targetPath = path.join(targetDir, file)

            let content = await fs.readFile(sourcePath, "utf-8")

            // Apply RTL transformations using the shadcn transformer.
            content = await transformDirection(content, "rtl")

            // Update import paths from ui/ to ui-rtl/.
            content = content.replace(
              new RegExp(`@/examples/${base.name}/ui/`, "g"),
              `@/examples/${base.name}/ui-rtl/`
            )

            await fs.writeFile(targetPath, content)
          })
      )

      console.log(`   ✅ examples/${base.name}/ui-rtl`)
    },
    CONCURRENCY_LIMIT
  )
}
