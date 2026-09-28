import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import * as ERRORS from "@/src/utils/errors"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { preFlightMigrate } from "./preflight-migrate"

describe("preFlightMigrate", () => {
  let cwd: string

  beforeEach(async () => {
    cwd = await fs.mkdtemp(path.join(tmpdir(), "shadcn-preflight-migrate-"))
    await fs.writeFile(
      path.join(cwd, "package.json"),
      JSON.stringify({ name: "fixture" })
    )
  })

  afterEach(async () => {
    await fs.rm(cwd, { recursive: true, force: true })
  })

  const getOptions = (cwd: string) => ({
    cwd,
    list: false,
    yes: true,
    migration: "rtl",
  })

  it("requires components.json for config migrations", async () => {
    const result = await preFlightMigrate(getOptions(cwd))

    expect(result.errors).toEqual({ [ERRORS.MISSING_CONFIG]: true })
    expect(result.config).toBeNull()
  })

  it("requires package.json", async () => {
    await fs.rm(path.join(cwd, "package.json"))

    const result = await preFlightMigrate(getOptions(cwd))

    expect(result.errors).toEqual({
      [ERRORS.MISSING_DIR_OR_EMPTY_PROJECT]: true,
    })
    expect(result.config).toBeNull()
  })
})
