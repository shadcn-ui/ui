import path from "path"
import { Project } from "ts-morph"

import { collapseCanonicalWrappers, findCompositions } from "./bindings"
import { migrateCnfastSpecifiers } from "./cnfast"
import { collectBindings } from "./collect-bindings"
import { addCommonJsCnRequire } from "./emit"
import {
  getAstroFrontmatterRegions,
  getScriptKind,
  getScriptRegions,
  normalizeVirtualFilename,
} from "./files"
import { dedupeIssues, getRemainingPackages } from "./issues"
import { getAvailableLocalName } from "./references"
import { migrateSpecifiers } from "./specifiers"
import type {
  CnMigrationIssue,
  CnSourceTransformResult,
  OldPackage,
  PendingImport,
  SourceRegion,
} from "./types"

export function transformCnSource(
  content: string,
  filename: string = "source.tsx"
): CnSourceTransformResult {
  return createCnTransformer()(content, filename)
}

export function createCnTransformer() {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: { allowJs: true },
  })

  return (content: string, filename: string = "source.tsx") => {
    const extension = path.extname(filename).toLowerCase()

    if (extension === ".vue" || extension === ".svelte") {
      return transformSourceRegions(
        content,
        getScriptRegions(content, filename),
        project
      )
    }

    if (extension === ".astro") {
      return transformSourceRegions(
        content,
        [
          ...getAstroFrontmatterRegions(content, filename),
          ...getScriptRegions(content, filename),
        ],
        project
      )
    }

    return transformScriptSource(content, filename, project)
  }
}

function transformScriptSource(
  content: string,
  filename: string,
  project: Project,
  externalContent = ""
): CnSourceTransformResult {
  const sourceFile = project.createSourceFile(
    normalizeVirtualFilename(filename),
    content,
    {
      scriptKind: getScriptKind(filename),
      overwrite: true,
    }
  )
  const pendingImports: PendingImport[] = []
  const unsupported: CnMigrationIssue[] = []
  const migratedPackages = new Set<OldPackage>()
  let changes = migrateCnfastSpecifiers(sourceFile, migratedPackages)
  const bindings = collectBindings(sourceFile)
  changes += collapseCanonicalWrappers(sourceFile, bindings, migratedPackages)

  const compositions = findCompositions(sourceFile, bindings)
  if (compositions.length) {
    const cnLocalName = getAvailableLocalName(sourceFile, "cn", "cnMerge")
    const hasEsmComposition = compositions.some(
      (composition) => composition.kind === "esm"
    )

    if (hasEsmComposition) {
      pendingImports.push({
        moduleSpecifier: "cn",
        importedName: "cn",
        localName: cnLocalName,
        isTypeOnly: false,
      })
    } else {
      addCommonJsCnRequire(sourceFile, cnLocalName)
    }

    for (const { outerCall, argumentsText } of compositions.reverse()) {
      outerCall.replaceWithText(`${cnLocalName}(${argumentsText})`)
      changes++
    }
    migratedPackages.add("clsx")
    migratedPackages.add("tailwind-merge")
  }

  changes += migrateSpecifiers(
    sourceFile,
    pendingImports,
    unsupported,
    migratedPackages,
    externalContent
  )

  const result = {
    content: sourceFile.getText(),
    changes,
    migratedPackages: Array.from(migratedPackages),
    remainingPackages: getRemainingPackages(sourceFile.getText()),
    unsupported: dedupeIssues(unsupported),
  }
  project.removeSourceFile(sourceFile)

  return result
}

function transformSourceRegions(
  content: string,
  regions: SourceRegion[],
  project: Project
) {
  let transformed = content
  let changes = 0
  const migratedPackages = new Set<OldPackage>()
  const unsupported: CnMigrationIssue[] = []

  for (const region of regions.sort((a, b) => b.start - a.start)) {
    const source = transformed.slice(region.start, region.end)
    const externalContent = `${transformed.slice(0, region.start)}${transformed.slice(region.end)}`
    const result = transformScriptSource(
      source,
      region.filename,
      project,
      externalContent
    )
    transformed = `${transformed.slice(0, region.start)}${result.content}${transformed.slice(region.end)}`
    changes += result.changes
    result.migratedPackages.forEach((packageName) =>
      migratedPackages.add(packageName)
    )
    unsupported.push(...result.unsupported)
  }

  return {
    content: transformed,
    changes,
    migratedPackages: Array.from(migratedPackages),
    remainingPackages: getRemainingPackages(transformed),
    unsupported: dedupeIssues(unsupported),
  } satisfies CnSourceTransformResult
}
