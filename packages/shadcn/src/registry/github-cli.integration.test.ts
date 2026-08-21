import { chmodSync, mkdtempSync, rmSync, writeFileSync } from "fs"
import { tmpdir } from "os"
import path from "path"
import { afterEach, describe, expect, it, vi } from "vitest"

import { fetchGitHubFileViaGh, GitHubTransportError } from "./github-cli"

const ADDRESS = { owner: "acme", repo: "ui" }
const SHA = "1111111111111111111111111111111111111111"

function createFakeGh(script: string) {
  const dir = mkdtempSync(path.join(tmpdir(), "shadcn-fake-gh-"))
  const binPath = path.join(dir, "gh")
  writeFileSync(binPath, `#!/bin/sh\n${script}\n`)
  chmodSync(binPath, 0o755)
  return dir
}

describe("gh executor with a real subprocess", () => {
  const tempDirs: string[] = []

  afterEach(() => {
    vi.unstubAllEnvs()
    for (const dir of tempDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it("returns fake-gh stdout as file content", async () => {
    const dir = createFakeGh(`printf 'export function Button() {}'`)
    tempDirs.push(dir)
    vi.stubEnv("PATH", dir)

    await expect(
      fetchGitHubFileViaGh(ADDRESS, SHA, "button.tsx")
    ).resolves.toBe("export function Button() {}")
  })

  it("classifies a real nonzero exit with an HTTP status from stderr", async () => {
    const secret = "ghp_secret_abcdef123456"
    const dir = createFakeGh(
      `echo "gh: ${secret} Not Found (HTTP 404)" >&2\nexit 1`
    )
    tempDirs.push(dir)
    vi.stubEnv("PATH", dir)

    const error = await fetchGitHubFileViaGh(ADDRESS, SHA, "button.tsx").catch(
      (caught) => caught
    )

    expect(error).toBeInstanceOf(GitHubTransportError)
    expect(error.kind).toBe("http")
    expect(error.statusCode).toBe(404)
    // Real execa errors embed stderr in their message; the sanitized
    // classification must not.
    const rendered = JSON.stringify({
      message: error.message,
      stack: error.stack,
      ...error,
    })
    expect(rendered).not.toContain(secret)
  })

  it("never leaks partial stdout from a failed subprocess", async () => {
    const dir = createFakeGh(
      `printf 'partial private source content'\necho "gh: boom" >&2\nexit 1`
    )
    tempDirs.push(dir)
    vi.stubEnv("PATH", dir)

    const error = await fetchGitHubFileViaGh(ADDRESS, SHA, "button.tsx").catch(
      (caught) => caught
    )

    expect(error).toBeInstanceOf(GitHubTransportError)
    expect(
      JSON.stringify({ message: error.message, stack: error.stack, ...error })
    ).not.toContain("partial private source")
  })

  it("classifies a missing gh binary from a real spawn failure", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "shadcn-empty-path-"))
    tempDirs.push(dir)
    vi.stubEnv("PATH", dir)

    await expect(
      fetchGitHubFileViaGh(ADDRESS, SHA, "button.tsx")
    ).rejects.toMatchObject({ kind: "enoent" })
  })
})
