#!/usr/bin/env tsx
/**
 * Injects materialSymbols="<ms-name>" into every <IconPlaceholder> in
 * registry/bases, derived from the site's existing lucide="..." prop via
 * registry/icons/material-symbols-map.json. Idempotent.
 *
 *   pnpm --filter=v4 tsx scripts/inject-material-symbols-prop.ts
 *   pnpm --filter=v4 tsx scripts/inject-material-symbols-prop.ts --check
 */
import * as fs from "fs"
import * as path from "path"
import { Project, SyntaxKind, type JsxAttribute } from "ts-morph"

const BASES_DIR = path.join(process.cwd(), "registry/bases")
const MAP = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "registry/icons/material-symbols-map.json"),
    "utf-8"
  )
) as Record<string, string>

function findTsxFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...findTsxFiles(full))
    else if (entry.isFile() && entry.name.endsWith(".tsx")) out.push(full)
  }
  return out
}

function getStringAttr(attrs: JsxAttribute[], name: string) {
  return attrs.find(
    (a) =>
      a.getKind() === SyntaxKind.JsxAttribute &&
      a.getNameNode().getText() === name
  )
}

function main() {
  const check = process.argv.includes("--check")
  const project = new Project({
    tsConfigFilePath: undefined,
    skipAddingFilesFromTsConfig: true,
    compilerOptions: { allowJs: false },
  })

  let sites = 0
  let injected = 0
  const unmapped: string[] = []
  const noLucide: string[] = []
  const dynamic: string[] = []
  const touchedFiles: string[] = []

  for (const file of findTsxFiles(BASES_DIR)) {
    const sf = project.addSourceFileAtPath(file)
    let changed = false

    const elements = [
      ...sf.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
      ...sf.getDescendantsOfKind(SyntaxKind.JsxOpeningElement),
    ]

    for (const el of elements) {
      if (el.getTagNameNode()?.getText() !== "IconPlaceholder") continue
      sites++

      const attrs = el
        .getAttributes()
        .filter(
          (a) => a.getKind() === SyntaxKind.JsxAttribute
        ) as JsxAttribute[]

      if (getStringAttr(attrs, "materialSymbols")) continue // idempotent

      const lucideAttr = getStringAttr(attrs, "lucide")
      const initializer = lucideAttr?.getInitializer()

      if (!initializer) {
        noLucide.push(`${path.relative(process.cwd(), file)}`)
        continue
      }
      // Dynamic binding (e.g. lucide={icon.lucide}) — cannot resolve statically.
      if (initializer.getKind() !== SyntaxKind.StringLiteral) {
        dynamic.push(`${path.relative(process.cwd(), file)}`)
        continue
      }
      const lucideVal = initializer.getText().replace(/^["']|["']$/g, "")
      const ms = MAP[lucideVal]
      if (!ms) {
        unmapped.push(`${lucideVal} (${path.relative(process.cwd(), file)})`)
        continue
      }

      const lucideIndex = el
        .getAttributes()
        .indexOf(lucideAttr as (typeof attrs)[number])
      el.insertAttribute(lucideIndex + 1, {
        name: "materialSymbols",
        initializer: `"${ms}"`,
      })
      injected++
      changed = true
    }

    if (changed) {
      touchedFiles.push(file)
      if (!check) sf.saveSync()
    }
    project.removeSourceFile(sf)
  }

  console.log(
    `IconPlaceholder sites: ${sites} | injected: ${injected} | unmapped: ${unmapped.length} | missing lucide: ${noLucide.length}`
  )
  if (unmapped.length) {
    console.log("\n❌ Unmapped lucide names (add to material-symbols-map):")
    ;[...new Set(unmapped)].forEach((u) => console.log(`  - ${u}`))
  }
  if (noLucide.length) {
    console.log("\n⚠ IconPlaceholder without a lucide prop:")
    ;[...new Set(noLucide)].forEach((u) => console.log(`  - ${u}`))
  }
  if (dynamic.length) {
    console.log("\nℹ Dynamic lucide bindings — handle manually:")
    ;[...new Set(dynamic)].forEach((u) => console.log(`  - ${u}`))
  }

  if (unmapped.length || noLucide.length) process.exit(1)

  if (check) {
    if (touchedFiles.length) {
      console.error(
        `\n${touchedFiles.length} file(s) still need injection. Run without --check.`
      )
      process.exit(1)
    }
    console.log("\n✓ All IconPlaceholder sites have a materialSymbols prop.")
    return
  }

  console.log(`\n✓ Updated ${touchedFiles.length} file(s).`)
}

main()
