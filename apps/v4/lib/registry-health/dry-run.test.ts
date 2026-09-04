import { promises as fs } from "node:fs"
import os from "node:os"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { getDryRunEnvironment, runLocalCliDryRun } from "./dry-run"
import { REGISTRY_DRY_RUN_FAILURE_MESSAGE_MAX_LENGTH } from "./schema"

describe("getDryRunEnvironment", () => {
  it("allowlists process variables and excludes credentials", () => {
    const environment = getDryRunEnvironment("/tmp/registry-health-test")

    expect(environment).toMatchObject({
      CI: "1",
      NO_COLOR: "1",
      XDG_CACHE_HOME: "/tmp/registry-health-test",
      XDG_CONFIG_HOME: "/tmp/registry-health-test",
    })
    expect(environment).not.toHaveProperty("BLOB_READ_WRITE_TOKEN")
    expect(environment).not.toHaveProperty("GITHUB_TOKEN")
    expect(environment).not.toHaveProperty("GH_TOKEN")
  })
})

describe("runLocalCliDryRun", () => {
  it("creates a TypeScript project the CLI can load", async () => {
    const directory = await fs.mkdtemp(
      path.join(os.tmpdir(), "registry-health-cli-test-")
    )
    const cliPath = path.join(directory, "cli.mjs")
    await fs.writeFile(
      cliPath,
      `
        import { readFileSync } from "node:fs"

        const tsconfig = JSON.parse(readFileSync("tsconfig.json", "utf8"))
        if (tsconfig.compilerOptions.paths["@/*"][0] !== "./*") {
          process.exit(1)
        }
      `
    )

    try {
      await expect(
        runLocalCliDryRun({
          namespace: "@acme",
          item: "button",
          registryUrl: "https://acme.example.com/r/{name}.json",
          cliPath,
        })
      ).resolves.toMatchObject({ success: true })
    } finally {
      await fs.rm(directory, { recursive: true, force: true })
    }
  })

  it("captures bounded sanitized CLI errors", async () => {
    const directory = await fs.mkdtemp(
      path.join(os.tmpdir(), "registry-health-cli-test-")
    )
    const cliPath = path.join(directory, "cli.mjs")
    await fs.writeFile(
      cliPath,
      'process.stderr.write("\\u001b[31m" + "x".repeat(1500) + " useful failure\\u001b[0m"); process.exit(1)'
    )

    try {
      const result = await runLocalCliDryRun({
        namespace: "@acme",
        item: "button",
        registryUrl: "https://acme.example.com/r/{name}.json",
        cliPath,
      })

      expect(result).toMatchObject({
        success: false,
        failureCode: "exit_1",
      })
      expect(result.failureMessage).toContain("useful failure")
      expect(result.failureMessage).not.toContain("\u001b")
      expect(result.failureMessage?.length).toBeLessThanOrEqual(
        REGISTRY_DRY_RUN_FAILURE_MESSAGE_MAX_LENGTH
      )
    } finally {
      await fs.rm(directory, { recursive: true, force: true })
    }
  })

  it("force kills a CLI process that ignores SIGTERM", async () => {
    const directory = await fs.mkdtemp(
      path.join(os.tmpdir(), "registry-health-cli-test-")
    )
    const cliPath = path.join(directory, "cli.mjs")
    await fs.writeFile(
      cliPath,
      'process.on("SIGTERM", () => {}); setInterval(() => {}, 1000)'
    )

    try {
      const result = await runLocalCliDryRun({
        namespace: "@acme",
        item: "button",
        registryUrl: "https://acme.example.com/r/{name}.json",
        cliPath,
        timeoutMs: 25,
        killGraceMs: 25,
      })

      expect(result).toMatchObject({
        success: false,
        failureCode: "timeout",
      })
    } finally {
      await fs.rm(directory, { recursive: true, force: true })
    }
  })
})
