import path from "path"
import fs from "fs-extra"
import { describe, expect, it } from "vitest"

import {
  createFixtureTestDirectory,
  getRegistryUrl,
  npxShadcn,
} from "../utils/helpers"

function expectCommandSuccess(result: Awaited<ReturnType<typeof npxShadcn>>) {
  expect(
    result.exitCode,
    [
      `Expected command to exit with 0, got ${result.exitCode}.`,
      "stdout:",
      result.stdout || "<empty>",
      "stderr:",
      result.stderr || "<empty>",
    ].join("\n")
  ).toBe(0)
}

describe("shadcn remove", () => {
  it("should remove an installed component", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, ["add", "button"])

    const buttonPath = path.join(fixturePath, "components/ui/button.tsx")
    expect(await fs.pathExists(buttonPath)).toBe(true)

    const result = await npxShadcn(fixturePath, ["remove", "button"])
    expectCommandSuccess(result)
    expect(await fs.pathExists(buttonPath)).toBe(false)
  })

  it("should be idempotent — second remove exits 0", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, ["add", "button"])

    expectCommandSuccess(await npxShadcn(fixturePath, ["remove", "button"]))
    expectCommandSuccess(await npxShadcn(fixturePath, ["remove", "button"]))
  })

  it("should exit non-zero when no components specified", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])

    const result = await npxShadcn(fixturePath, ["remove"])
    expect(result.exitCode).not.toBe(0)
    expect(result.stdout + result.stderr).toMatch(/specify components/i)
  })

  it("should delete files regardless of local modifications", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, ["add", "button"])

    const buttonPath = path.join(fixturePath, "components/ui/button.tsx")
    await fs.writeFile(buttonPath, "// locally modified\n", "utf-8")

    const result = await npxShadcn(fixturePath, ["remove", "button"])
    expectCommandSuccess(result)
    expect(await fs.pathExists(buttonPath)).toBe(false)
  })

  it("should block deletion of critical files without --force", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])

    const utilsPath = path.join(fixturePath, "lib/utils.ts")
    expect(await fs.pathExists(utilsPath)).toBe(true)

    const result = await npxShadcn(fixturePath, [
      "remove",
      "../../fixtures/registry/example-critical.json",
    ])
    expect(result.exitCode).not.toBe(0)
    expect(await fs.pathExists(utilsPath)).toBe(true)
    expect(result.stdout + result.stderr).toMatch(/infrastructure/i)
    expect(result.stdout + result.stderr).toMatch(/--force/i)
  })

  it("should delete critical files with --force", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])

    const utilsPath = path.join(fixturePath, "lib/utils.ts")
    expect(await fs.pathExists(utilsPath)).toBe(true)

    const result = await npxShadcn(fixturePath, [
      "remove",
      "../../fixtures/registry/example-critical.json",
      "--force",
    ])
    expectCommandSuccess(result)
    expect(await fs.pathExists(utilsPath)).toBe(false)
  })

  it("should preview deletion under --dry-run without touching files", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, ["add", "button"])

    const buttonPath = path.join(fixturePath, "components/ui/button.tsx")

    const result = await npxShadcn(fixturePath, [
      "remove",
      "button",
      "--dry-run",
    ])
    expectCommandSuccess(result)
    expect(await fs.pathExists(buttonPath)).toBe(true)
    expect(result.stdout).toMatch(/components\/ui\/button/)
  })

  it("should exit non-zero for unknown component", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])

    const result = await npxShadcn(fixturePath, [
      "remove",
      "definitely-not-a-real-component-xyz",
    ])
    expect(result.exitCode).not.toBe(0)
  })

  it("should remove a component referenced by URL", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    const url = `${getRegistryUrl()}/styles/new-york-v4/button.json`
    await npxShadcn(fixturePath, ["add", url])

    const buttonPath = path.join(fixturePath, "components/ui/button.tsx")
    expect(await fs.pathExists(buttonPath)).toBe(true)

    const result = await npxShadcn(fixturePath, ["remove", url])
    expectCommandSuccess(result)
    expect(await fs.pathExists(buttonPath)).toBe(false)
  })

  it("should warn when no files for a component are found at expected paths", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])

    const result = await npxShadcn(fixturePath, ["remove", "button"])
    expectCommandSuccess(result)
    expect(result.stdout + result.stderr).toMatch(/no files found/i)
  })

  it("should print info notices for transitive registry and npm deps", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, ["add", "dialog"])

    const result = await npxShadcn(fixturePath, ["remove", "dialog"])
    expectCommandSuccess(result)
    expect(result.stdout).toMatch(/registry components/i)
    expect(result.stdout).toMatch(/npm packages/i)
  })

  it("should silence normal output under --silent", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])
    await npxShadcn(fixturePath, ["add", "button"])

    const result = await npxShadcn(fixturePath, [
      "remove",
      "button",
      "--silent",
    ])
    expectCommandSuccess(result)
    expect(result.stdout.trim()).toBe("")
  })
})
