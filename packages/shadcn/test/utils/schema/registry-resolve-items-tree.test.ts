import { afterAll, beforeAll, describe, expect, test, vi } from "vitest"

import { createRegistryServer } from "../../../../tests/src/utils/registry"
import { registryResolveItemsTree } from "../../../src/registry/api"

describe("registryResolveItemTree", () => {
  test("should resolve items tree", async () => {
    expect(
      await registryResolveItemsTree(["button"], {
        style: "new-york",
        tailwind: {
          baseColor: "stone",
        },
      })
    ).toMatchSnapshot()
  })

  test("should resolve multiple items tree", async () => {
    expect(
      await registryResolveItemsTree(["button", "input", "command"], {
        style: "default",
        tailwind: {
          baseColor: "zinc",
        },
      })
    ).toMatchSnapshot()
  })

  test("should resolve index", async () => {
    expect(
      await registryResolveItemsTree(["index", "label"], {
        style: "default",
        tailwind: {
          baseColor: "zinc",
        },
      })
    ).toMatchSnapshot()
  })
})

describe("registryResolveItemTree - dependency ordering", () => {
  let customRegistry: Awaited<ReturnType<typeof createRegistryServer>>

  beforeAll(async () => {
    // Create a custom registry server for testing dependency ordering
    customRegistry = await createRegistryServer(
      [
        {
          name: "base-component",
          type: "registry:ui",
          files: [
            {
              path: "components/ui/base.tsx",
              content: "export const Base = () => <div>Base Component</div>",
              type: "registry:ui",
            },
          ],
          cssVars: {
            light: { base: "#111111" },
          },
        },
        {
          name: "extended-component",
          type: "registry:ui",
          registryDependencies: ["http://localhost:4447/r/base-component.json"],
          files: [
            {
              path: "components/ui/extended.tsx",
              content:
                "export const Extended = () => <div>Extended Component</div>",
              type: "registry:ui",
            },
          ],
          cssVars: {
            light: { extended: "#222222" },
          },
        },
        {
          name: "deep-component",
          type: "registry:ui",
          registryDependencies: [
            "http://localhost:4447/r/extended-component.json",
          ],
          files: [
            {
              path: "components/ui/deep.tsx",
              content: "export const Deep = () => <div>Deep Component</div>",
              type: "registry:ui",
            },
          ],
        },
        // Circular dependency test
        {
          name: "circular-a",
          type: "registry:ui",
          registryDependencies: ["http://localhost:4447/r/circular-b.json"],
          files: [
            {
              path: "components/ui/circular-a.tsx",
              content: "export const CircularA = () => <div>A</div>",
              type: "registry:ui",
            },
          ],
        },
        {
          name: "circular-b",
          type: "registry:ui",
          registryDependencies: ["http://localhost:4447/r/circular-a.json"],
          files: [
            {
              path: "components/ui/circular-b.tsx",
              content: "export const CircularB = () => <div>B</div>",
              type: "registry:ui",
            },
          ],
        },
      ],
      { port: 4447 }
    )

    await customRegistry.start()
  })

  afterAll(async () => {
    await customRegistry.stop()
  })

  test("should order dependencies before items that depend on them", async () => {
    const result = await registryResolveItemsTree(
      ["http://localhost:4447/r/extended-component.json"],
      {
        style: "default",
        tailwind: { baseColor: "neutral" },
        resolvedPaths: {
          cwd: process.cwd(),
          tailwindConfig: "./tailwind.config.js",
          tailwindCss: "./globals.css",
          utils: "./lib/utils",
          components: "./components",
          lib: "./lib",
          hooks: "./hooks",
          ui: "./components/ui",
        },
      }
    )

    expect(result).toBeTruthy()
    expect(result?.files).toHaveLength(2)

    // Base component should come first.
    expect(result?.files?.[0]).toMatchObject({
      path: "components/ui/base.tsx",
      content: expect.stringContaining("Base Component"),
    })

    // Extended component should come second.
    expect(result?.files?.[1]).toMatchObject({
      path: "components/ui/extended.tsx",
      content: expect.stringContaining("Extended Component"),
    })

    expect(result?.cssVars?.light).toMatchObject({
      base: "#111111",
      extended: "#222222",
    })
  })

  test("should handle complex dependency chains", async () => {
    const result = await registryResolveItemsTree(
      ["http://localhost:4447/r/deep-component.json"],
      {
        style: "new-york",
        tailwind: { baseColor: "neutral" },
        resolvedPaths: {
          cwd: process.cwd(),
          tailwindConfig: "./tailwind.config.js",
          tailwindCss: "./globals.css",
          utils: "./lib/utils",
          components: "./components",
          lib: "./lib",
          hooks: "./hooks",
          ui: "./components/ui",
        },
      }
    )

    expect(result).toBeTruthy()
    expect(result?.files).toHaveLength(3)

    // Order should be: base -> extended -> deep.
    expect(result?.files?.[0].content).toContain("Base Component")
    expect(result?.files?.[1].content).toContain("Extended Component")
    expect(result?.files?.[2].content).toContain("Deep Component")
  })

  test("should handle circular dependencies gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    const result = await registryResolveItemsTree(
      [
        "http://localhost:4447/r/circular-a.json",
        "http://localhost:4447/r/circular-b.json",
      ],
      {
        style: "new-york",
        tailwind: { baseColor: "neutral" },
        resolvedPaths: {
          cwd: process.cwd(),
          tailwindConfig: "./tailwind.config.js",
          tailwindCss: "./globals.css",
          utils: "./lib/utils",
          components: "./components",
          lib: "./lib",
          hooks: "./hooks",
          ui: "./components/ui",
        },
      }
    )

    expect(result).toBeTruthy()

    // With circular dependencies, we might get duplicates in the files array
    // but we should have at least one of each circular item
    const hasCircularA = result?.files?.some(
      (f) => f.path === "components/ui/circular-a.tsx"
    )
    const hasCircularB = result?.files?.some(
      (f) => f.path === "components/ui/circular-b.tsx"
    )
    expect(hasCircularA).toBe(true)
    expect(hasCircularB).toBe(true)

    // Should have logged a warning about circular dependency
    expect(consoleSpy).toHaveBeenCalledWith(
      "Circular dependency detected in registry items"
    )

    consoleSpy.mockRestore()
  })

  test("should handle exact duplicate URLs by including only once", async () => {
    const result = await registryResolveItemsTree(
      [
        "http://localhost:4447/r/base-component.json",
        "http://localhost:4447/r/base-component.json",
      ],
      {
        style: "new-york",
        tailwind: { baseColor: "neutral" },
        resolvedPaths: {
          cwd: process.cwd(),
          tailwindConfig: "./tailwind.config.js",
          tailwindCss: "./globals.css",
          utils: "./lib/utils",
          components: "./components",
          lib: "./lib",
          hooks: "./hooks",
          ui: "./components/ui",
        },
      }
    )

    expect(result?.files).toHaveLength(1)
    expect(result?.files?.[0].path).toBe("components/ui/base.tsx")
  })

  test("should handle items with same name from different registries", async () => {
    const secondRegistry = await createRegistryServer(
      [
        {
          name: "base-component",
          type: "registry:ui",
          files: [
            {
              path: "components/ui/base-alt.tsx",
              content:
                "export const BaseAlt = () => <div>Alternative Base Component</div>",
              type: "registry:ui",
            },
          ],
          cssVars: {
            light: { altBase: "#999999" },
          },
        },
      ],
      { port: 4448 }
    )

    await secondRegistry.start()

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    const result = await registryResolveItemsTree(
      [
        "http://localhost:4447/r/base-component.json",
        "http://localhost:4448/r/base-component.json",
      ],
      {
        style: "default",
        tailwind: { baseColor: "neutral" },
        resolvedPaths: {
          cwd: process.cwd(),
          tailwindConfig: "./tailwind.config.js",
          tailwindCss: "./globals.css",
          utils: "./lib/utils",
          components: "./components",
          lib: "./lib",
          hooks: "./hooks",
          ui: "./components/ui",
        },
      }
    )

    expect(result?.files).toHaveLength(2)

    const filePaths = result?.files?.map((f) => f.path).sort()
    expect(filePaths).toEqual([
      "components/ui/base-alt.tsx",
      "components/ui/base.tsx",
    ])

    expect(result?.cssVars?.light).toHaveProperty("base", "#111111")
    expect(result?.cssVars?.light).toHaveProperty("altBase", "#999999")

    consoleSpy.mockRestore()
    await secondRegistry.stop()
  })

  test("should correctly resolve dependencies when multiple items have same dependency name", async () => {
    const result = await registryResolveItemsTree(
      ["http://localhost:4447/r/extended-component.json"],
      {
        style: "new-york",
        tailwind: { baseColor: "neutral" },
        resolvedPaths: {
          cwd: process.cwd(),
          tailwindConfig: "./tailwind.config.js",
          tailwindCss: "./globals.css",
          utils: "./lib/utils",
          components: "./components",
          lib: "./lib",
          hooks: "./hooks",
          ui: "./components/ui",
        },
      }
    )

    expect(result?.files).toHaveLength(2)
    expect(result?.files?.[0].path).toBe("components/ui/base.tsx")
    expect(result?.files?.[1].path).toBe("components/ui/extended.tsx")
  })
})

describe("registryResolveItemTree - potential target conflicts", async () => {
  const exampleRegistry = await createRegistryServer(
    [
      {
        name: "button-variant-a",
        type: "registry:ui",
        files: [
          {
            path: "ui/button.tsx",
            content: "export const Button = () => <button>Variant A</button>",
            type: "registry:ui",
          },
          {
            path: "ui/button.styles.css",
            content: ".button-a { color: red; }",
            type: "registry:ui",
          },
        ],
      },
      {
        name: "button-variant-b",
        type: "registry:ui",
        files: [
          {
            path: "ui/button.tsx",
            content: "export const Button = () => <button>Variant B</button>",
            type: "registry:ui",
          },
          {
            path: "components/button/index.tsx",
            content: "export { Button } from './button'",
            type: "registry:ui",
          },
        ],
      },
      {
        name: "component-with-explicit-target",
        type: "registry:ui",
        files: [
          {
            path: "custom/component.tsx",
            content: "export const Component = () => <div>Custom</div>",
            type: "registry:ui",
            target: "components/ui/button.tsx",
          },
        ],
      },
      {
        name: "lib-and-ui-conflict",
        type: "registry:ui",
        registryDependencies: ["http://localhost:4449/r/lib-utils.json"],
        files: [
          {
            path: "ui/utils.ts",
            content: "export const uiUtils = () => {}",
            type: "registry:ui",
          },
        ],
      },
      {
        name: "lib-utils",
        type: "registry:lib",
        files: [
          {
            path: "lib/utils.ts",
            content: "export const libUtils = () => {}",
            type: "registry:lib",
          },
          {
            path: "utils.ts",
            content: "export const utils = () => {}",
            type: "registry:lib",
          },
        ],
      },
    ],
    { port: 4449 }
  )

  const sharedConfig = {
    style: "default",
    tailwind: { baseColor: "neutral" },
    resolvedPaths: {
      cwd: process.cwd(),
      tailwindConfig: "./tailwind.config.js",
      tailwindCss: "./globals.css",
      utils: "./lib/utils",
      components: "./components",
      lib: "./lib",
      hooks: "./hooks",
      ui: "./components/ui",
    },
  }

  beforeAll(async () => {
    await exampleRegistry.start()
  })

  afterAll(async () => {
    await exampleRegistry.stop()
  })

  test("should deduplicate files with same resolved target (last wins) and preserve order", async () => {
    expect(
      await registryResolveItemsTree(
        [
          "http://localhost:4449/r/button-variant-a.json",
          "http://localhost:4449/r/button-variant-b.json",
        ],
        sharedConfig
      )
    ).toMatchInlineSnapshot(`
      {
        "css": {},
        "cssVars": {},
        "dependencies": [],
        "devDependencies": [],
        "docs": "",
        "files": [
          {
            "content": "export const Button = () => <button>Variant B</button>",
            "path": "ui/button.tsx",
            "type": "registry:ui",
          },
          {
            "content": ".button-a { color: red; }",
            "path": "ui/button.styles.css",
            "type": "registry:ui",
          },
          {
            "content": "export { Button } from './button'",
            "path": "components/button/index.tsx",
            "type": "registry:ui",
          },
        ],
        "tailwind": {},
      }
    `)

    expect(
      await registryResolveItemsTree(
        [
          "http://localhost:4449/r/button-variant-b.json",
          "http://localhost:4449/r/button-variant-a.json",
        ],
        sharedConfig
      )
    ).toMatchInlineSnapshot(`
      {
        "css": {},
        "cssVars": {},
        "dependencies": [],
        "devDependencies": [],
        "docs": "",
        "files": [
          {
            "content": "export const Button = () => <button>Variant A</button>",
            "path": "ui/button.tsx",
            "type": "registry:ui",
          },
          {
            "content": "export { Button } from './button'",
            "path": "components/button/index.tsx",
            "type": "registry:ui",
          },
          {
            "content": ".button-a { color: red; }",
            "path": "ui/button.styles.css",
            "type": "registry:ui",
          },
        ],
        "tailwind": {},
      }
    `)
  })

  test("should handle explicit target overrides", async () => {
    expect(
      await registryResolveItemsTree(
        [
          "http://localhost:4449/r/button-variant-a.json",
          "http://localhost:4449/r/component-with-explicit-target.json",
        ],
        sharedConfig
      )
    ).toMatchInlineSnapshot(`
      {
        "css": {},
        "cssVars": {},
        "dependencies": [],
        "devDependencies": [],
        "docs": "",
        "files": [
          {
            "content": "export const Button = () => <button>Variant A</button>",
            "path": "ui/button.tsx",
            "type": "registry:ui",
          },
          {
            "content": ".button-a { color: red; }",
            "path": "ui/button.styles.css",
            "type": "registry:ui",
          },
          {
            "content": "export const Component = () => <div>Custom</div>",
            "path": "custom/component.tsx",
            "target": "components/ui/button.tsx",
            "type": "registry:ui",
          },
        ],
        "tailwind": {},
      }
    `)
  })

  test("should preserve files with different types even if paths are similar", async () => {
    expect(
      await registryResolveItemsTree(
        ["http://localhost:4449/r/lib-and-ui-conflict.json"],
        sharedConfig
      )
    ).toMatchInlineSnapshot(`
      {
        "css": {},
        "cssVars": {},
        "dependencies": [],
        "devDependencies": [],
        "docs": "",
        "files": [
          {
            "content": "export const utils = () => {}",
            "path": "utils.ts",
            "type": "registry:lib",
          },
          {
            "content": "export const uiUtils = () => {}",
            "path": "ui/utils.ts",
            "type": "registry:ui",
          },
        ],
        "tailwind": {},
      }
    `)
  })

  test("should handle complex nested paths and deduplicate correctly", async () => {
    // Create a custom registry with nested paths.
    const nestedRegistry = await createRegistryServer(
      [
        {
          name: "nested-a",
          type: "registry:ui",
          files: [
            {
              path: "ui/forms/input.tsx",
              content: "export const Input = () => <input />",
              type: "registry:ui",
            },
            {
              path: "ui/forms/button.tsx",
              content:
                "export const FormButton = () => <button>Submit A</button>",
              type: "registry:ui",
            },
          ],
        },
        {
          name: "nested-b",
          type: "registry:ui",
          files: [
            {
              path: "ui/forms/button.tsx",
              content:
                "export const FormButton = () => <button>Submit B</button>",
              type: "registry:ui",
            },
            {
              path: "ui/forms/select.tsx",
              content: "export const Select = () => <select />",
              type: "registry:ui",
            },
          ],
        },
      ],
      { port: 4450 }
    )

    await nestedRegistry.start()

    expect(
      await registryResolveItemsTree(
        [
          "http://localhost:4450/r/nested-a.json",
          "http://localhost:4450/r/nested-b.json",
        ],
        sharedConfig
      )
    ).toMatchInlineSnapshot(`
      {
        "css": {},
        "cssVars": {},
        "dependencies": [],
        "devDependencies": [],
        "docs": "",
        "files": [
          {
            "content": "export const Input = () => <input />",
            "path": "ui/forms/input.tsx",
            "type": "registry:ui",
          },
          {
            "content": "export const FormButton = () => <button>Submit B</button>",
            "path": "ui/forms/button.tsx",
            "type": "registry:ui",
          },
          {
            "content": "export const Select = () => <select />",
            "path": "ui/forms/select.tsx",
            "type": "registry:ui",
          },
        ],
        "tailwind": {},
      }
    `)

    await nestedRegistry.stop()
  })

  test("should deduplicate files with same resolved path", async () => {
    const multiUtilsRegistry = await createRegistryServer(
      [
        {
          name: "utils-set-a",
          type: "registry:ui",
          files: [
            {
              path: "ui/utils.tsx",
              content: "export const utilsA = 'A'",
              type: "registry:ui",
            },
            {
              path: "ui/helpers/utils.tsx",
              content: "export const helpersUtilsA = 'A'",
              type: "registry:ui",
            },
          ],
        },
        {
          name: "utils-set-b",
          type: "registry:ui",
          files: [
            {
              path: "ui/utils.tsx",
              content: "export const utilsB = 'B'",
              type: "registry:ui",
            },
            {
              path: "ui/helpers/utils.tsx",
              content: "export const helpersUtilsB = 'B'",
              type: "registry:ui",
            },
          ],
        },
      ],
      { port: 4451 }
    )

    await multiUtilsRegistry.start()

    expect(
      await registryResolveItemsTree(
        [
          "http://localhost:4451/r/utils-set-a.json",
          "http://localhost:4451/r/utils-set-b.json",
        ],
        sharedConfig
      )
    ).toMatchInlineSnapshot(`
      {
        "css": {},
        "cssVars": {},
        "dependencies": [],
        "devDependencies": [],
        "docs": "",
        "files": [
          {
            "content": "export const utilsB = 'B'",
            "path": "ui/utils.tsx",
            "type": "registry:ui",
          },
          {
            "content": "export const helpersUtilsB = 'B'",
            "path": "ui/helpers/utils.tsx",
            "type": "registry:ui",
          },
        ],
        "tailwind": {},
      }
    `)

    await multiUtilsRegistry.stop()
  })

  test("should handle registry dependencies with file conflicts", async () => {
    const dependencyRegistry = await createRegistryServer(
      [
        {
          name: "base-button",
          type: "registry:ui",
          files: [
            {
              path: "ui/button.tsx",
              content: "export const BaseButton = () => <button>Base</button>",
              type: "registry:ui",
            },
          ],
        },
        {
          name: "extended-button",
          type: "registry:ui",
          registryDependencies: ["http://localhost:4452/r/base-button.json"],
          files: [
            {
              path: "ui/button.tsx",
              content:
                "export const ExtendedButton = () => <button>Extended</button>",
              type: "registry:ui",
            },
          ],
        },
      ],
      { port: 4452 }
    )

    await dependencyRegistry.start()

    expect(
      await registryResolveItemsTree(
        ["http://localhost:4452/r/extended-button.json"],
        sharedConfig
      )
    ).toMatchInlineSnapshot(`
      {
        "css": {},
        "cssVars": {},
        "dependencies": [],
        "devDependencies": [],
        "docs": "",
        "files": [
          {
            "content": "export const ExtendedButton = () => <button>Extended</button>",
            "path": "ui/button.tsx",
            "type": "registry:ui",
          },
        ],
        "tailwind": {},
      }
    `)

    await dependencyRegistry.stop()
  })
})
