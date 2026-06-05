import path from "path"
import fg from "fast-glob"
import fs from "fs-extra"

export async function scanImportsForComponents(
  cwd: string,
  aliasUi: string
): Promise<string[]> {
  const escapedAlias = aliasUi.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const importRegex = new RegExp(
    `(?:from\\s+|import\\s*\\(\\s*)['"\`]${escapedAlias}/([\\w.-]+)['"\`]`,
    "g"
  )

  const sourceFiles = await fg.glob("**/*.{ts,tsx,js,jsx}", {
    cwd,
    deep: 10,
    ignore: [
      "**/node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "**/__tests__/**",
      "**/test/**",
      "**/tests/**",
      "**/*.test.*",
      "**/*.spec.*",
      "**/*.d.ts",
    ],
  })

  const components = new Set<string>()

  await Promise.all(
    sourceFiles.map(async (filePath) => {
      try {
        const content = await fs.readFile(path.resolve(cwd, filePath), "utf8")
        let match: RegExpExecArray | null
        while ((match = importRegex.exec(content)) !== null) {
          components.add(match[1])
        }
      } catch {
        // Skip files that can't be read
      }
    })
  )

  return Array.from(components)
}
