import path from "path"
import { execa } from "execa"
import fs from "fs-extra"
import { describe, expect, it, vi } from "vitest"

import { withTempDir } from "@/src/test-helpers"

import {
  adaptWorkspaceConfig,
  getInstallArgs,
  rewriteWorkspaceProtocol,
} from "./create-template"

vi.mock("execa", () => ({
  execa: vi.fn().mockResolvedValue({ stdout: "9.9.9" }),
}))

describe("getInstallArgs", () => {
  it("returns --no-frozen-lockfile for pnpm", () => {
    expect(getInstallArgs("pnpm")).toEqual(["--no-frozen-lockfile"])
  })

  it("returns --no-immutable for yarn", () => {
    expect(getInstallArgs("yarn")).toEqual(["--no-immutable"])
  })

  it("returns an empty array for npm", () => {
    expect(getInstallArgs("npm")).toEqual([])
  })

  it("returns an empty array for bun", () => {
    expect(getInstallArgs("bun")).toEqual([])
  })
})

describe("rewriteWorkspaceProtocol", () => {
  // Lay out the mini-monorepo fixture shared by these cases:
  // - root package.json with a workspace: dep
  // - packages/a with a workspace: devDependency next to a normal dep
  // - packages/b with no workspace: refs (must stay byte-identical)
  // - node_modules/trap with a workspace: dep (must never be touched)
  async function writeFixture(dir: string) {
    const rootPackageJson = {
      name: "root",
      dependencies: {
        dep: "workspace:*",
      },
      peerDependencies: {
        peerDep: "workspace:*",
      },
      optionalDependencies: {
        optDep: "workspace:*",
      },
    }
    await fs.writeFile(
      path.join(dir, "package.json"),
      JSON.stringify(rootPackageJson, null, 2) + "\n"
    )

    await fs.ensureDir(path.join(dir, "packages", "a"))
    const aPackageJson = {
      name: "a",
      dependencies: {
        react: "^19",
      },
      devDependencies: {
        dep: "workspace:^1.0.0",
      },
    }
    await fs.writeFile(
      path.join(dir, "packages", "a", "package.json"),
      JSON.stringify(aPackageJson, null, 2) + "\n"
    )

    await fs.ensureDir(path.join(dir, "packages", "b"))
    const bPackageJsonContent =
      JSON.stringify(
        {
          name: "b",
          dependencies: {
            react: "^19",
          },
        },
        null,
        2
      ) + "\n"
    const bPackageJsonPath = path.join(dir, "packages", "b", "package.json")
    await fs.writeFile(bPackageJsonPath, bPackageJsonContent)

    await fs.ensureDir(path.join(dir, "node_modules", "trap"))
    const trapPackageJson = {
      name: "trap",
      dependencies: {
        dep: "workspace:*",
      },
    }
    const trapPackageJsonPath = path.join(
      dir,
      "node_modules",
      "trap",
      "package.json"
    )
    await fs.writeFile(
      trapPackageJsonPath,
      JSON.stringify(trapPackageJson, null, 2) + "\n"
    )

    return { bPackageJsonPath, bPackageJsonContent, trapPackageJsonPath }
  }

  it("rewrites workspace: specifiers to * across dependencies, devDependencies, peerDependencies, and optionalDependencies", async () => {
    await withTempDir(async (dir) => {
      await writeFixture(dir)

      await rewriteWorkspaceProtocol(dir)

      const rootResult = await fs.readJson(path.join(dir, "package.json"))
      expect(rootResult.dependencies.dep).toBe("*")
      expect(rootResult.peerDependencies.peerDep).toBe("*")
      expect(rootResult.optionalDependencies.optDep).toBe("*")

      const aResult = await fs.readJson(
        path.join(dir, "packages", "a", "package.json")
      )
      expect(aResult.devDependencies.dep).toBe("*")
      expect(aResult.dependencies.react).toBe("^19")
    })
  })

  it("skips node_modules entirely", async () => {
    await withTempDir(async (dir) => {
      const { trapPackageJsonPath } = await writeFixture(dir)

      await rewriteWorkspaceProtocol(dir)

      const trapResult = await fs.readJson(trapPackageJsonPath)
      expect(trapResult.dependencies.dep).toBe("workspace:*")
    })
  })

  it("leaves package.json files without workspace: references byte-identical", async () => {
    await withTempDir(async (dir) => {
      const { bPackageJsonPath, bPackageJsonContent } = await writeFixture(dir)

      await rewriteWorkspaceProtocol(dir)

      const bRaw = await fs.readFile(bPackageJsonPath, "utf8")
      expect(bRaw).toBe(bPackageJsonContent)
    })
  })

  it("writes rewritten package.json files with a trailing newline", async () => {
    await withTempDir(async (dir) => {
      await writeFixture(dir)

      await rewriteWorkspaceProtocol(dir)

      const rootRaw = await fs.readFile(path.join(dir, "package.json"), "utf8")
      expect(rootRaw.endsWith("\n")).toBe(true)
      expect(rootRaw.endsWith("\n\n")).toBe(false)
    })
  })
})

describe("adaptWorkspaceConfig", () => {
  const PNPM_WORKSPACE_YAML = 'packages:\n  - "apps/*"\n  - "packages/*"\n'

  async function writeMonorepoFixture(dir: string) {
    await fs.writeFile(
      path.join(dir, "pnpm-workspace.yaml"),
      PNPM_WORKSPACE_YAML
    )
    await fs.writeFile(path.join(dir, "pnpm-lock.yaml"), "lockfileVersion: 9\n")
    await fs.writeFile(
      path.join(dir, "package.json"),
      JSON.stringify(
        { name: "root", packageManager: "pnpm@10.0.0" },
        null,
        2
      ) + "\n"
    )
    await fs.ensureDir(path.join(dir, "packages", "a"))
    await fs.writeFile(
      path.join(dir, "packages", "a", "package.json"),
      JSON.stringify(
        {
          name: "a",
          dependencies: { dep: "workspace:*" },
        },
        null,
        2
      ) + "\n"
    )
  }

  it("no-ops for pnpm", async () => {
    await withTempDir(async (dir) => {
      await writeMonorepoFixture(dir)

      await adaptWorkspaceConfig(dir, "pnpm")

      expect(await fs.pathExists(path.join(dir, "pnpm-lock.yaml"))).toBe(true)
      expect(await fs.pathExists(path.join(dir, "pnpm-workspace.yaml"))).toBe(
        true
      )
      const pkg = await fs.readJson(path.join(dir, "package.json"))
      expect(pkg.packageManager).toBe("pnpm@10.0.0")
    })
  })

  it("adapts a monorepo for npm: removes lockfile/yaml, sets packageManager and workspaces, rewrites workspace: deps", async () => {
    await withTempDir(async (dir) => {
      await writeMonorepoFixture(dir)

      await adaptWorkspaceConfig(dir, "npm")

      expect(await fs.pathExists(path.join(dir, "pnpm-lock.yaml"))).toBe(false)
      expect(await fs.pathExists(path.join(dir, "pnpm-workspace.yaml"))).toBe(
        false
      )

      const pkg = await fs.readJson(path.join(dir, "package.json"))
      expect(pkg.packageManager).toBe("npm@9.9.9")
      expect(pkg.workspaces).toEqual(["apps/*", "packages/*"])

      const nested = await fs.readJson(
        path.join(dir, "packages", "a", "package.json")
      )
      expect(nested.dependencies.dep).toBe("*")
    })
  })

  it("adapts a monorepo for bun: sets packageManager and workspaces but does not rewrite workspace: deps", async () => {
    await withTempDir(async (dir) => {
      await writeMonorepoFixture(dir)

      await adaptWorkspaceConfig(dir, "bun")

      expect(await fs.pathExists(path.join(dir, "pnpm-lock.yaml"))).toBe(false)
      expect(await fs.pathExists(path.join(dir, "pnpm-workspace.yaml"))).toBe(
        false
      )

      const pkg = await fs.readJson(path.join(dir, "package.json"))
      expect(pkg.packageManager).toBe("bun@9.9.9")
      expect(pkg.workspaces).toEqual(["apps/*", "packages/*"])

      const nested = await fs.readJson(
        path.join(dir, "packages", "a", "package.json")
      )
      expect(nested.dependencies.dep).toBe("workspace:*")
    })
  })

  it("deletes packageManager and adds no workspaces for a single-package npm project", async () => {
    await withTempDir(async (dir) => {
      await fs.writeFile(
        path.join(dir, "package.json"),
        JSON.stringify(
          { name: "root", packageManager: "pnpm@10.0.0" },
          null,
          2
        ) + "\n"
      )

      await adaptWorkspaceConfig(dir, "npm")

      const pkg = await fs.readJson(path.join(dir, "package.json"))
      expect(pkg.packageManager).toBeUndefined()
      expect(pkg.workspaces).toBeUndefined()
    })
  })

  it("falls back to <pm>@* when execa rejects", async () => {
    vi.mocked(execa).mockRejectedValueOnce(new Error("not found"))

    await withTempDir(async (dir) => {
      await writeMonorepoFixture(dir)

      await adaptWorkspaceConfig(dir, "npm")

      const pkg = await fs.readJson(path.join(dir, "package.json"))
      expect(pkg.packageManager).toBe("npm@*")
    })
  })
})
