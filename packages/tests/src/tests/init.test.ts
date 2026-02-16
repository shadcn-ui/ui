import os from "os"
import path from "path"
import fs from "fs-extra"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import {
  createFixtureTestDirectory,
  cssHasProperties,
  npxShadcn,
} from "../utils/helpers"
import { createRegistryServer } from "../utils/registry"

describe("shadcn init - next-app", () => {
  it("should init with default configuration", async () => {
    // Sleep for 1 second to avoid race condition with the registry server.
    await new Promise((resolve) => setTimeout(resolve, 2000))

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
    await npxShadcn(fixturePath, ["init", "--defaults", "button"])

    expect(
      await fs.pathExists(path.join(fixturePath, "components/ui/button.tsx"))
    ).toBe(true)
  })
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

describe("shadcn init - custom style", async () => {
  const customRegistry = await createRegistryServer(
    [
      {
        name: "style",
        type: "registry:style",
        files: [
          {
            path: "path/to/foo.ts",
            content: "const foo = 'bar'",
            type: "registry:lib",
          },
        ],
        cssVars: {
          theme: {
            "font-sans": "DM Sans, sans-serif",
          },
          light: {
            primary: "#dc2626",
            "foo-var": "3rem",
          },
          dark: {
            "custom-brand": "#fef3c7",
            "foo-var": "1rem",
          },
        },
      },
      {
        name: "style-extended",
        type: "registry:style",
        registryDependencies: ["http://localhost:4445/r/style.json"],
        files: [
          {
            path: "path/to/foo.ts",
            content: "const foo = 'baz-qux'",
            type: "registry:lib",
          },
        ],
        cssVars: {
          theme: {
            "font-sans": "Geist Sans, sans-serif",
            "font-mono": "Geist Mono, monospace",
          },
          light: {
            primary: "#059669",
            secondary: "#06b6d4",
          },
          dark: {
            "foo-var": "2rem",
          },
        },
      },
      {
        name: "style-extend-none",
        type: "registry:style",
        extends: "none",
        registryDependencies: ["http://localhost:4445/r/style.json"],
        files: [
          {
            path: "path/to/foo.ts",
            content: "const foo = 'baz-qux'",
            type: "registry:lib",
          },
        ],
        cssVars: {
          theme: {
            "font-sans": "Geist Sans, sans-serif",
            "font-mono": "Geist Mono, monospace",
          },
          light: {
            primary: "#059669",
            secondary: "#06b6d4",
          },
          dark: {
            "foo-var": "2rem",
          },
        },
      },
    ],
    {
      port: 4445,
    }
  )

  beforeAll(async () => {
    await customRegistry.start()
  })

  afterAll(async () => {
    await customRegistry.stop()
  })

  it("should init with style that extends shadcn", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "http://localhost:4445/r/style.json"])

    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.style).toBe("new-york")
    expect(componentsJson.tailwind.baseColor).toBe("neutral")

    // Install utils from shadcn.
    expect(await fs.pathExists(path.join(fixturePath, "lib/utils.ts"))).toBe(
      true
    )

    // Then add foo.ts from the custom registry.
    expect(
      await fs.readFile(path.join(fixturePath, "lib/foo.ts"), "utf-8")
    ).toBe("const foo = 'bar'")

    const globalCssContent = await fs.readFile(
      path.join(fixturePath, "app/globals.css"),
      "utf-8"
    )
    expect(globalCssContent).toContain("@layer base")
    expect(globalCssContent).toContain(":root")
    expect(globalCssContent).toContain(".dark")
    expect(globalCssContent).toContain("tw-animate-css")
    expect(
      cssHasProperties(globalCssContent, [
        {
          selector: "@theme inline",
          properties: {
            "--font-sans": "DM Sans, sans-serif",
            "--color-custom-brand": "var(--custom-brand)",
            "--foo-var": "var(--foo-var)",
          },
        },
        {
          selector: ":root",
          properties: {
            "--background": "oklch(1 0 0)",
            "--foreground": "oklch(0.145 0 0)",
            "--primary": "#dc2626",
            "--foo-var": "3rem",
          },
        },
        {
          selector: ".dark",
          properties: {
            "--background": "oklch(0.145 0 0)",
            "--foreground": "oklch(0.985 0 0)",
            "--primary": "oklch(0.922 0 0)",
            "--custom-brand": "#fef3c7",
            "--foo-var": "1rem",
          },
        },
      ])
    ).toBe(true)
  })

  it("should init with style that extends another style", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, [
      "init",
      "http://localhost:4445/r/style-extended.json",
    ])

    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.style).toBe("new-york")
    expect(componentsJson.tailwind.baseColor).toBe("neutral")

    // Install utils from shadcn.
    expect(await fs.pathExists(path.join(fixturePath, "lib/utils.ts"))).toBe(
      true
    )

    // Then add foo.ts from the custom registry with overriden payload.
    expect(
      await fs.readFile(path.join(fixturePath, "lib/foo.ts"), "utf-8")
    ).toBe("const foo = 'baz-qux'")

    const globalCssContent = await fs.readFile(
      path.join(fixturePath, "app/globals.css"),
      "utf-8"
    )

    expect(globalCssContent).toContain("@layer base")
    expect(globalCssContent).toContain(":root")
    expect(globalCssContent).toContain(".dark")
    expect(globalCssContent).toContain("tw-animate-css")

    expect(
      cssHasProperties(globalCssContent, [
        {
          selector: "@theme inline",
          properties: {
            "--font-sans": "Geist Sans, sans-serif",
            "--font-mono": "Geist Mono, monospace",
            "--color-custom-brand": "var(--custom-brand)",
            "--foo-var": "var(--foo-var)",
          },
        },
        {
          selector: ":root",
          properties: {
            "--background": "oklch(1 0 0)",
            "--foreground": "oklch(0.145 0 0)",
            "--primary": "#059669",
            "--secondary": "#06b6d4",
            "--foo-var": "3rem",
          },
        },
        {
          selector: ".dark",
          properties: {
            "--background": "oklch(0.145 0 0)",
            "--foreground": "oklch(0.985 0 0)",
            "--primary": "oklch(0.922 0 0)",
            "--custom-brand": "#fef3c7",
            "--foo-var": "2rem",
          },
        },
      ])
    ).toBe(true)
  })

  it("should init with custom style extended none", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, [
      "init",
      "http://localhost:4445/r/style-extend-none.json",
    ])

    // We still expect components.json to be created.
    // With some defaults.
    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.style).toBe("new-york")
    expect(componentsJson.tailwind.baseColor).toBe("neutral")

    // No utils should be installed.
    expect(await fs.pathExists(path.join(fixturePath, "lib/utils.ts"))).toBe(
      false
    )

    // But we should have the foo.ts from the custom style.
    expect(
      await fs.readFile(path.join(fixturePath, "lib/foo.ts"), "utf-8")
    ).toBe("const foo = 'baz-qux'")

    expect(
      await fs.readFile(path.join(fixturePath, "app/globals.css"), "utf-8")
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));

      @theme inline {
          --font-sans: Geist Sans, sans-serif;
          --font-mono: Geist Mono, monospace;
          --color-custom-brand: var(--custom-brand);
          --color-secondary: var(--secondary);
          --foo-var: var(--foo-var);
          --color-primary: var(--primary);
      }

      :root {
          --primary: #059669;
          --foo-var: 3rem;
          --secondary: #06b6d4;
      }

      .dark {
          --custom-brand: #fef3c7;
          --foo-var: 2rem;
      }
      "
    `)
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

describe("shadcn init - --name flag", () => {
  // Use os.tmpdir() to create projects outside the monorepo tree.
  // This prevents pnpm from detecting the monorepo workspace root.
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

    // Verify project was created with the correct name.
    expect(await fs.pathExists(projectPath)).toBe(true)
    expect(await fs.pathExists(path.join(projectPath, "package.json"))).toBe(
      true
    )

    // Verify components.json was created.
    const componentsJsonPath = path.join(projectPath, "components.json")
    expect(await fs.pathExists(componentsJsonPath)).toBe(true)

    // Verify theme-provider is included from the template.
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

    // Verify project was created.
    expect(await fs.pathExists(projectPath)).toBe(true)

    // Verify it's a vite project with the correct name.
    const packageJson = await fs.readJson(
      path.join(projectPath, "package.json")
    )
    expect(packageJson.name).toBe(projectName)
    expect(packageJson.dependencies).toHaveProperty("react")
  })
})

describe("shadcn init - next-monorepo", () => {
  // Use os.tmpdir() to create projects outside the monorepo tree.
  // This prevents pnpm from detecting the monorepo workspace root.
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
        "next-monorepo",
        "--preset",
        "radix-nova",
      ],
      { timeout: 300000 }
    )
    expect(result.exitCode).toBe(0)

    const projectPath = path.join(testBaseDir, projectName)

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
    expect(uiConfig.iconLibrary).toBe("lucide")
    expect(uiConfig.tailwind.baseColor).toBe("neutral")

    // Verify apps/web/components.json is updated with preset config.
    const webConfig = await fs.readJson(
      path.join(projectPath, "apps/web/components.json")
    )
    expect(webConfig.style).toBe("radix-nova")
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
  }, 300000)

  it("should create a monorepo with custom preset url", async () => {
    const projectName = `test-monorepo-url-${process.pid}`

    // Build a custom init URL with specific options.
    const registryUrl = process.env.REGISTRY_URL || "http://localhost:4000/r"
    const baseUrl = registryUrl.replace(/\/r\/?$/, "")
    const initUrl = `${baseUrl}/init?base=radix&style=nova&baseColor=zinc&theme=zinc&iconLibrary=lucide&font=inter&rtl=false&menuAccent=subtle&menuColor=default&radius=default&template=next`

    const result = await npxShadcn(
      testBaseDir,
      [
        "init",
        "--name",
        projectName,
        "-t",
        "next-monorepo",
        "--preset",
        initUrl,
      ],
      { timeout: 300000 }
    )
    expect(result.exitCode).toBe(0)

    const projectPath = path.join(testBaseDir, projectName)
    expect(await fs.pathExists(projectPath)).toBe(true)

    // Verify config reflects the custom URL params.
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
  }, 300000)
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

describe("shadcn init - existing components.json", () => {
  // TODO: Revisit --force behavior. Currently it only skips backup merge,
  // but doesn't reset config values like style. Need to decide intended behavior.
  it.skip("should override existing components.json when using --force", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")

    // Run init with default configuration.
    await npxShadcn(fixturePath, ["init", "--defaults"])

    // Override style in components.json.
    const componentsJsonPath = path.join(fixturePath, "components.json")
    const config = await fs.readJson(componentsJsonPath)
    config.style = "custom-style"
    await fs.writeJson(componentsJsonPath, config)

    // Reinit with --force.
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

    // Run init with an invalid component - this should fail and restore.
    await npxShadcn(fixturePath, [
      "init",
      "invalid-component-that-does-not-exist",
    ])

    expect(await fs.pathExists(componentsJsonPath)).toBe(true)
    const newConfig = await fs.readJson(componentsJsonPath)
    expect(newConfig).toMatchObject(existingConfig)
    expect(await fs.pathExists(componentsJsonPath + ".bak")).toBe(false)
  })

  it("should preserve registries in components.json when using --force", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")

    // Run init with default configuration.
    await npxShadcn(fixturePath, ["init", "--defaults"])

    // Inject a custom registries object into components.json.
    const componentsJsonPath = path.join(fixturePath, "components.json")
    const config = await fs.readJson(componentsJsonPath)
    config.registries = {
      "my-registry": { url: "https://example.com/r" },
    }
    await fs.writeJson(componentsJsonPath, config)

    // Reinit with --force.
    await npxShadcn(fixturePath, ["init", "--force", "--defaults"])

    // components.json should exist with no .bak leftover.
    expect(await fs.pathExists(componentsJsonPath)).toBe(true)
    expect(await fs.pathExists(componentsJsonPath + ".bak")).toBe(false)

    // The custom registry should be preserved.
    const newConfig = await fs.readJson(componentsJsonPath)
    expect(newConfig.registries).toMatchObject({
      "my-registry": { url: "https://example.com/r" },
    })

    // Other config values should be from the fresh init.
    expect(newConfig.style).toBe("base-nova")
    expect(newConfig.tailwind.baseColor).toBe("neutral")
  })
})
