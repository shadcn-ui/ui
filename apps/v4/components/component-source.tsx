import fs from "node:fs/promises"
import path from "node:path"
import * as React from "react"

import { highlightCode } from "@/lib/highlight-code"
import { cn } from "@/lib/utils"
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper"
import { CopyButton } from "@/components/copy-button"
import { getIconForLanguageExtension } from "@/components/icons"

const RESCRIPT_SUPPORTED_BASES = new Set(["base"])
// Resolve path relative to monorepo root, not the app directory
// If we're in apps/v4, go up two levels to get to the monorepo root
const getMonorepoRoot = () => {
  const cwd = process.cwd()
  // If we're in apps/v4, go up to monorepo root
  if (cwd.endsWith("apps/v4") || cwd.endsWith("apps\\v4")) {
    return path.join(cwd, "..", "..")
  }
  // Otherwise assume we're already at the root
  return cwd
}
const RESCRIPT_ROOT = path.join(getMonorepoRoot(), "packages/shadcn/rescript")
const RESCRIPT_DEMOS_ROOT = path.join(RESCRIPT_ROOT, "demo")
const rescriptSourcePathCache = new Map<string, string | null>()

export async function ComponentSource({
  name,
  src,
  title,
  language,
  collapsible = true,
  className,
  styleName = "new-york-v4",
  maxLines,
}: React.ComponentProps<"div"> & {
  name?: string
  src?: string
  title?: string
  language?: string
  collapsible?: boolean
  styleName?: string
  maxLines?: number
}) {
  if (!name && !src) {
    return null
  }

  let code: string | undefined
  let sourcePath: string | undefined

  if (name) {
    const rescriptSourcePath = await resolveReScriptSourcePath(name, styleName)

    if (rescriptSourcePath) {
      try {
        code = await fs.readFile(rescriptSourcePath, "utf-8")
        sourcePath = rescriptSourcePath
      } catch (error) {
        console.error(`Error reading ReScript file ${rescriptSourcePath}:`, error)
        // Only show ReScript code, don't fall back to TypeScript
        return null
      }
    } else {
      // Only show ReScript code, don't fall back to TypeScript
      // For base UI, we expect ReScript files to exist
      return null
    }
  }

  if (src) {
    const resolvedSrcPath = path.join(process.cwd(), src)
    const file = await fs.readFile(resolvedSrcPath, "utf-8")
    code = file
    sourcePath = resolvedSrcPath
  }

  if (!code) {
    return null
  }

  const displayLanguage = getDisplayLanguage(language, sourcePath, title)

  code = code.replaceAll("/* eslint-disable react/no-children-prop */\n", "")

  // Truncate code if maxLines is set.
  if (maxLines) {
    code = code.split("\n").slice(0, maxLines).join("\n")
  }

  let highlightedCode: string
  try {
    highlightedCode = await highlightCode(code, displayLanguage)
  } catch {
    highlightedCode = await highlightCode(code, "text")
  }

  if (!collapsible) {
    return (
      <div className={cn("relative", className)} suppressHydrationWarning>
        <ComponentCode
          code={code}
          highlightedCode={highlightedCode}
          language={displayLanguage}
          title={title}
        />
      </div>
    )
  }

  return (
    <CodeCollapsibleWrapper className={className} suppressHydrationWarning>
      <ComponentCode
        code={code}
        highlightedCode={highlightedCode}
        language={displayLanguage}
        title={title}
      />
    </CodeCollapsibleWrapper>
  )
}

function getDisplayLanguage(
  language: string | undefined,
  sourcePath: string | undefined,
  title: string | undefined
) {
  if (language) {
    return language
  }

  const extensionFromPath = sourcePath
    ? path.extname(sourcePath).slice(1)
    : undefined
  const extensionFromTitle = title?.split(".").pop()

  const extension = extensionFromPath || extensionFromTitle
  if (extension === "res") {
    return "rescript"
  }

  return extension || "rescript"
}

function getBaseFromStyleName(styleName: string) {
  return styleName.split("-")[0]
}

function toPascalCase(name: string) {
  return name
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("")
}

function getDemoStem(name: string) {
  if (name.endsWith("-demo")) {
    return name.slice(0, -"-demo".length)
  }

  if (name.endsWith("-example")) {
    return name.slice(0, -"-example".length)
  }

  return null
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function resolveReScriptSourcePath(name: string, styleName: string) {
  const cacheKey = `${styleName}:${name}`
  if (rescriptSourcePathCache.has(cacheKey)) {
    const cached = rescriptSourcePathCache.get(cacheKey) ?? null
    return cached
  }

  const base = getBaseFromStyleName(styleName)
  if (!RESCRIPT_SUPPORTED_BASES.has(base) || !/^[a-z0-9-]+$/.test(name)) {
    rescriptSourcePathCache.set(cacheKey, null)
    return null
  }

  // First, try to find the component file (e.g., Accordion.res)
  const componentPath = path.join(RESCRIPT_ROOT, `${toPascalCase(name)}.res`)
  const exists = await fileExists(componentPath)
  if (exists) {
    rescriptSourcePathCache.set(cacheKey, componentPath)
    return componentPath
  }

  // If component not found, try to find demo file
  // Check if name is already a demo name (ends with -demo or -example)
  const demoStem = getDemoStem(name)
  if (demoStem) {
    const demoPath = path.join(
      RESCRIPT_DEMOS_ROOT,
      `${toPascalCase(demoStem)}Demo.res`
    )
    if (await fileExists(demoPath)) {
      rescriptSourcePathCache.set(cacheKey, demoPath)
      return demoPath
    }
  }

  // Also try looking for a demo file with the component name
  // (e.g., if name is "accordion", try "AccordionDemo.res")
  const demoPathFromName = path.join(
    RESCRIPT_DEMOS_ROOT,
    `${toPascalCase(name)}Demo.res`
  )
  if (await fileExists(demoPathFromName)) {
    rescriptSourcePathCache.set(cacheKey, demoPathFromName)
    return demoPathFromName
  }

  rescriptSourcePathCache.set(cacheKey, null)
  return null
}

function ComponentCode({
  code,
  highlightedCode,
  language,
  title,
}: {
  code: string
  highlightedCode: string
  language: string
  title: string | undefined
}) {
  return (
    <figure 
      data-rehype-pretty-code-figure="" 
      className="[&>pre]:max-h-96"
      suppressHydrationWarning
    >
      {title && (
        <figcaption
          data-rehype-pretty-code-title=""
          className="text-code-foreground [&_svg]:text-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70"
          data-language={language}
        >
          {getIconForLanguageExtension(language)}
          {title}
        </figcaption>
      )}
      <CopyButton value={code} />
      <div 
        className="[&_pre[data-theme='github-light']]:!hidden [&_pre[data-theme='github-dark']]:!block dark:[&_pre[data-theme='github-light']]:!hidden dark:[&_pre[data-theme='github-dark']]:!block [&_pre]:!bg-[var(--color-code)] [&_pre]:!text-[var(--color-code-foreground)]"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: highlightedCode }} 
      />
    </figure>
  )
}
