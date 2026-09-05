import { promises as fs } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { describe, expect, it } from "vitest"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, "..")
const repoRoot = path.resolve(packageRoot, "../..")
const skillRoot = path.join(repoRoot, "skills/shadcn")
const skillMdPath = path.join(skillRoot, "SKILL.md")

const BINARY_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
])

async function listSkillTextFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listSkillTextFiles(fullPath)))
      continue
    }
    if (BINARY_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      continue
    }
    files.push(fullPath)
  }

  return files
}

describe("skills/shadcn CLI pin", () => {
  it("pins the skill CLI to the published package version without load-time execution", async () => {
    const packageJson = JSON.parse(
      await fs.readFile(path.join(packageRoot, "package.json"), "utf8")
    ) as { version: string }
    const pinnedSpecifier = `shadcn@${packageJson.version}`
    const skillMd = await fs.readFile(skillMdPath, "utf8")
    const skillFiles = await listSkillTextFiles(skillRoot)

    expect(skillMd).toContain(pinnedSpecifier)
    expect(skillMd).not.toMatch(/^allowed-tools:/m)
    expect(skillMd).not.toMatch(/!`[^`]+`/)

    for (const file of skillFiles) {
      const content = await fs.readFile(file, "utf8")
      const relative = path.relative(repoRoot, file)

      expect(content, `${relative} must not use shadcn@latest`).not.toContain(
        "shadcn@latest"
      )
      expect(
        content,
        `${relative} must not use load-time ! interpolation`
      ).not.toMatch(/!`[^`]+`/)
      expect(
        content,
        `${relative} must not pre-approve shadcn CLI via allowed-tools`
      ).not.toMatch(/allowed-tools:.*Bash\([^)]*shadcn@/s)
    }
  })
})
