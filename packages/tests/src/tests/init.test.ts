import path from "path"
import fs from "fs-extra"
import { describe, expect, it } from "vitest"

import {
  createFixtureTestDirectory,
  fileExists,
  npxShadcn,
  readJson,
} from "../utils/helpers"

describe.concurrent("shadcn init - next-app", () => {
  it("should init with default configuration", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    const result = await npxShadcn(fixturePath, ["init", "--base-color=neutral", "--yes"])
    
    if (process.env.CI) {
      console.log("Test: should init with default configuration")
      console.log("Fixture path:", fixturePath)
      console.log("CLI exit code:", result.exitCode)
      console.log("CLI stdout:", result.stdout)
      console.log("Files in fixture:", await fs.readdir(fixturePath))
    }

    const componentsJsonPath = path.join(fixturePath, "components.json")
    expect(result.exitCode).toBe(0)
    expect(await fileExists(componentsJsonPath)).toBe(true)

    const componentsJson = await readJson(componentsJsonPath)
    expect(componentsJson).toMatchObject({
      style: "new-york",
      rsc: true,
      tsx: true,
      tailwind: {
        config: "",
        css: "app/globals.css",
        baseColor: "neutral",
        cssVariables: true,
      },
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
        ui: "@/components/ui",
        lib: "@/lib",
        hooks: "@/hooks",
      },
    })

    expect(await fileExists(path.join(fixturePath, "lib/utils.ts"))).toBe(true)

    const cssPath = path.join(fixturePath, "app/globals.css")
    const cssContent = await fs.readFile(cssPath, "utf-8")
    expect(cssContent).toContain("@layer base")
    expect(cssContent).toContain(":root")
    expect(cssContent).toContain(".dark")
    expect(cssContent).toContain("tw-animate-css")
    expect(cssContent).toContain("--background")
    expect(cssContent).toContain("--foreground")
  })

  it("should init with custom base color", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    const result = await npxShadcn(fixturePath, ["init", "--base-color=zinc", "--yes"])
    
    expect(result.exitCode).toBe(0)
    const componentsJson = await readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.style).toBe("new-york")
    expect(componentsJson.tailwind.baseColor).toBe("zinc")
  })

  it("should init without CSS variables", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    const result = await npxShadcn(fixturePath, [
      "init",
      "--base-color=stone",
      "--no-css-variables",
      "--yes",
    ])
    
    expect(result.exitCode).toBe(0)
    const componentsJson = await readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.tailwind.cssVariables).toBe(false)

    const cssPath = path.join(fixturePath, "app/globals.css")
    const cssContent = await fs.readFile(cssPath, "utf-8")
    expect(cssContent).not.toContain("--background")
    expect(cssContent).not.toContain("--foreground")
  })

  it("should init with components", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    const result = await npxShadcn(fixturePath, ["init", "--base-color=neutral", "--yes", "button"])
    
    if (process.env.CI) {
      console.log("Test: should init with components")
      console.log("Fixture path:", fixturePath)
      console.log("CLI exit code:", result.exitCode)
      console.log("CLI stdout:", result.stdout)
      console.log("Files in components/ui:", await fs.readdir(path.join(fixturePath, "components/ui")).catch(() => "Directory not found"))
    }

    expect(result.exitCode).toBe(0)
    expect(
      await fileExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
  })
})
