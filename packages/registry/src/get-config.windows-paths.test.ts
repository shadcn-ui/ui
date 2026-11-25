import os from "os"
import path from "path"
import { resolveImportWithMetadata } from "@/src/resolve-import"
import fs from "fs-extra"
import { afterEach, describe, expect, it, vi } from "vitest"

import { resolveConfigPaths } from "./get-config"

vi.mock("@/src/resolve-import", () => ({
  resolveImportWithMetadata: vi.fn(),
}))

const ROOT = "C:\\Users\\me\\.worktrees\\app\\packages\\ui\\src"

const tempDirs: string[] = []

afterEach(async () => {
  vi.mocked(resolveImportWithMetadata).mockReset()
  await Promise.all(tempDirs.splice(0).map((dir) => fs.remove(dir)))
})

async function resolveWithWindowsPaths(paths: Record<string, string>) {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "shadcn-config-"))
  tempDirs.push(cwd)
  await fs.writeJson(path.join(cwd, "tsconfig.json"), {
    compilerOptions: { baseUrl: "." },
  })

  vi.mocked(resolveImportWithMetadata).mockImplementation(async (alias) => ({
    path: paths[alias],
    source: "workspace_package_exports",
    matchedAlias: "@acme/ui/*",
    matchedTarget: "./src/*",
    emitMode: "strip_extension" as const,
  }))

  return resolveConfigPaths(cwd, {
    style: "new-york",
    rsc: false,
    tsx: true,
    tailwind: {
      css: "app/globals.css",
      baseColor: "neutral",
      cssVariables: true,
    },
    aliases: {
      components: "@acme/ui/components",
      ui: "@acme/ui/components/ui",
      utils: "@acme/ui/lib/utils",
      lib: "@acme/ui/lib",
      hooks: "@acme/ui/hooks",
    },
  })
}

describe("resolveConfigPaths with Windows paths", () => {
  it("keeps a wildcard directory under a dotted parent directory", async () => {
    const config = await resolveWithWindowsPaths({
      "@acme/ui/components": `${ROOT}\\components`,
      "@acme/ui/components/ui": `${ROOT}\\components\\ui`,
      "@acme/ui/lib/utils": `${ROOT}\\lib\\utils.ts`,
      "@acme/ui/lib": `${ROOT}\\lib`,
      "@acme/ui/hooks": `${ROOT}\\hooks`,
    })

    expect(config.resolvedPaths.components).toBe(`${ROOT}\\components`)
    expect(config.resolvedPaths.ui).toBe(`${ROOT}\\components\\ui`)
    expect(config.resolvedPaths.lib).toBe(`${ROOT}\\lib`)
    expect(config.resolvedPaths.hooks).toBe(`${ROOT}\\hooks`)
  })

  it("strips only the file extension under a dotted parent directory", async () => {
    const config = await resolveWithWindowsPaths({
      "@acme/ui/components": `${ROOT}\\components.tsx`,
      "@acme/ui/components/ui": `${ROOT}\\components\\ui.tsx`,
      "@acme/ui/lib/utils": `${ROOT}\\lib\\utils.ts`,
      "@acme/ui/lib": `${ROOT}\\lib.ts`,
      "@acme/ui/hooks": `${ROOT}\\hooks.ts`,
    })

    expect(config.resolvedPaths.components).toBe(`${ROOT}\\components`)
    expect(config.resolvedPaths.ui).toBe(`${ROOT}\\components\\ui`)
    expect(config.resolvedPaths.lib).toBe(`${ROOT}\\lib`)
    expect(config.resolvedPaths.hooks).toBe(`${ROOT}\\hooks`)
  })
})
