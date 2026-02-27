import { bold, cyan, dim, green, red, yellow } from "kleur/colors"
import { structuredPatch, diffWords } from "diff"
import type { DryRunFile, DryRunResult } from "@/src/utils/dry-run"

const ACTION_GLYPHS: Record<DryRunFile["action"], string> = {
  create: "+",
  overwrite: "~",
  skip: "=",
}

const ACTION_LABELS: Record<DryRunFile["action"], string> = {
  create: "create",
  overwrite: "overwrite",
  skip: "skip (identical)",
}

export function formatDryRunResult(
  result: DryRunResult,
  componentNames: string[],
  options: {
    diff?: string
    view?: string
  } = {}
) {
  // --diff and --view get a focused output with just the file.
  if (options.diff) {
    return formatDiffOutput(result, componentNames, options.diff)
  }

  if (options.view) {
    return formatViewOutput(result, componentNames, options.view)
  }

  return formatSummaryOutput(result, componentNames)
}

// Full summary output for --dry-run.
function formatSummaryOutput(result: DryRunResult, componentNames: string[]) {
  const lines: string[] = []

  // Header.
  lines.push(`${bold("┌")} ${bold(`shadcn add ${componentNames.join(", ")}`)} ${dim("(dry run)")}`)
  lines.push(dim("│"))

  // Files section.
  formatFilesSection(result, lines)

  // Dependencies section.
  formatListSection("Dependencies", result.dependencies, lines)

  // Dev dependencies section.
  formatListSection("Dev Dependencies", result.devDependencies, lines)

  // CSS section.
  formatCssSection(result, lines)

  // Env vars section.
  formatEnvVarsSection(result, lines)

  // Fonts section.
  formatFontsSection(result, lines)

  // Overwrite warning.
  const overwriteCount = result.files.filter((f) => f.action === "overwrite").length
  if (overwriteCount > 0) {
    lines.push(
      yellow(
        `⚠ ${overwriteCount} ${overwriteCount === 1 ? "file" : "files"} will be overwritten.`
      )
    )
    lines.push(dim("│"))
  }

  // Summary line.
  const summaryParts: string[] = []
  if (result.files.length > 0) {
    summaryParts.push(`${result.files.length} ${result.files.length === 1 ? "file" : "files"}`)
  }
  if (result.dependencies.length > 0) {
    summaryParts.push(`${result.dependencies.length} ${result.dependencies.length === 1 ? "dep" : "deps"}`)
  }
  if (result.css?.cssVarsCount) {
    summaryParts.push(`${result.css.cssVarsCount} CSS vars`)
  }
  if (summaryParts.length > 0) {
    lines.push(`${dim("│")} ${dim(summaryParts.join(", "))}`)
    lines.push(dim("│"))
  }

  // Footer.
  lines.push(`${dim("│")} ${dim("Run with --diff <path> to view changes.")}`)
  lines.push(`${dim("│")} ${dim("Run with --view <path> to view file contents.")}`)
  lines.push(`${dim("└")} ${dim("Run without --dry-run to apply.")}`)

  return lines.join("\n")
}

// Focused output for --diff <path>.
function formatDiffOutput(result: DryRunResult, componentNames: string[], filterPath: string) {
  const lines: string[] = []

  lines.push(`${bold("┌")} ${bold(`shadcn add ${componentNames.join(", ")}`)} ${dim("(dry run)")}`)
  lines.push(dim("│"))

  const filesToDiff = resolveFilterPath(result.files, filterPath)

  // Check if the filter matches the CSS file.
  const cssMatch = result.css && (
    result.css.path === filterPath ||
    result.css.path.includes(filterPath) ||
    result.css.path.endsWith(filterPath)
  )

  if (filesToDiff.length === 0 && !cssMatch) {
    lines.push(`${dim("│")} ${yellow(`No file matching "${filterPath}" found.`)}`)
    lines.push(dim("│"))
  } else {
    for (const file of filesToDiff) {
      formatFileDiff(file, lines)
    }

    // CSS diff.
    if (cssMatch && result.css) {
      const actionLabel = result.css.action === "create"
        ? green("create")
        : yellow("update")

      lines.push(`${dim("├")} ${bold(result.css.path)} ${dim("(")}${actionLabel}${dim(")")}`)

      if (result.css.action === "create" || !result.css.existingContent) {
        lines.push(`${dim("│")} ${dim("┌" + "─".repeat(46))}`)
        for (const line of result.css.content.split("\n")) {
          lines.push(`${dim("│")} ${dim("│")} ${green(`+${line}`)}`)
        }
        lines.push(`${dim("│")} ${dim("└" + "─".repeat(46))}`)
      } else {
        lines.push(`${dim("│")} ${dim("┌" + "─".repeat(46))}`)
        const diffLines = computeUnifiedDiff(
          result.css.existingContent,
          result.css.content,
          result.css.path,
          { fullContext: true }
        )
        for (const line of diffLines) {
          lines.push(`${dim("│")} ${dim("│")} ${line}`)
        }
        lines.push(`${dim("│")} ${dim("└" + "─".repeat(46))}`)
      }

      lines.push(dim("│"))
    }
  }

  lines.push(`${dim("└")} ${dim("Run without --dry-run to apply.")}`)

  return lines.join("\n")
}

// Format a single file's diff block.
function formatFileDiff(file: DryRunFile, lines: string[]) {
  const actionLabel = file.action === "create"
    ? green("create")
    : file.action === "overwrite"
      ? yellow("overwrite")
      : dim("skip")

  lines.push(`${dim("├")} ${bold(file.path)} ${dim("(")}${actionLabel}${dim(")")}`)

  if (file.action === "skip") {
    lines.push(`${dim("│")} ${dim("No changes.")}`)
  } else if (file.action === "create") {
    lines.push(`${dim("│")} ${dim("┌" + "─".repeat(46))}`)
    const contentLines = file.content.split("\n")
    for (const line of contentLines) {
      lines.push(`${dim("│")} ${dim("│")} ${green(`+${line}`)}`)
    }
    lines.push(`${dim("│")} ${dim("└" + "─".repeat(46))}`)
  } else {
    lines.push(`${dim("│")} ${dim("┌" + "─".repeat(46))}`)
    const diffLines = computeUnifiedDiff(
      file.existingContent!,
      file.content,
      file.path
    )
    for (const line of diffLines) {
      lines.push(`${dim("│")} ${dim("│")} ${line}`)
    }
    lines.push(`${dim("│")} ${dim("└" + "─".repeat(46))}`)
  }

  lines.push(dim("│"))
}

// Focused output for --view <path>.
function formatViewOutput(result: DryRunResult, componentNames: string[], filterPath: string) {
  const lines: string[] = []

  lines.push(`${bold("┌")} ${bold(`shadcn add ${componentNames.join(", ")}`)} ${dim("(dry run)")}`)
  lines.push(dim("│"))

  const filesToView = resolveFilterPath(result.files, filterPath)

  // Check if the filter matches the CSS file.
  const cssMatch = result.css && (
    result.css.path === filterPath ||
    result.css.path.includes(filterPath) ||
    result.css.path.endsWith(filterPath)
  )

  if (filesToView.length === 0 && !cssMatch) {
    lines.push(`${dim("│")} ${yellow(`No file matching "${filterPath}" found.`)}`)
    lines.push(dim("│"))
  } else {
    for (const file of filesToView) {
      const contentLines = file.content.split("\n")
      const actionLabel = file.action === "create"
        ? green("create")
        : file.action === "overwrite"
          ? yellow("overwrite")
          : dim("skip")

      lines.push(`${dim("├")} ${bold(file.path)} ${dim("(")}${actionLabel}${dim(")")} ${dim(`${contentLines.length} lines`)}`)
      lines.push(`${dim("│")} ${dim("┌" + "─".repeat(46))}`)

      for (const line of contentLines) {
        lines.push(`${dim("│")} ${dim("│")} ${line}`)
      }

      lines.push(`${dim("│")} ${dim("└" + "─".repeat(46))}`)
      lines.push(dim("│"))
    }

    // CSS view.
    if (cssMatch && result.css) {
      const contentLines = result.css.content.split("\n")
      const actionLabel = result.css.action === "create"
        ? green("create")
        : yellow("update")

      lines.push(`${dim("├")} ${bold(result.css.path)} ${dim("(")}${actionLabel}${dim(")")} ${dim(`${contentLines.length} lines`)}`)
      lines.push(`${dim("│")} ${dim("┌" + "─".repeat(46))}`)

      for (const line of contentLines) {
        lines.push(`${dim("│")} ${dim("│")} ${line}`)
      }

      lines.push(`${dim("│")} ${dim("└" + "─".repeat(46))}`)
      lines.push(dim("│"))
    }
  }

  lines.push(`${dim("└")} ${dim("Run without --dry-run to apply.")}`)

  return lines.join("\n")
}

function formatFilesSection(result: DryRunResult, lines: string[]) {
  const totalCount = result.files.length

  if (totalCount === 0) {
    return
  }

  // Build summary counts.
  const createCount = result.files.filter((f) => f.action === "create").length
  const overwriteCount = result.files.filter((f) => f.action === "overwrite").length
  const skipCount = result.files.filter((f) => f.action === "skip").length
  const summaryParts: string[] = []
  if (createCount > 0) {
    summaryParts.push(green(`+${createCount} new`))
  }
  if (overwriteCount > 0) {
    summaryParts.push(yellow(`~${overwriteCount} overwrite`))
  }
  if (skipCount > 0) {
    summaryParts.push(dim(`=${skipCount} skip`))
  }
  const summary = summaryParts.length > 0 ? ` ${summaryParts.join(dim(", "))}` : ""

  lines.push(`${dim("├")} ${bold(`Files`)} ${dim(`(${totalCount})`)}${summary}`)

  // Find the longest path for alignment.
  const maxPathLen = Math.max(...result.files.map((f) => f.path.length))

  for (const file of result.files) {
    const glyph = ACTION_GLYPHS[file.action]
    const label = ACTION_LABELS[file.action]
    const padding = " ".repeat(Math.max(1, maxPathLen - file.path.length + 2))

    const glyphStr =
      file.action === "create"
        ? green(glyph)
        : file.action === "overwrite"
          ? yellow(glyph)
          : dim(glyph)

    const pathStr =
      file.action === "skip" ? dim(file.path) : file.path

    const labelStr =
      file.action === "create"
        ? green(label)
        : file.action === "overwrite"
          ? yellow(label)
          : dim(label)

    lines.push(`${dim("│")} ${glyphStr} ${pathStr}${padding}${labelStr}`)
  }

  lines.push(dim("│"))
}

function formatListSection(
  title: string,
  items: string[],
  lines: string[]
) {
  if (!items.length) {
    return
  }

  lines.push(`${dim("├")} ${bold(title)} ${dim(`(${items.length})`)}`)
  for (const item of items) {
    lines.push(`${dim("│")} ${green("+")} ${item}`)
  }
  lines.push(dim("│"))
}

function formatCssSection(result: DryRunResult, lines: string[]) {
  if (!result.css) {
    return
  }

  lines.push(`${dim("├")} ${bold("CSS")}`)

  if (result.css.cssVarsCount > 0) {
    lines.push(
      `${dim("│")} ${green("+")} ${result.css.cssVarsCount} CSS variables added to ${cyan(result.css.path)}`
    )
  } else {
    lines.push(
      `${dim("│")} ${green("+")} Updated ${cyan(result.css.path)}`
    )
  }

  lines.push(dim("│"))
}

function formatEnvVarsSection(result: DryRunResult, lines: string[]) {
  if (!result.envVars) {
    return
  }

  const vars = Object.keys(result.envVars.variables)
  lines.push(`${dim("├")} ${bold("Environment Variables")}`)
  for (const key of vars) {
    lines.push(`${dim("│")} ${green("+")} ${key}`)
  }
  lines.push(dim("│"))
}

function formatFontsSection(result: DryRunResult, lines: string[]) {
  if (!result.fonts.length) {
    return
  }

  lines.push(`${dim("├")} ${bold("Fonts")}`)
  for (const font of result.fonts) {
    lines.push(`${dim("│")} ${green("+")} ${font.name} ${dim(`(${font.provider})`)}`)
  }
  lines.push(dim("│"))
}

// Resolve a partial path filter against the file list.
// Returns matching files. Supports partial matching (e.g. "button" matches "components/ui/button.tsx").
export function resolveFilterPath(files: DryRunFile[], filterPath: string) {
  // Exact match first.
  const exact = files.filter((f) => f.path === filterPath)
  if (exact.length > 0) {
    return exact
  }

  // Partial match: check if the filter appears in the path.
  const partial = files.filter(
    (f) =>
      f.path.includes(filterPath) ||
      f.path.endsWith(filterPath) ||
      f.path.replace(/\\/g, "/").includes(filterPath)
  )

  return partial
}

// Compute a unified diff using the `diff` package.
// Use fullContext for CSS files so the existing vars are visible alongside new ones.
function computeUnifiedDiff(
  oldStr: string,
  newStr: string,
  filePath: string,
  options: { fullContext?: boolean } = {}
) {
  const output: string[] = []

  // Check if the only differences are formatting (whitespace, quotes, semicolons).
  if (isFormattingOnly(oldStr, newStr)) {
    output.push(dim("  Formatting-only changes (spacing, quotes, semicolons)."))
    return output
  }

  // Normalize both files so structuredPatch only sees real content changes.
  // This gives us correct hunk positions and line counts.
  const normalizedOld = normalizeFileForDiff(oldStr)
  const normalizedNew = normalizeFileForDiff(newStr)

  const contextLines = options.fullContext
    ? Math.max(normalizedOld.split("\n").length, normalizedNew.split("\n").length)
    : 3

  const patch = structuredPatch(
    `a/${filePath}`,
    `b/${filePath}`,
    normalizedOld,
    normalizedNew,
    "",
    "",
    { context: contextLines }
  )

  if (!patch.hunks.length) {
    output.push(dim("  No changes."))
    return output
  }

  output.push(dim(`--- a/${filePath}`))
  output.push(dim(`+++ b/${filePath}`))

  // Use the actual new file lines for display.
  const newLines = newStr.split("\n")

  for (const hunk of patch.hunks) {
    // Process hunk into typed entries so we can suppress formatting-only
    // groups and recompute the header with correct line counts.
    type HunkEntry =
      | { kind: "context"; formatted: string }
      | { kind: "removed"; formatted: string }
      | { kind: "added"; formatted: string }

    const entries: HunkEntry[] = []
    let newLineIndex = hunk.newStart - 1

    const hunkLines = hunk.lines
    let i = 0

    while (i < hunkLines.length) {
      const line = hunkLines[i]

      if (line.startsWith("-")) {
        // Collect consecutive removed and added lines.
        const removed: string[] = []
        while (i < hunkLines.length && hunkLines[i].startsWith("-")) {
          removed.push(hunkLines[i].slice(1))
          i++
        }
        while (i < hunkLines.length && hunkLines[i].startsWith("\\")) {
          i++
        }
        const added: string[] = []
        while (i < hunkLines.length && hunkLines[i].startsWith("+")) {
          added.push(hunkLines[i].slice(1))
          i++
        }
        while (i < hunkLines.length && hunkLines[i].startsWith("\\")) {
          i++
        }

        // Check if the entire group is formatting-only (e.g., multi-line to single-line).
        if (isGroupFormattingOnly(removed, added)) {
          for (let j = 0; j < added.length; j++) {
            const actual = newLines[newLineIndex] ?? added[j]
            entries.push({ kind: "context", formatted: dim(` ${actual}`) })
            newLineIndex++
          }
        } else {
          // Collapse continuation lines in the removed group so we can
          // match multi-line removed statements against single-line added ones.
          // e.g., ["default:", '  "h-8..."'] → ["default: \"h-8...\""].
          const collapsedRemoved = collapseContLines(removed)
          const normalizedCollapsed = collapsedRemoved.map((s) => normalizeLine(s))
          const usedCollapsed = new Set<number>()

          for (let j = 0; j < added.length; j++) {
            const actualNewLine = newLines[newLineIndex] ?? added[j]
            const normalizedAdded = normalizeLine(added[j])

            // Find a matching collapsed removed statement.
            const matchIdx = normalizedCollapsed.findIndex(
              (nr, idx) => !usedCollapsed.has(idx) && nr === normalizedAdded
            )

            if (matchIdx !== -1) {
              // Formatting-only change — show as context.
              usedCollapsed.add(matchIdx)
              entries.push({ kind: "context", formatted: dim(` ${actualNewLine}`) })
            } else {
              // Real change — find best unmatched removed statement for inline diff.
              const unmatchedIdx = normalizedCollapsed.findIndex(
                (_, idx) => !usedCollapsed.has(idx)
              )
              if (unmatchedIdx !== -1) {
                usedCollapsed.add(unmatchedIdx)
                const { oldHighlighted, newHighlighted } = highlightInlineChanges(
                  collapsedRemoved[unmatchedIdx],
                  actualNewLine
                )
                entries.push({ kind: "removed", formatted: oldHighlighted })
                entries.push({ kind: "added", formatted: newHighlighted })
              } else {
                entries.push({ kind: "added", formatted: green(`+${actualNewLine}`) })
              }
            }
            newLineIndex++
          }

          // Remaining unmatched removed statements.
          for (let j = 0; j < collapsedRemoved.length; j++) {
            if (!usedCollapsed.has(j)) {
              entries.push({ kind: "removed", formatted: red(`-${collapsedRemoved[j]}`) })
            }
          }
        }
      } else if (line.startsWith("+")) {
        const actual = newLines[newLineIndex] ?? line.slice(1)
        entries.push({ kind: "added", formatted: green(`+${actual}`) })
        newLineIndex++
        i++
      } else if (line.startsWith("\\")) {
        i++
      } else {
        const actual = newLines[newLineIndex] ?? line.slice(1)
        entries.push({ kind: "context", formatted: dim(` ${actual}`) })
        newLineIndex++
        i++
      }
    }

    // Skip hunks that have no real changes after formatting suppression.
    if (!entries.some((e) => e.kind !== "context")) {
      continue
    }

    // Recompute hunk header from actual entries.
    const contextCount = entries.filter((e) => e.kind === "context").length
    const removedCount = entries.filter((e) => e.kind === "removed").length
    const addedCount = entries.filter((e) => e.kind === "added").length

    output.push(
      cyan(
        `@@ -${hunk.oldStart},${contextCount + removedCount} +${hunk.newStart},${contextCount + addedCount} @@`
      )
    )

    for (const entry of entries) {
      output.push(entry.formatted)
    }
  }

  return output
}

// Normalize a file for diffing: apply per-line formatting normalization
// while preserving line structure so hunk positions are correct.
function normalizeFileForDiff(str: string) {
  return str
    .split("\n")
    .map((line) => {
      // Preserve indentation, normalize quotes and semicolons.
      const indent = line.match(/^(\s*)/)?.[1] ?? ""
      const content = line.slice(indent.length)
      return indent + content
        .replace(/['"]/g, '"') // Normalize quotes to double.
        .replace(/;$/g, "") // Remove trailing semicolons.
    })
    .join("\n")
}

// Collapse continuation lines in a group of removed lines.
// Joins lines where a key ends with `:` and the next line is an indented value.
// e.g., ["      default:", '        "h-8..."'] → ['      default: "h-8..."'].
function collapseContLines(lines: string[]) {
  const result: string[] = []

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // If line ends with `:` (after trimming) and next line is a continuation value.
    while (
      i + 1 < lines.length &&
      line.trimEnd().endsWith(":")
    ) {
      i++
      line = line.trimEnd() + " " + lines[i].trim()
    }

    result.push(line)
  }

  return result
}

// Highlight inline word-level changes between two lines.
function highlightInlineChanges(oldLine: string, newLine: string) {
  const changes = diffWords(oldLine, newLine)

  let oldHighlighted = "-"
  let newHighlighted = "+"

  for (const change of changes) {
    if (change.added) {
      newHighlighted += bold(green(change.value))
    } else if (change.removed) {
      oldHighlighted += bold(red(change.value))
    } else {
      oldHighlighted += red(change.value)
      newHighlighted += green(change.value)
    }
  }

  return { oldHighlighted, newHighlighted }
}

// Normalize a line for formatting comparison.
function normalizeLine(line: string) {
  return line
    .replace(/\s+/g, " ") // Collapse whitespace.
    .trim()
    .replace(/['"]/g, "'") // Normalize quotes.
    .replace(/;/g, "") // Remove all semicolons.
    .replace(/,$/, "") // Remove trailing commas.
}

// Detect if differences between two strings are formatting-only.
// Joins normalized lines with a space so multi-line vs single-line wrapping is ignored.
function isFormattingOnly(oldStr: string, newStr: string) {
  const normalize = (str: string) =>
    str
      .split("\n")
      .map(normalizeLine)
      .filter((line) => line.length > 0)
      .join(" ")

  return normalize(oldStr) === normalize(newStr)
}

// Detect if a group of removed/added lines is formatting-only.
// Handles cases like multi-line to single-line reformatting.
function isGroupFormattingOnly(removed: string[], added: string[]) {
  const normalizeGroup = (lines: string[]) =>
    lines
      .map(normalizeLine)
      .filter((line) => line.length > 0)
      .join(" ")

  return normalizeGroup(removed) === normalizeGroup(added)
}
