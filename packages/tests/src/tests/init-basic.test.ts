import path from "path"
import fs from "fs-extra"
import { describe, expect, it } from "vitest"

import {
  createFixtureTestDirectory,
  cssHasProperties,
  npxShadcn,
} from "../utils/helpers"

describe("shadcn init - next-app", () => {
  it("should init with default configuration", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])

    const componentsJsonPath = path.join(fixturePath, "components.json")
    expect(await fs.pathExists(componentsJsonPath)).toBe(true)

    const componentsJson = await fs.readJson(componentsJsonPath)
    expect(componentsJson).toMatchObject({
      style: "base-nova",
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

  it("should init without CSS variables", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults", "--no-css-variables"])

    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.tailwind.cssVariables).toBe(false)
  })

  it("should init with components", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults", "button"], {
      timeout: 300000,
    })

    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
  }, 300000)
})

describe("shadcn init - vite-app", () => {
  it("should init with custom alias and src", async () => {
    const fixturePath = await createFixtureTestDirectory("vite-app")
    await npxShadcn(fixturePath, ["init", "--defaults", "alert-dialog"])

    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.style).toBe("base-nova")
    expect(componentsJson.tailwind.baseColor).toBe("neutral")
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
      'import { Button } from "#custom/components/ui/button"'
    )
    expect(alertDialogContent).toContain(
      'import { cn } from "#custom/lib/utils"'
    )
  })
})

describe("shadcn init - unsupported framework", () => {
  it("should init with --defaults on unsupported framework", async () => {
    const fixturePath = await createFixtureTestDirectory("remix-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])

    const componentsJsonPath = path.join(fixturePath, "components.json")
    expect(await fs.pathExists(componentsJsonPath)).toBe(true)

    const componentsJson = await fs.readJson(componentsJsonPath)
    expect(componentsJson).toMatchObject({
      style: "base-nova",
      tailwind: {
        baseColor: "neutral",
        cssVariables: true,
      },
    })

    expect(await fs.pathExists(path.join(fixturePath, "lib/utils.ts"))).toBe(
      true
    )
  })

  it("should init with --defaults and components on unsupported framework", async () => {
    const fixturePath = await createFixtureTestDirectory("remix-app")
    await npxShadcn(fixturePath, ["init", "--defaults", "button"])

    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)

    const cssPath = path.join(fixturePath, "app/globals.css")
    const cssContent = await fs.readFile(cssPath, "utf-8")
    expect(cssContent).toContain("@layer base")
    expect(cssContent).toContain("--background")
    expect(cssContent).toContain("--foreground")
  })
})

describe("shadcn init - template flag", () => {
  it("should reject invalid template", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    const result = await npxShadcn(fixturePath, ["init", "-t", "invalid"])

    expect(result.exitCode).toBe(1)
    expect(result.stdout).toContain("Invalid template")
  })

  it("should accept valid template with --defaults", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "-t", "next", "--defaults"])

    const componentsJsonPath = path.join(fixturePath, "components.json")
    expect(await fs.pathExists(componentsJsonPath)).toBe(true)

    const componentsJson = await fs.readJson(componentsJsonPath)
    expect(componentsJson.style).toBe("base-nova")
    expect(componentsJson.tailwind.baseColor).toBe("neutral")
  })
})

describe("shadcn init - rtl flags", () => {
  it("should set rtl to true with --rtl", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults", "--rtl"])

    const componentsJsonPath = path.join(fixturePath, "components.json")
    const componentsJson = await fs.readJson(componentsJsonPath)
    expect(componentsJson.rtl).toBe(true)
  })

  it("should set rtl to false with --no-rtl", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults", "--no-rtl"])

    const componentsJsonPath = path.join(fixturePath, "components.json")
    const componentsJson = await fs.readJson(componentsJsonPath)
    expect(componentsJson.rtl).toBe(false)
  })

  it("should default rtl to false when no flag is passed", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--defaults"])

    const componentsJsonPath = path.join(fixturePath, "components.json")
    const componentsJson = await fs.readJson(componentsJsonPath)
    expect(componentsJson.rtl).toBe(false)
  })
})

describe("shadcn init - deprecated --src-dir", () => {
  it("should reject --src-dir as unknown option", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    const result = await npxShadcn(fixturePath, [
      "init",
      "--defaults",
      "--src-dir",
    ])

    expect(result.exitCode).toBe(1)
  })
})
