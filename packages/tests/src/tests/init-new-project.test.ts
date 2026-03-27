import os from "os"
import path from "path"
import fs from "fs-extra"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { cssHasProperties, npxShadcn } from "../utils/helpers"

describe("shadcn init - --name flag", () => {
  let testBaseDir: string

  beforeAll(async () => {
    testBaseDir = path.join(os.tmpdir(), `shadcn-name-test-${process.pid}`)
    await fs.ensureDir(testBaseDir)
  })

  afterAll(async () => {
    await fs.remove(testBaseDir)
  })

  it("should create a new project with the specified name", async () => {
    const projectName = "my-named-app"
    const emptyDir = path.join(testBaseDir, "empty-next")
    await fs.ensureDir(emptyDir)

    await npxShadcn(emptyDir, ["init", "--defaults", "--name", projectName], {
      timeout: 120000,
    })

    const projectPath = path.join(emptyDir, projectName)

    expect(await fs.pathExists(projectPath)).toBe(true)
    expect(await fs.pathExists(path.join(projectPath, "package.json"))).toBe(
      true
    )

    const componentsJsonPath = path.join(projectPath, "components.json")
    expect(await fs.pathExists(componentsJsonPath)).toBe(true)

    expect(
      await fs.pathExists(
        path.join(projectPath, "components/theme-provider.tsx")
      )
    ).toBe(true)
  })

  it("should create a new project with --name and -t vite", async () => {
    const projectName = "my-vite-app"
    const emptyDir = path.join(testBaseDir, "empty-vite")
    await fs.ensureDir(emptyDir)

    await npxShadcn(
      emptyDir,
      ["init", "--defaults", "--name", projectName, "-t", "vite"],
      { timeout: 120000 }
    )

    const projectPath = path.join(emptyDir, projectName)

    expect(await fs.pathExists(projectPath)).toBe(true)

    const packageJson = await fs.readJson(
      path.join(projectPath, "package.json")
    )
    expect(packageJson.name).toBe(projectName)
    expect(packageJson.dependencies).toHaveProperty("react")
  })
})

describe("shadcn init - next-monorepo", () => {
  let testBaseDir: string

  beforeAll(async () => {
    testBaseDir = path.join(os.tmpdir(), `shadcn-monorepo-test-${process.pid}`)
    await fs.ensureDir(testBaseDir)
  })

  afterAll(async () => {
    await fs.remove(testBaseDir)
  })

  it("should create a monorepo with preset", async () => {
    const projectName = `test-monorepo-preset-${process.pid}`

    const result = await npxShadcn(
      testBaseDir,
      [
        "init",
        "--name",
        projectName,
        "-t",
        "next",
        "--monorepo",
        "--preset",
        "nova",
        "--base",
        "radix",
      ],
      { timeout: 300000, debug: true }
    )
    expect(result.exitCode).toBe(0)

    const projectPath = path.join(testBaseDir, projectName)

    expect(await fs.pathExists(projectPath)).toBe(true)
    expect(
      await fs.pathExists(path.join(projectPath, "packages/ui/components.json"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(projectPath, "apps/web/components.json"))
    ).toBe(true)

    const uiConfig = await fs.readJson(
      path.join(projectPath, "packages/ui/components.json")
    )
    expect(uiConfig.style).toBe("radix-nova")
    expect(uiConfig.iconLibrary).toBe("lucide")
    expect(uiConfig.tailwind.baseColor).toBe("neutral")

    const webConfig = await fs.readJson(
      path.join(projectPath, "apps/web/components.json")
    )
    expect(webConfig.style).toBe("radix-nova")
    expect(webConfig.aliases.components).toBe("@/components")
    expect(webConfig.aliases.utils).toBe("@workspace/ui/lib/utils")
    expect(webConfig.aliases.ui).toBe("@workspace/ui/components")

    const cssPath = path.join(projectPath, "packages/ui/src/styles/globals.css")
    expect(await fs.pathExists(cssPath)).toBe(true)
    const cssContent = await fs.readFile(cssPath, "utf-8")
    expect(cssContent).toContain("@layer base")
    expect(cssContent).toContain(":root")
    expect(cssContent).toContain(".dark")
    expect(cssContent).toContain("--background")
    expect(cssContent).toContain("--foreground")
    expect(cssContent).toContain("--primary")
  }, 300000)

  it("should create a monorepo with custom preset url", async () => {
    const projectName = `test-monorepo-url-${process.pid}`

    const registryUrl = process.env.REGISTRY_URL || "http://localhost:4000/r"
    const baseUrl = registryUrl.replace(/\/r\/?$/, "")
    const initUrl = `${baseUrl}/init?base=radix&style=nova&baseColor=zinc&theme=zinc&chartColor=zinc&iconLibrary=lucide&font=inter&rtl=false&menuAccent=subtle&menuColor=default&radius=default&template=next`

    const result = await npxShadcn(
      testBaseDir,
      [
        "init",
        "--name",
        projectName,
        "-t",
        "next",
        "--monorepo",
        "--preset",
        initUrl,
      ],
      { timeout: 300000 }
    )
    expect(result.exitCode).toBe(0)

    const projectPath = path.join(testBaseDir, projectName)
    expect(await fs.pathExists(projectPath)).toBe(true)

    const uiConfig = await fs.readJson(
      path.join(projectPath, "packages/ui/components.json")
    )
    expect(uiConfig.style).toBe("radix-nova")
    expect(uiConfig.iconLibrary).toBe("lucide")
    expect(uiConfig.tailwind.baseColor).toBe("neutral")

    const webConfig = await fs.readJson(
      path.join(projectPath, "apps/web/components.json")
    )
    expect(webConfig.style).toBe("radix-nova")
    expect(webConfig.tailwind.baseColor).toBe("neutral")

    const cssPath = path.join(projectPath, "packages/ui/src/styles/globals.css")
    const cssContent = await fs.readFile(cssPath, "utf-8")
    expect(cssContent).toContain(":root")
    expect(cssContent).toContain(".dark")
    expect(cssContent).toContain("--background")
    expect(cssContent).toContain("--foreground")
    expect(
      cssHasProperties(cssContent, [
        {
          selector: ":root",
          properties: {
            "--background": "oklch(1 0 0)",
          },
        },
      ])
    ).toBe(true)
  }, 300000)
})
