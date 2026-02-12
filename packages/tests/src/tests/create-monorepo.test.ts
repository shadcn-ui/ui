import path from "path"
import fs from "fs-extra"
import { describe, expect, it } from "vitest"

import { cssHasProperties, npxShadcn } from "../utils/helpers"
import { TEMP_DIR } from "../utils/setup"

// These tests download the monorepo template from GitHub and install dependencies.
// They require network access and a running local registry at REGISTRY_URL.
describe("shadcn create - next-monorepo", () => {
  it("should create a monorepo project with preset", async () => {
    const projectName = `test-monorepo-preset-${process.pid}`

    const result = await npxShadcn(
      TEMP_DIR,
      [
        "create",
        projectName,
        "--template",
        "next-monorepo",
        "--preset",
        "radix-nova",
      ],
      { timeout: 120000 }
    )

    const projectPath = path.join(TEMP_DIR, projectName)

    // Verify project structure exists.
    expect(await fs.pathExists(projectPath)).toBe(true)
    expect(
      await fs.pathExists(path.join(projectPath, "packages/ui/components.json"))
    ).toBe(true)
    expect(
      await fs.pathExists(path.join(projectPath, "apps/web/components.json"))
    ).toBe(true)

    // Verify packages/ui/components.json is updated with preset config.
    const uiConfig = await fs.readJson(
      path.join(projectPath, "packages/ui/components.json")
    )
    expect(uiConfig.style).toBe("radix-nova")
    expect(uiConfig.iconLibrary).toBe("hugeicons")
    expect(uiConfig.tailwind.css).toBe("src/styles/globals.css")
    expect(uiConfig.tailwind.baseColor).toBe("neutral")
    expect(uiConfig.tailwind.cssVariables).toBe(true)
    expect(uiConfig.aliases.components).toBe("@workspace/ui/components")
    expect(uiConfig.aliases.utils).toBe("@workspace/ui/lib/utils")

    // Verify apps/web/components.json is updated with preset config.
    const webConfig = await fs.readJson(
      path.join(projectPath, "apps/web/components.json")
    )
    expect(webConfig.style).toBe("radix-nova")
    expect(webConfig.iconLibrary).toBe("hugeicons")
    expect(webConfig.tailwind.css).toBe(
      "../../packages/ui/src/styles/globals.css"
    )
    expect(webConfig.tailwind.baseColor).toBe("neutral")
    // Verify workspace aliases are preserved.
    expect(webConfig.aliases.components).toBe("@/components")
    expect(webConfig.aliases.utils).toBe("@workspace/ui/lib/utils")
    expect(webConfig.aliases.ui).toBe("@workspace/ui/components")

    // Verify CSS was applied to packages/ui.
    const cssPath = path.join(projectPath, "packages/ui/src/styles/globals.css")
    expect(await fs.pathExists(cssPath)).toBe(true)
    const cssContent = await fs.readFile(cssPath, "utf-8")
    expect(cssContent).toContain("@layer base")
    expect(cssContent).toContain(":root")
    expect(cssContent).toContain(".dark")
    expect(cssContent).toContain("--background")
    expect(cssContent).toContain("--foreground")
    expect(cssContent).toContain("--primary")

    // Verify component-example was added to apps/web.
    expect(
      await fs.pathExists(
        path.join(projectPath, "apps/web/components/component-example.tsx")
      )
    ).toBe(true)

    // Verify page.tsx was written.
    const pageContent = await fs.readFile(
      path.join(projectPath, "apps/web/app/page.tsx"),
      "utf-8"
    )
    expect(pageContent).toContain("ComponentExample")
    expect(pageContent).toContain(
      'import { ComponentExample } from "@/components/component-example"'
    )
  })

  it("should create a monorepo with custom base color and font", async () => {
    const projectName = `test-monorepo-custom-${process.pid}`

    // Use radix-maia preset which has figtree font and hugeicons.
    const result = await npxShadcn(
      TEMP_DIR,
      [
        "create",
        projectName,
        "--template",
        "next-monorepo",
        "--preset",
        "radix-maia",
      ],
      { timeout: 120000 }
    )

    const projectPath = path.join(TEMP_DIR, projectName)
    expect(await fs.pathExists(projectPath)).toBe(true)

    // Verify preset config is applied to both components.json files.
    const uiConfig = await fs.readJson(
      path.join(projectPath, "packages/ui/components.json")
    )
    expect(uiConfig.style).toBe("radix-maia")
    expect(uiConfig.iconLibrary).toBe("hugeicons")
    expect(uiConfig.tailwind.baseColor).toBe("neutral")

    const webConfig = await fs.readJson(
      path.join(projectPath, "apps/web/components.json")
    )
    expect(webConfig.style).toBe("radix-maia")
    expect(webConfig.iconLibrary).toBe("hugeicons")

    // Verify CSS file has theme variables.
    const cssPath = path.join(projectPath, "packages/ui/src/styles/globals.css")
    const cssContent = await fs.readFile(cssPath, "utf-8")
    expect(cssContent).toContain("@layer base")
    expect(cssContent).toContain(":root")
    expect(cssContent).toContain(".dark")
    expect(cssContent).toContain("--background")
    expect(cssContent).toContain("--foreground")

    // Verify font registry dependency was installed (figtree font).
    expect(cssContent).toContain("--font-sans")
  })

  it("should create a monorepo with custom preset url", async () => {
    const projectName = `test-monorepo-url-${process.pid}`

    // Build a custom init URL with specific options.
    const registryUrl = process.env.REGISTRY_URL || "http://localhost:4000/r"
    const baseUrl = registryUrl.replace(/\/r\/?$/, "")
    const initUrl = `${baseUrl}/init?base=radix&style=nova&baseColor=zinc&theme=zinc&iconLibrary=lucide&font=inter&rtl=false&menuAccent=subtle&menuColor=default&radius=default&template=next`

    const result = await npxShadcn(
      TEMP_DIR,
      [
        "create",
        projectName,
        "--template",
        "next-monorepo",
        "--preset",
        initUrl,
      ],
      { timeout: 120000 }
    )

    const projectPath = path.join(TEMP_DIR, projectName)
    expect(await fs.pathExists(projectPath)).toBe(true)

    // Verify config reflects the custom URL params.
    const uiConfig = await fs.readJson(
      path.join(projectPath, "packages/ui/components.json")
    )
    expect(uiConfig.style).toBe("radix-nova")
    expect(uiConfig.iconLibrary).toBe("lucide")
    expect(uiConfig.tailwind.baseColor).toBe("zinc")

    const webConfig = await fs.readJson(
      path.join(projectPath, "apps/web/components.json")
    )
    expect(webConfig.style).toBe("radix-nova")
    expect(webConfig.tailwind.baseColor).toBe("zinc")

    // Verify CSS has zinc color theme applied.
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

    // Verify component-example and page.tsx.
    expect(
      await fs.pathExists(
        path.join(projectPath, "apps/web/components/component-example.tsx")
      )
    ).toBe(true)
    const pageContent = await fs.readFile(
      path.join(projectPath, "apps/web/app/page.tsx"),
      "utf-8"
    )
    expect(pageContent).toContain("ComponentExample")
  })
})
