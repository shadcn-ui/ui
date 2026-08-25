import { promises as fs } from "node:fs"
import os from "node:os"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { getDryRunEnvironment, runLocalCliDryRun } from "./dry-run"

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
