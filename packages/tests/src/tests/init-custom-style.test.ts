import path from "path"
import fs from "fs-extra"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import {
  createFixtureTestDirectory,
  cssHasProperties,
  npxShadcn,
} from "../utils/helpers"
import { createRegistryServer } from "../utils/registry"

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

describe("shadcn init - custom style", () => {
  it("should init with style that extends shadcn", async () => {
    const fixturePath = await createFixtureTestDirectory("next-app")
    await npxShadcn(fixturePath, ["init", "http://localhost:4445/r/style.json"])

    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.style).toBe("new-york")
    expect(componentsJson.tailwind.baseColor).toBe("neutral")

    expect(await fs.pathExists(path.join(fixturePath, "lib/utils.ts"))).toBe(
      true
    )

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

    expect(await fs.pathExists(path.join(fixturePath, "lib/utils.ts"))).toBe(
      true
    )

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

    const componentsJson = await fs.readJson(
      path.join(fixturePath, "components.json")
    )
    expect(componentsJson.style).toBe("new-york")
    expect(componentsJson.tailwind.baseColor).toBe("neutral")

    expect(await fs.pathExists(path.join(fixturePath, "lib/utils.ts"))).toBe(
      false
    )

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
