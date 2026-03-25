import { spawn } from "child_process"
import { promises as fs } from "fs"
import path from "path"
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
 * 3. Format those temporary registries so the CLI sees stable source.
 * 4. Build registry/__index__.tsx for runtime lookup across legacy styles and
 *    generated base-style combinations.
 * 5. Build examples/__index__.tsx from authored demos.
 * 6. Export public/r/* for every style through the shadcn CLI.
 * 7. Copy compiled ui/* from the temporary registries into styles/<style>/ui.
 * 8. Build styles/<style>/ui-rtl for base-nova and radix-nova only.
 * 9. Format the generated persistent outputs.
 * 10. Clean up the temporary registry/<base-style> trees and registry-*.json.
 */

const STYLE_COMBINATIONS = Array.from(BASES).flatMap((base) =>
  STYLES.map((style) => ({
    base,
    style,
    name: `${base.name}-${style.name}`,
    title: `${base.title} ${style.title}`,
  }))
)

const prettierPaths: string[] = []

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
  return filePath.replace(/\.(tsx|ts|json|mdx)$/, "")
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
  return styleName === "base-nova" || styleName === "radix-nova"
}

function getTemporaryRegistryRoot(styleName: string) {
  return path.join(process.cwd(), `registry/${styleName}`)
}

function getPersistentStyleRoot(styleName: string) {
  return path.join(process.cwd(), "styles", styleName)
}

try {
  const totalStart = performance.now()

  console.log("🏗️ Building bases...")
  await buildBasesIndex(Array.from(BASES))
  await buildBases(Array.from(BASES))

  const temporaryRegistryDirs = STYLE_COMBINATIONS.map(({ name }) =>
    getTemporaryRegistryRoot(name)
  )

  console.log("\n✨ Formatting temporary registries...")
  await batchPrettier(temporaryRegistryDirs)

  const stylesToBuild = getStylesToBuild()

  console.log("\n📦 Building registry/__index__.tsx...")
  await buildRegistryIndex(stylesToBuild)

  console.log("\n📋 Building examples/__index__.tsx...")
  await buildExamplesIndex()

  console.log("\n💅 Building styles...")
  await Promise.all(
    stylesToBuild.map(async (style) => {
      await buildRegistryJsonFile(style.name)
      await buildRegistry(style.name)
      console.log(`   ✅ ${style.name}`)
    })
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

  if (prettierPaths.length > 0) {
    console.log(`\n✨ Formatting ${prettierPaths.length} generated paths...`)
    await batchPrettier(prettierPaths)
  }

  console.log("\n🧹 Cleaning up...")
  await cleanUp(stylesToBuild)

  const elapsed = ((performance.now() - totalStart) / 1000).toFixed(2)
  console.log(`\n✅ Build complete in ${elapsed}s!`)
} catch (error) {
  console.error(error)
  process.exit(1)
}

async function buildBasesIndex(bases: Base[]) {
  const registryImports = await Promise.all(
    bases.map(async (base) => {
      const { registry: importedRegistry } = await import(
        `../registry/bases/${base.name}/registry.ts`
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
  await rimraf(outputPath)
  await fs.writeFile(outputPath, index)
  prettierPaths.push(outputPath)
}

async function buildBases(bases: Base[]) {
  const [baseImports, styleMaps] = await Promise.all([
    Promise.all(
      bases.map(async (base) => {
        const { registry: baseRegistry } = await import(
          `../registry/bases/${base.name}/registry.ts`
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

        return { base, baseRegistry, registryItems }
      })
    ),
    Promise.all(
      STYLES.map(async (style) => {
        const styleContent = await fs.readFile(
          path.join(process.cwd(), `registry/styles/style-${style.name}.css`),
          "utf8"
        )
        return { style, styleMap: createStyleMap(styleContent) }
      })
    ),
  ])

  const combinations: Array<{
    base: Base
    style: (typeof STYLES)[number]
    baseRegistry: (typeof baseImports)[number]["baseRegistry"]
    registryItems: (typeof baseImports)[number]["registryItems"]
    styleMap: Record<string, string>
  }> = []

  for (const { base, baseRegistry, registryItems } of baseImports) {
    for (const { style, styleMap } of styleMaps) {
      combinations.push({ base, style, baseRegistry, registryItems, styleMap })
    }
  }

  await Promise.all(
    combinations.map(
      async ({ base, style, baseRegistry, registryItems, styleMap }) => {
        const styleName = `${base.name}-${style.name}`
        const styleOutputDir = getTemporaryRegistryRoot(styleName)

        console.log(`   ✅ ${styleName}...`)

        await rimraf(styleOutputDir)
        await fs.mkdir(styleOutputDir, { recursive: true })

        const styleRegistry = { ...baseRegistry, items: registryItems }
        const registryTs = `export const registry = ${JSON.stringify(styleRegistry, null, 2)}\n`
        await fs.writeFile(path.join(styleOutputDir, "registry.ts"), registryTs)

        await Promise.all(
          registryItems.flatMap((registryItem) => {
            const files = normalizeRegistryFiles(registryItem)
            if (files.length === 0) {
              return []
            }

            return files.map(async (file) => {
              const source = await fs.readFile(
                path.join(
                  process.cwd(),
                  `registry/bases/${base.name}/${file.path}`
                ),
                "utf8"
              )

              const fileExtension = path.extname(file.path)
              const shouldTransform =
                fileExtension === ".tsx" || fileExtension === ".ts"

              let transformedContent = source

              if (shouldTransform) {
                transformedContent = await transformStyle(source, {
                  styleMap,
                })
                transformedContent = transformedContent.replace(
                  new RegExp(`@/registry/bases/${base.name}/`, "g"),
                  `@/registry/${styleName}/`
                )
              }

              const outputPath = path.join(styleOutputDir, file.path)
              await fs.mkdir(path.dirname(outputPath), { recursive: true })
              await fs.writeFile(outputPath, transformedContent)
            })
          })
        )
      }
    )
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
      const files = allEntries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx"))
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
      const name = file.replace(/\.tsx$/, "")

      index += `
    "${name}": {
      name: "${name}",
      filePath: "examples/${baseName}/${file}",
      component: React.lazy(async () => {
        const mod = await import("./${baseName}/${name}")
        const exportName = Object.keys(mod).find(key => typeof mod[key] === 'function' || typeof mod[key] === 'object') || "${name}"
        return { default: mod.default || mod[exportName] }
      }),
    },`
    }

    index += `
  },`
  }

  index += `
}
`

  const outputPath = path.join(examplesDir, "__index__.tsx")
  await rimraf(outputPath)
  await fs.writeFile(outputPath, index)
  prettierPaths.push(outputPath)
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
          `../registry/bases/${styleCombination.base.name}/registry.ts`
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
        componentPath
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
  await rimraf(outputPath)
  await fs.writeFile(outputPath, index)
  prettierPaths.push(outputPath)
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
  await fs.writeFile(registryJsonPath, JSON.stringify(fixedRegistry, null, 2))
  prettierPaths.push(registryJsonPath)

  const tempRegistryPath = path.join(
    process.cwd(),
    `registry-${styleName}.json`
  )
  await fs.writeFile(tempRegistryPath, JSON.stringify(fixedRegistry, null, 2))
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
  await rimraf(blocksJsonPath)
  await fs.writeFile(blocksJsonPath, JSON.stringify(payload, null, 2))
  prettierPaths.push(blocksJsonPath)
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
  await fs.writeFile(outputPath, JSON.stringify(config, null, 2))
  prettierPaths.push(outputPath)
}

async function applyIconTransform(content: string, filename: string) {
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
  await Promise.all(
    STYLE_COMBINATIONS.map(async ({ name: styleName }) => {
      const sourceDir = path.join(getTemporaryRegistryRoot(styleName), "ui")
      const styleRoot = getPersistentStyleRoot(styleName)
      const targetDir = path.join(styleRoot, "ui")

      try {
        await fs.access(sourceDir)
      } catch {
        console.log(`   ⚠️ registry/${styleName}/ui not found, skipping`)
        return
      }

      await rimraf(styleRoot)
      await fs.mkdir(targetDir, { recursive: true })

      await copyDirectory({
        fromDir: sourceDir,
        toDir: targetDir,
        transformContent: async (content, filePath) => {
          let nextContent = rewriteRegistryUiImportsToStyle(content, styleName)

          if (filePath.endsWith(".tsx")) {
            nextContent = await applyIconTransform(
              nextContent,
              path.basename(filePath)
            )
          }

          return nextContent
        },
      })

      prettierPaths.push(styleRoot)
      console.log(`   ✅ registry/${styleName}/ui → styles/${styleName}/ui`)
    })
  )
}

async function buildRtlStyles() {
  await Promise.all(
    STYLE_COMBINATIONS.filter((style) => shouldGenerateRtlStyles(style.name)).map(
      async ({ name: styleName }) => {
        const sourceDir = path.join(getPersistentStyleRoot(styleName), "ui")
        const targetDir = path.join(
          getPersistentStyleRoot(styleName),
          "ui-rtl"
        )

        try {
          await fs.access(sourceDir)
        } catch {
          console.log(`   ⚠️ styles/${styleName}/ui not found, skipping`)
          return
        }

        await rimraf(targetDir)
        await copyDirectory({
          fromDir: sourceDir,
          toDir: targetDir,
          transformContent: async (content, filePath) => {
            if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) {
              return content
            }

            return rewriteStyleDirectionImports(
              await transformDirection(content, true),
              styleName
            )
          },
        })

        prettierPaths.push(targetDir)
        console.log(`   ✅ styles/${styleName}/ui-rtl`)
      }
    )
  )
}

async function buildIndex() {
  const baseUiRegistries = await Promise.all(
    Array.from(BASES).map(async (base) => {
      const { ui } = await import(
        `../registry/bases/${base.name}/ui/_registry.ts`
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
  await fs.writeFile(outputPath, JSON.stringify(index, null, 2))
  prettierPaths.push(outputPath)
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
  await fs.writeFile(outputPath, JSON.stringify(registries, null, 2))
  prettierPaths.push(outputPath)
}

async function copyDirectory({
  fromDir,
  toDir,
  transformContent,
}: {
  fromDir: string
  toDir: string
  transformContent?: (content: string, filePath: string) => Promise<string>
}) {
  const entries = await fs.readdir(fromDir, { withFileTypes: true })

  await fs.mkdir(toDir, { recursive: true })

  await Promise.all(
    entries.map(async (entry) => {
      const sourcePath = path.join(fromDir, entry.name)
      const targetPath = path.join(toDir, entry.name)

      if (entry.isDirectory()) {
        await copyDirectory({
          fromDir: sourcePath,
          toDir: targetPath,
          transformContent,
        })
        return
      }

      let content = await fs.readFile(sourcePath, "utf8")

      if (transformContent) {
        content = await transformContent(content, sourcePath)
      }

      await fs.mkdir(path.dirname(targetPath), { recursive: true })
      await fs.writeFile(targetPath, content)
    })
  )
}

function rewriteRegistryUiImportsToStyle(content: string, styleName: string) {
  return content
    .replaceAll(`@/registry/${styleName}/ui/`, `@/styles/${styleName}/ui/`)
    .replaceAll(`@/registry/${styleName}/lib/utils`, `@/lib/utils`)
    .replaceAll(`@/registry/${styleName}/hooks/use-mobile`, `@/hooks/use-mobile`)
    .replaceAll(`@/registry/${styleName}/lib/`, `@/lib/`)
    .replaceAll(`@/registry/${styleName}/hooks/`, `@/hooks/`)
}

function rewriteStyleDirectionImports(content: string, styleName: string) {
  return content.replaceAll(
    `@/styles/${styleName}/ui/`,
    `@/styles/${styleName}/ui-rtl/`
  )
}

async function batchPrettier(paths: string[]) {
  if (paths.length === 0) return

  await new Promise<void>((resolve, reject) => {
    const prettierBin = path.join(process.cwd(), "node_modules/.bin/prettier")
    const proc = spawn(prettierBin, ["--write", ...paths], {
      cwd: process.cwd(),
      stdio: "inherit",
    })
    proc.on("close", () => resolve())
    proc.on("error", reject)
  })
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
      await fs.writeFile(outputPath, JSON.stringify(payload, null, 2))
      prettierPaths.push(outputPath)
      console.log(`   ✅ ${baseColor.name}.json`)
    })
  )
}
