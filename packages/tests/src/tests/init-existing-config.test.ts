import path from "path"
import fs from "fs-extra"
import { describe, expect, it } from "vitest"

import { createFixtureTestDirectory, npxShadcn } from "../utils/helpers"

describe("shadcn init - existing components.json", () => {
  it.skip("should override existing components.json when using --force", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")

    await npxShadcn(fixturePath, ["init", "--defaults"])

    const componentsJsonPath = path.join(fixturePath, "components.json")
    const config = await fs.readJson(componentsJsonPath)
    config.style = "custom-style"
    await fs.writeJson(componentsJsonPath, config)

    await npxShadcn(fixturePath, ["init", "--force", "--defaults"])

    const newConfig = await fs.readJson(componentsJsonPath)
    expect(newConfig.style).toBe("new-york")
    expect(newConfig.tailwind.baseColor).toBe("neutral")
    expect(await fs.pathExists(componentsJsonPath + ".bak")).toBe(false)
  })

  it("should restore backup components.json on error", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")

    const existingConfig = {
      $schema: "https://ui.shadcn.com/schema.json",
      style: "default",
      tailwind: {
        css: "app/globals.css",
        baseColor: "zinc",
        cssVariables: false,
      },
      rsc: true,
      tsx: true,
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
      },
    }
    const componentsJsonPath = path.join(fixturePath, "components.json")
    await fs.writeJson(componentsJsonPath, existingConfig)

    await npxShadcn(fixturePath, [
      "init",
      "--force",
      "invalid-component-that-does-not-exist",
    ])

    expect(await fs.pathExists(componentsJsonPath)).toBe(true)
    const newConfig = await fs.readJson(componentsJsonPath)
    expect(newConfig).toMatchObject(existingConfig)
    expect(await fs.pathExists(componentsJsonPath + ".bak")).toBe(false)
  }, 300000)

  it("should preserve registries in components.json when using --force", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")

    await npxShadcn(fixturePath, ["init", "--defaults"])

    const componentsJsonPath = path.join(fixturePath, "components.json")
    const config = await fs.readJson(componentsJsonPath)
    config.registries = {
      "my-registry": { url: "https://example.com/r" },
    }
    await fs.writeJson(componentsJsonPath, config)

    await npxShadcn(fixturePath, ["init", "--force", "--defaults"])

    expect(await fs.pathExists(componentsJsonPath)).toBe(true)
    expect(await fs.pathExists(componentsJsonPath + ".bak")).toBe(false)

    const newConfig = await fs.readJson(componentsJsonPath)
    expect(newConfig.registries).toMatchObject({
      "my-registry": { url: "https://example.com/r" },
    })

    expect(newConfig.style).toBe("base-nova")
    expect(newConfig.tailwind.baseColor).toBe("neutral")
  }, 300000)
})
