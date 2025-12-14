import path from "path"
import fs from "fs-extra"
import { describe, expect, it } from "vitest"

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

  it("should init with --no-base-style", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "--no-base-style"])

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

    // The css file should only have tailwind imports.
    expect(
      await fs.readFile(path.join(fixturePath, "app/globals.css"), "utf-8")
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";
      "
    `)
  })

  it("should init with custom style and --no-base-style", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, [
      "init",
      "http://localhost:4445/r/style-extended.json",
      "--no-base-style",
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

describe("shadcn init - existing components.json", () => {
  it("should override existing components.json when using --force", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")

    // Run init with default configuration.
    await npxShadcn(fixturePath, ["init", "--base-color=neutral"])

    // Override style in components.json.
    const componentsJsonPath = path.join(fixturePath, "components.json")
    const config = await fs.readJson(componentsJsonPath)
    config.style = "custom-style"
    await fs.writeJson(componentsJsonPath, config)

    // Reinit with --force and different base color.
    await npxShadcn(fixturePath, ["init", "--force", "--base-color=zinc"])

    const newConfig = await fs.readJson(componentsJsonPath)
    expect(newConfig.style).toBe("new-york")
    expect(newConfig.tailwind.baseColor).toBe("zinc")
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

    // Run init with an invalid component - this should fail and restore
    await npxShadcn(fixturePath, [
      "init",
      "invalid-component-that-does-not-exist",
    ])

    expect(await fs.pathExists(componentsJsonPath)).toBe(true)
    const newConfig = await fs.readJson(componentsJsonPath)
    expect(newConfig).toMatchObject(existingConfig)
    expect(await fs.pathExists(componentsJsonPath + ".bak")).toBe(false)
  })
})
