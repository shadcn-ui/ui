import path from "path"
import fs from "fs-extra"
import { describe, expect, it } from "vitest"

import { createFixtureTestDirectory, npxShadcn } from "../utils/helpers"

describe("shadcn init - next-app", () => {
  it("should init with default configuration", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])

    const componentsJsonPath = path.join(fixturePath, "components.json")
    expect(await fs.pathExists(componentsJsonPath)).toBe(true)

    const componentsJson = await fs.readJson(componentsJsonPath)
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

    expect(await fs.pathExists(path.join(fixturePath, "lib/utils.ts"))).toBe(
      true
    )

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
    await npxShadcn(fixturePath, ["init", "--base-color=zinc"])

    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.style).toBe("new-york")
    expect(componentsJson.tailwind.baseColor).toBe("zinc")
  })

  it("should init without CSS variables", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, [
      "init",
      "--base-color=stone",
      "--no-css-variables",
    ])

    const componentsJson = await fs.readJson(
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
    await npxShadcn(fixturePath, ["init", "--base-color=neutral", "button"])

    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
  })
})

describe("shadcn init - vite-app", () => {
  it("should init with custom alias and src", async () => {
    const fixturePath = await createFixtureTestDirectory("vite-app")
    await npxShadcn(fixturePath, ["init", "--base-color=gray", "alert-dialog"])

    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.style).toBe("new-york")
    expect(componentsJson.tailwind.baseColor).toBe("gray")
    expect(componentsJson.aliases).toMatchObject({
      components: "#custom/components",
      utils: "#custom/lib/utils",
      ui: "#custom/components/ui",
      lib: "#custom/lib",
      hooks: "#custom/hooks",
    })

    expect(
      await fs.pathExists(
        path.join(fixturePath, "src/components/ui/alert-dialog.tsx")
      )
    ).toBe(true)

    expect(
      await fs.pathExists(
        path.join(fixturePath, "src/components/ui/button.tsx")
      )
    ).toBe(true)

    const alertDialogContent = await fs.readFile(
      path.join(fixturePath, "src/components/ui/alert-dialog.tsx"),
      "utf-8"
    )
    expect(alertDialogContent).toContain(
      'import { buttonVariants } from "#custom/components/ui/button"'
    )
    expect(alertDialogContent).toContain(
      'import { cn } from "#custom/lib/utils"'
    )
  })
})
