/**
 * Build Test Apps Script
 *
 * This script populates the ui-test-apps repository with components and examples
 * from the shadcn/ui registry for testing different style configurations.
 *
 * Prerequisites:
 *   1. Clone the test apps repo: git clone https://github.com/shadcn-ui/ui-test-apps
 *   2. Place it at ../../../ui-test-apps (relative to apps/v4) or set TEST_APPS_PATH
 *
 * Usage:
 *   pnpm test:apps [STYLE]
 *
 * Examples:
 *   pnpm test:apps nova      # Build with nova style
 *   pnpm test:apps maia      # Build with maia style
 *   pnpm test:apps vega      # Build with vega style
 *
 * Available styles: vega, nova, maia, lyra, mira
 *
 * What it does:
 *   1. Copies UI components to next-radix/components/ui and next-base/components/ui
 *   2. Copies hooks to next-radix/hooks and next-base/hooks
 *   3. Transforms canonical CSS classes (cn-*) to actual Tailwind classes
 *   4. Transforms IconPlaceholder to lucide-react icons
 *   5. Generates example pages at app/{example}/page.tsx
 *   6. Generates block pages at app/blocks/{block}/page.tsx
 *   7. Updates the STYLE constant in layout.tsx
 *
 * After running:
 *   cd ../../../ui-test-apps
 *   pnpm install
 *   pnpm dev
 *
 * Then visit:
 *   - http://localhost:3000 (next-radix)
 *   - http://localhost:3001 (next-base)
 */

import { promises as fs } from "fs"
import path from "path"
import { rimraf } from "rimraf"
import { registrySchema } from "shadcn/schema"
import {
  createStyleMap,
  transformIcons,
  transformStyle,
} from "shadcn/utils"
import { Project, ScriptKind } from "ts-morph"

import { BASES, type Base } from "@/registry/bases"
import { STYLES } from "@/registry/styles"

// Default path to test apps repo.
const DEFAULT_TEST_APPS_PATH = "../../../ui-test-apps"

// Parse CLI arguments.
const args = process.argv.slice(2)
const styleName = args[0]
const testAppsPath =
  args[1] || process.env.TEST_APPS_PATH || DEFAULT_TEST_APPS_PATH

if (!styleName) {
  console.error("❌ Usage: pnpm test:apps [STYLE] [TEST_APPS_PATH]")
  console.error("   Example: pnpm test:apps nova")
  console.error("")
  console.error(`   Available styles: ${STYLES.map((s) => s.name).join(", ")}`)
  console.error("")
  console.error(`   Default test apps path: ${DEFAULT_TEST_APPS_PATH}`)
  console.error(`   Override with: pnpm test:apps nova /path/to/ui-test-apps`)
  console.error(`   Or set TEST_APPS_PATH environment variable`)
  process.exit(1)
}

// Validate style exists.
const style = STYLES.find((s) => s.name === styleName)
if (!style) {
  console.error(`❌ Unknown style: "${styleName}"`)
  console.error(`   Available styles: ${STYLES.map((s) => s.name).join(", ")}`)
  process.exit(1)
}

// Resolve test apps path.
const resolvedTestAppsPath = path.resolve(process.cwd(), testAppsPath)

// Check if test apps path exists.
try {
  await fs.access(resolvedTestAppsPath)
} catch {
  console.error(`❌ Test apps path not found: ${resolvedTestAppsPath}`)
  process.exit(1)
}

console.log(`🏗️ Building test apps with style "${styleName}"...`)
console.log(`   Test apps path: ${resolvedTestAppsPath}`)

// Create ts-morph project for icon transformation.
const project = new Project({
  useInMemoryFileSystem: true,
})

try {
  // Build bases with the selected style.
  console.log("\n📦 Building bases...")
  const builtRegistries = await buildBasesWithStyle(Array.from(BASES), style)

  // Process each base.
  for (const { base, registryItems, styleMap } of builtRegistries) {
    const testAppDir = path.join(resolvedTestAppsPath, `next-${base.name}`)

    // Check if test app exists.
    try {
      await fs.access(testAppDir)
    } catch {
      console.log(`   ⚠️ ${testAppDir} not found, skipping.`)
      continue
    }

    console.log(`\n📋 Processing ${base.name}...`)

    // Clear existing generated content.
    await rimraf(path.join(testAppDir, "components/ui"))
    await rimraf(path.join(testAppDir, "hooks"))

    // Clear example routes (directories in app/).
    const appDir = path.join(testAppDir, "app")
    const appContents = await fs.readdir(appDir)
    for (const item of appContents) {
      const itemPath = path.join(appDir, item)
      const stat = await fs.stat(itemPath)
      if (stat.isDirectory()) {
        await rimraf(itemPath)
      }
    }

    // Copy UI components.
    console.log(`   📁 Copying UI components...`)
    await copyTransformedFiles(
      path.join(process.cwd(), `registry/bases/${base.name}/ui`),
      path.join(testAppDir, "components/ui"),
      base,
      styleMap
    )

    // Copy hooks.
    console.log(`   📁 Copying hooks...`)
    await copyTransformedFiles(
      path.join(process.cwd(), `registry/bases/${base.name}/hooks`),
      path.join(testAppDir, "hooks"),
      base,
      styleMap
    )

    // Generate example pages.
    console.log(`   📄 Generating example pages...`)
    const examplesDir = path.join(
      process.cwd(),
      `registry/bases/${base.name}/examples`
    )
    let exampleFiles: string[] = []
    try {
      exampleFiles = (await fs.readdir(examplesDir)).filter(
        (f) =>
          f.endsWith(".tsx") &&
          !f.startsWith("_") &&
          f !== "component-example.tsx" // Skip the generic component example.
      )
    } catch {
      console.log(`   ⚠️ No examples directory found for ${base.name}.`)
    }

    const generatedExamples: string[] = []

    for (const exampleFile of exampleFiles) {
      // Extract example name: "accordion-example.tsx" -> "accordion".
      const exampleName = exampleFile
        .replace("-example.tsx", "")
        .replace(".tsx", "")
      const sourcePath = path.join(examplesDir, exampleFile)
      const targetDir = path.join(appDir, exampleName)
      const targetPath = path.join(targetDir, "page.tsx")

      // Read and transform the example file.
      let content = await fs.readFile(sourcePath, "utf-8")

      // Apply style transformation.
      content = await transformStyle(content, { styleMap })

      // Transform icons using shadcn transformer.
      content = await applyIconTransform(content, exampleFile)

      // Rewrite imports.
      content = rewriteImports(content, base.name)

      // Transform the default export function name to Page.
      content = transformDefaultExport(content)

      // Write the transformed example as a page.
      await fs.mkdir(targetDir, { recursive: true })
      await fs.writeFile(targetPath, content)
      generatedExamples.push(exampleName)
    }

    console.log(`   ✅ Generated ${generatedExamples.length} example pages`)

    // Generate block pages.
    console.log(`   📄 Generating block pages...`)
    const blocksDir = path.join(
      process.cwd(),
      `registry/bases/${base.name}/blocks`
    )
    let blockFiles: string[] = []
    try {
      blockFiles = (await fs.readdir(blocksDir)).filter(
        (f) => f.endsWith(".tsx") && !f.startsWith("_")
      )
    } catch {
      console.log(`   ⚠️ No blocks directory found for ${base.name}.`)
    }

    const generatedBlocks: string[] = []

    for (const blockFile of blockFiles) {
      // Extract block name: "chatgpt.tsx" -> "chatgpt".
      const blockName = blockFile.replace(".tsx", "")
      const sourcePath = path.join(blocksDir, blockFile)
      const targetDir = path.join(appDir, `blocks/${blockName}`)
      const targetPath = path.join(targetDir, "page.tsx")

      // Read and transform the block file.
      let content = await fs.readFile(sourcePath, "utf-8")

      // Apply style transformation.
      content = await transformStyle(content, { styleMap })

      // Transform icons using shadcn transformer.
      content = await applyIconTransform(content, blockFile)

      // Rewrite imports.
      content = rewriteImports(content, base.name)

      // Transform the default export function name to Page.
      content = transformDefaultExport(content)

      // Write the transformed block as a page.
      await fs.mkdir(targetDir, { recursive: true })
      await fs.writeFile(targetPath, content)
      generatedBlocks.push(blockName)
    }

    console.log(`   ✅ Generated ${generatedBlocks.length} block pages`)

    // Update STYLE constant in layout.tsx.
    await updateLayoutStyle(testAppDir, styleName)
  }

  console.log(`\n✅ Test apps built successfully!`)
  console.log(`\n📌 Next steps:`)
  console.log(`   cd ${resolvedTestAppsPath}`)
  console.log(`   pnpm install`)
  console.log(`   pnpm dev`)
} catch (error) {
  console.error("\n❌ Build failed:", error)
  process.exit(1)
}

async function buildBasesWithStyle(bases: Base[], style: (typeof STYLES)[0]) {
  // Load style map.
  const styleContent = await fs.readFile(
    path.join(process.cwd(), `registry/styles/style-${style.name}.css`),
    "utf8"
  )
  const styleMap = createStyleMap(styleContent)

  // Load registries for each base.
  const results: Array<{
    base: Base
    registryItems: Array<{ name: string; files?: Array<{ path: string }> }>
    styleMap: Record<string, string>
  }> = []

  for (const base of bases) {
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
    results.push({ base, registryItems, styleMap })
    console.log(`   ✅ Loaded ${base.name} registry`)
  }

  return results
}

async function copyTransformedFiles(
  sourceDir: string,
  targetDir: string,
  base: Base,
  styleMap: Record<string, string>
) {
  try {
    await fs.access(sourceDir)
  } catch {
    return
  }

  await fs.mkdir(targetDir, { recursive: true })

  const files = await fs.readdir(sourceDir)
  for (const file of files) {
    // Skip _registry.ts files.
    if (file.startsWith("_")) {
      continue
    }

    const sourcePath = path.join(sourceDir, file)
    const targetPath = path.join(targetDir, file)
    const stat = await fs.stat(sourcePath)

    if (stat.isDirectory()) {
      await copyTransformedFiles(sourcePath, targetPath, base, styleMap)
    } else {
      let content = await fs.readFile(sourcePath, "utf-8")

      // Apply style transformation for .tsx and .ts files.
      if (file.endsWith(".tsx") || file.endsWith(".ts")) {
        content = await transformStyle(content, { styleMap })
        content = await applyIconTransform(content, file)
        content = rewriteImports(content, base.name)
      }

      await fs.writeFile(targetPath, content)
    }
  }
}

async function applyIconTransform(content: string, filename: string) {
  const sourceFile = project.createSourceFile(filename, content, {
    scriptKind: ScriptKind.TSX,
    overwrite: true,
  })

  // Create a minimal config with just iconLibrary.
  // transformIcons only uses config.iconLibrary, so we can safely cast this.
  type TransformIconsConfig = Parameters<typeof transformIcons>[0]["config"]
  const config = { iconLibrary: "lucide" } as TransformIconsConfig

  await transformIcons({
    sourceFile,
    config,
    filename,
    raw: content,
  })

  return sourceFile.getText()
}

function rewriteImports(content: string, baseName: string) {
  // Rewrite base registry imports to test app paths.
  content = content.replace(
    new RegExp(`@/registry/bases/${baseName}/ui/`, "g"),
    "@/components/ui/"
  )
  content = content.replace(
    new RegExp(`@/registry/bases/${baseName}/lib/`, "g"),
    "@/lib/"
  )
  content = content.replace(
    new RegExp(`@/registry/bases/${baseName}/hooks/`, "g"),
    "@/hooks/"
  )
  content = content.replace(
    new RegExp(`@/registry/bases/${baseName}/components/`, "g"),
    "@/components/"
  )

  // Remove imports from @/app (like IconPlaceholder).
  content = content.replace(/^import.*from\s+["']@\/app\/.*["'].*\n/gm, "")

  return content
}

function transformDefaultExport(content: string) {
  // Replace "export default function XxxExample" with "export default function Page".
  content = content.replace(
    /export\s+default\s+function\s+\w+\s*\(/,
    "export default function Page("
  )

  return content
}

async function updateLayoutStyle(testAppDir: string, styleName: string) {
  const layoutPath = path.join(testAppDir, "app/layout.tsx")

  try {
    let content = await fs.readFile(layoutPath, "utf-8")

    // Replace the STYLE constant value.
    content = content.replace(
      /const STYLE = ["'][^"']*["']/,
      `const STYLE = "${styleName}"`
    )

    await fs.writeFile(layoutPath, content)
    console.log(`   ✅ Updated STYLE in layout.tsx to "${styleName}"`)
  } catch {
    console.log(`   ⚠️ Could not update layout.tsx`)
  }
}
