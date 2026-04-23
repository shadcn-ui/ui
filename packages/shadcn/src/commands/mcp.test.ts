import path from "path"
import { afterEach, describe, expect, it } from "vitest"

import { setMcpWorkingDirectory } from "./mcp"

describe("setMcpWorkingDirectory", () => {
  const originalCwd = process.cwd()

  afterEach(() => {
    process.chdir(originalCwd)
  })

  it("resolves the provided cwd and switches the process working directory", () => {
    const targetCwd = path.dirname(originalCwd)
    const relativeTarget = path.relative(originalCwd, targetCwd) || "."

    const resolvedCwd = setMcpWorkingDirectory(relativeTarget)

    expect(resolvedCwd).toBe(path.resolve(originalCwd, relativeTarget))
    expect(process.cwd()).toBe(resolvedCwd)
  })
})
