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

describe("registryResolveItemTree - cross-registry dependencies", async () => {
  const firstRegistry = await createRegistryServer(
    [
      {
        name: "login-01",
        type: "registry:ui",
        files: [
          {
            path: "ui/login-01.tsx",
            content: "export const Login01 = () => <div>Login 01</div>",
            type: "registry:ui",
          },
        ],
      },
      {
        name: "login-02",
        type: "registry:ui",
        files: [
          {
            path: "ui/login-02.tsx",
            content: "export const Login02 = () => <div>Login 02</div>",
            type: "registry:ui",
          },
        ],
      },
    ],
    { port: 4453 }
  )

  const secondRegistry = await createRegistryServer(
    [
      {
        name: "block-01",
        type: "registry:block",
        files: [
          {
            path: "blocks/block-01.tsx",
            content: "export const Block01 = () => <div>Block 01</div>",
            type: "registry:block",
          },
        ],
      },
      {
        name: "block-02",
        type: "registry:block",
        registryDependencies: ["@one/login-02"],
        files: [
          {
            path: "blocks/block-02.tsx",
            content:
              "export const Block02 = () => <div>Block 02 with Login</div>",
            type: "registry:block",
          },
        ],
      },
    ],
    { port: 4454 }
  )

  const thirdRegistry = await createRegistryServer(
    [
      {
        name: "login-01",
        type: "registry:component",
        files: [
          {
            path: "components/login-form.tsx",
            content:
              "export const LoginForm = () => <form>Login Form 01</form>",
            type: "registry:component",
          },
        ],
      },
      {
        name: "login-02",
        type: "registry:component",
        files: [
          {
            path: "components/login-form.tsx",
            content:
              "export const LoginForm = () => <form>Login Form 02</form>",
            type: "registry:component",
          },
        ],
      },
    ],
    { port: 4455 }
  )

  const fourthRegistry = await createRegistryServer(
    [
      {
        name: "app-01",
        type: "registry:item",
        registryDependencies: ["@three/login-02"],
      },
    ],
    { port: 4456 }
  )

  beforeAll(async () => {
    await firstRegistry.start()
    await secondRegistry.start()
    await thirdRegistry.start()
    await fourthRegistry.start()
  })

  afterAll(async () => {
    await firstRegistry.stop()
    await secondRegistry.stop()
    await thirdRegistry.stop()
    await fourthRegistry.stop()
  })

  test("should resolve cross-registry dependencies correctly", async () => {
    const config = {
      style: "default",
      tailwind: { baseColor: "neutral" },
      registries: {
        "@one": {
          url: "http://localhost:4453/r/{name}.json",
        },
        "@two": {
          url: "http://localhost:4454/r/{name}.json",
        },
      },
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

    const result = await registryResolveItemsTree(
      ["@one/login-01", "@two/block-02"],
      config
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "css": {},
        "cssVars": {},
        "dependencies": [],
        "devDependencies": [],
        "docs": "",
        "files": [
          {
            "content": "export const Login01 = () => <div>Login 01</div>",
            "path": "ui/login-01.tsx",
            "type": "registry:ui",
          },
          {
            "content": "export const Login02 = () => <div>Login 02</div>",
            "path": "ui/login-02.tsx",
            "type": "registry:ui",
          },
          {
            "content": "export const Block02 = () => <div>Block 02 with Login</div>",
            "path": "blocks/block-02.tsx",
            "type": "registry:block",
          },
        ],
        "tailwind": {},
      }
    `)
  })

  test("should deduplicate shared dependencies across registry items", async () => {
    const config = {
      style: "default",
      tailwind: { baseColor: "neutral" },
      registries: {
        "@three": "http://localhost:4455/r/{name}.json",
        "@four": "http://localhost:4456/r/{name}.json",
      },
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

    const result = await registryResolveItemsTree(
      ["@three/login-01", "@four/app-01"],
      config
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "css": {},
        "cssVars": {},
        "dependencies": [],
        "devDependencies": [],
        "docs": "",
        "files": [
          {
            "content": "export const LoginForm = () => <form>Login Form 02</form>",
            "path": "components/login-form.tsx",
            "type": "registry:component",
          },
        ],
        "tailwind": {},
      }
    `)
  })
})

describe("registryResolveItemTree - comprehensive cross-registry tests", async () => {
  // Create registries with all possible fields
  const uiRegistry = await createRegistryServer(
    [
      {
        name: "theme-provider",
        type: "registry:ui",
        dependencies: ["next-themes"],
        devDependencies: ["@types/node"],
        files: [
          {
            path: "ui/theme-provider.tsx",
            content: "export const ThemeProvider = () => <div>Theme</div>",
            type: "registry:ui",
          },
        ],
        tailwind: {
          config: {
            theme: {
              extend: {
                colors: {
                  border: "hsl(var(--border))",
                  input: "hsl(var(--input))",
                },
              },
            },
            plugins: ["require('tailwindcss-animate')"],
          },
        },
        cssVars: {
          theme: {
            "--card": "240 5% 6%",
            "--card-foreground": "60 5% 90%",
          },
          light: {
            "--background": "0 0% 100%",
            "--foreground": "240 10% 3.9%",
          },
          dark: {
            "--background": "240 10% 3.9%",
            "--foreground": "0 0% 98%",
          },
        },
        css: {
          ".theme-custom": {
            "background-color": "var(--background)",
            color: "var(--foreground)",
          },
        },
        docs: "## Theme Provider\n\nA component for managing application themes.",
      },
      {
        name: "dialog",
        type: "registry:ui",
        dependencies: ["@radix-ui/react-dialog"],
        registryDependencies: ["@ui/theme-provider"],
        files: [
          {
            path: "ui/dialog.tsx",
            content: "export const Dialog = () => <dialog>Dialog</dialog>",
            type: "registry:ui",
          },
        ],
        cssVars: {
          light: {
            "--dialog-background": "0 0% 100%",
          },
          dark: {
            "--dialog-background": "240 10% 3.9%",
          },
        },
        docs: "## Dialog\n\nA modal dialog component.",
      },
    ],
    { port: 4457 }
  )

  const blockRegistry = await createRegistryServer(
    [
      {
        name: "dashboard-01",
        type: "registry:block",
        dependencies: ["recharts", "lucide-react"],
        devDependencies: ["@types/recharts"],
        registryDependencies: ["@ui/dialog", "@lib/chart-utils"],
        files: [
          {
            path: "blocks/dashboard-01.tsx",
            content: "export const Dashboard = () => <div>Dashboard</div>",
            type: "registry:block",
          },
          {
            path: "blocks/dashboard-01.css",
            content: ".dashboard { padding: 1rem; }",
            type: "registry:block",
          },
        ],
        tailwind: {
          config: {
            theme: {
              extend: {
                borderRadius: {
                  xl: "1rem",
                },
              },
            },
          },
        },
        css: {
          ".dashboard-grid": {
            display: "grid",
            "grid-template-columns": "repeat(auto-fit, minmax(250px, 1fr))",
          },
        },
        envVars: {
          NEXT_PUBLIC_API_URL: "https://api.example.com",
          NEXT_PUBLIC_APP_NAME: "Dashboard App",
        },
        docs: "## Dashboard Block\n\nA complete dashboard layout.",
      },
    ],
    { port: 4458 }
  )

  const libRegistry = await createRegistryServer(
    [
      {
        name: "chart-utils",
        type: "registry:lib",
        dependencies: ["date-fns", "clsx"],
        files: [
          {
            path: "lib/chart-utils.ts",
            content: "export const formatChartData = (data) => data",
            type: "registry:lib",
          },
        ],
        docs: "## Chart Utilities\n\nUtility functions for chart data processing.",
      },
      {
        name: "api-client",
        type: "registry:lib",
        dependencies: ["axios"],
        devDependencies: ["@types/axios"],
        registryDependencies: ["@lib/chart-utils"],
        files: [
          {
            path: "lib/api-client.ts",
            content: "export const apiClient = axios.create()",
            type: "registry:lib",
          },
        ],
        envVars: {
          API_KEY: "your-api-key",
          API_SECRET: "your-api-secret",
        },
      },
    ],
    { port: 4459 }
  )

  beforeAll(async () => {
    await uiRegistry.start()
    await blockRegistry.start()
    await libRegistry.start()
  })

  afterAll(async () => {
    await uiRegistry.stop()
    await blockRegistry.stop()
    await libRegistry.stop()
  })

  test("should merge all properties from cross-registry dependencies", async () => {
    const config = {
      style: "default",
      tailwind: { baseColor: "neutral" },
      registries: {
        "@ui": "http://localhost:4457/r/{name}.json",
        "@block": "http://localhost:4458/r/{name}.json",
        "@lib": "http://localhost:4459/r/{name}.json",
      },
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

    const result = await registryResolveItemsTree(
      ["@block/dashboard-01"],
      config
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "css": {
          ".dashboard-grid": {
            "display": "grid",
            "grid-template-columns": "repeat(auto-fit, minmax(250px, 1fr))",
          },
          ".theme-custom": {
            "background-color": "var(--background)",
            "color": "var(--foreground)",
          },
        },
        "cssVars": {
          "dark": {
            "--background": "240 10% 3.9%",
            "--dialog-background": "240 10% 3.9%",
            "--foreground": "0 0% 98%",
          },
          "light": {
            "--background": "0 0% 100%",
            "--dialog-background": "0 0% 100%",
            "--foreground": "240 10% 3.9%",
          },
          "theme": {
            "--card": "240 5% 6%",
            "--card-foreground": "60 5% 90%",
          },
        },
        "dependencies": [
          "next-themes",
          "date-fns",
          "clsx",
          "@radix-ui/react-dialog",
          "recharts",
          "lucide-react",
        ],
        "devDependencies": [
          "@types/node",
          "@types/recharts",
        ],
        "docs": "## Theme Provider

      A component for managing application themes.
      ## Chart Utilities

      Utility functions for chart data processing.
      ## Dialog

      A modal dialog component.
      ## Dashboard Block

      A complete dashboard layout.
      ",
        "envVars": {
          "NEXT_PUBLIC_API_URL": "https://api.example.com",
          "NEXT_PUBLIC_APP_NAME": "Dashboard App",
        },
        "files": [
          {
            "content": "export const ThemeProvider = () => <div>Theme</div>",
            "path": "ui/theme-provider.tsx",
            "type": "registry:ui",
          },
          {
            "content": "export const formatChartData = (data) => data",
            "path": "lib/chart-utils.ts",
            "type": "registry:lib",
          },
          {
            "content": "export const Dialog = () => <dialog>Dialog</dialog>",
            "path": "ui/dialog.tsx",
            "type": "registry:ui",
          },
          {
            "content": "export const Dashboard = () => <div>Dashboard</div>",
            "path": "blocks/dashboard-01.tsx",
            "type": "registry:block",
          },
          {
            "content": ".dashboard { padding: 1rem; }",
            "path": "blocks/dashboard-01.css",
            "type": "registry:block",
          },
        ],
        "tailwind": {
          "config": {
            "plugins": [
              "require('tailwindcss-animate')",
            ],
            "theme": {
              "extend": {
                "borderRadius": {
                  "xl": "1rem",
                },
                "colors": {
                  "border": "hsl(var(--border))",
                  "input": "hsl(var(--input))",
                },
              },
            },
          },
        },
      }
    `)
  })

  test("should handle multiple cross-registry items with overlapping dependencies", async () => {
    const config = {
      style: "default",
      tailwind: { baseColor: "neutral" },
      registries: {
        "@ui": "http://localhost:4457/r/{name}.json",
        "@lib": "http://localhost:4459/r/{name}.json",
      },
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

    const result = await registryResolveItemsTree(
      ["@ui/dialog", "@lib/api-client"],
      config
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "css": {
          ".theme-custom": {
            "background-color": "var(--background)",
            "color": "var(--foreground)",
          },
        },
        "cssVars": {
          "dark": {
            "--background": "240 10% 3.9%",
            "--dialog-background": "240 10% 3.9%",
            "--foreground": "0 0% 98%",
          },
          "light": {
            "--background": "0 0% 100%",
            "--dialog-background": "0 0% 100%",
            "--foreground": "240 10% 3.9%",
          },
          "theme": {
            "--card": "240 5% 6%",
            "--card-foreground": "60 5% 90%",
          },
        },
        "dependencies": [
          "next-themes",
          "date-fns",
          "clsx",
          "@radix-ui/react-dialog",
          "axios",
        ],
        "devDependencies": [
          "@types/node",
          "@types/axios",
        ],
        "docs": "## Theme Provider

      A component for managing application themes.
      ## Chart Utilities

      Utility functions for chart data processing.
      ## Dialog

      A modal dialog component.
      ",
        "envVars": {
          "API_KEY": "your-api-key",
          "API_SECRET": "your-api-secret",
        },
        "files": [
          {
            "content": "export const ThemeProvider = () => <div>Theme</div>",
            "path": "ui/theme-provider.tsx",
            "type": "registry:ui",
          },
          {
            "content": "export const formatChartData = (data) => data",
            "path": "lib/chart-utils.ts",
            "type": "registry:lib",
          },
          {
            "content": "export const Dialog = () => <dialog>Dialog</dialog>",
            "path": "ui/dialog.tsx",
            "type": "registry:ui",
          },
          {
            "content": "export const apiClient = axios.create()",
            "path": "lib/api-client.ts",
            "type": "registry:lib",
          },
        ],
        "tailwind": {
          "config": {
            "plugins": [
              "require('tailwindcss-animate')",
            ],
            "theme": {
              "extend": {
                "colors": {
                  "border": "hsl(var(--border))",
                  "input": "hsl(var(--input))",
                },
              },
            },
          },
        },
      }
    `)
  })

  test("should properly deduplicate shared registry dependencies", async () => {
    const config = {
      style: "default",
      tailwind: { baseColor: "neutral" },
      registries: {
        "@ui": "http://localhost:4457/r/{name}.json",
        "@lib": "http://localhost:4459/r/{name}.json",
      },
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

    const result = await registryResolveItemsTree(
      ["@ui/dialog", "@lib/api-client"],
      config
    )

    // Verify that chart-utils appears only once in the files.
    const chartUtilsFiles = result?.files?.filter(
      (f) => f.path === "lib/chart-utils.ts"
    )
    expect(chartUtilsFiles).toHaveLength(1)

    // Verify that theme-provider appears only once.
    const themeProviderFiles = result?.files?.filter(
      (f) => f.path === "ui/theme-provider.tsx"
    )
    expect(themeProviderFiles).toHaveLength(1)

    // Verify dependencies are merged without duplicates.
    expect(result?.dependencies).toEqual([
      "next-themes",
      "date-fns",
      "clsx",
      "@radix-ui/react-dialog",
      "axios",
    ])
  })
})

describe("registryResolveItemTree - last wins behavior", async () => {
  // Create registries with overlapping properties to test last-wins
  const overrideRegistry = await createRegistryServer(
    [
      {
        name: "base-component",
        type: "registry:ui",
        files: [
          {
            path: "ui/component.tsx",
            content: "export const Component = () => <div>Base</div>",
            type: "registry:ui",
          },
        ],
        cssVars: {
          light: {
            "--background": "#ffffff",
            "--foreground": "#000000",
          },
          dark: {
            "--background": "#000000",
            "--foreground": "#ffffff",
          },
        },
        css: {
          ".component": {
            padding: "1rem",
            margin: "0.5rem",
          },
        },
        dependencies: ["react", "clsx"],
        envVars: {
          API_URL: "https://base.example.com",
          APP_NAME: "Base App",
        },
        docs: "Base component documentation",
      },
      {
        name: "override-component",
        type: "registry:ui",
        registryDependencies: ["@override/base-component"],
        files: [
          {
            path: "ui/component.tsx",
            content: "export const Component = () => <div>Override</div>",
            type: "registry:ui",
          },
        ],
        cssVars: {
          light: {
            "--background": "#f0f0f0", // Override base
            "--primary": "#0066cc", // Add new
          },
          dark: {
            "--background": "#1a1a1a", // Override base
          },
        },
        css: {
          ".component": {
            padding: "2rem", // Override base
            border: "1px solid", // Add new
          },
        },
        dependencies: ["react-dom"], // Additional dependency
        envVars: {
          API_URL: "https://override.example.com", // Override base
          DEBUG: "true", // Add new
        },
        docs: "Override component documentation",
      },
      {
        name: "final-component", 
        type: "registry:ui",
        registryDependencies: ["@override/override-component"],
        files: [
          {
            path: "ui/component.tsx",
            content: "export const Component = () => <div>Final</div>",
            type: "registry:ui",
          },
        ],
        cssVars: {
          light: {
            "--background": "#e0e0e0", // Override again
          },
        },
        css: {
          ".component": {
            margin: "1rem", // Override base margin
          },
        },
        envVars: {
          APP_NAME: "Final App", // Override base
        },
        docs: "Final component documentation",
      },
    ],
    { port: 4460 }
  )

  beforeAll(async () => {
    await overrideRegistry.start()
  })

  afterAll(async () => {
    await overrideRegistry.stop()
  })

  test("should apply last-wins for overlapping CSS properties", async () => {
    const config = {
      style: "default",
      tailwind: { baseColor: "neutral" },
      registries: {
        "@override": "http://localhost:4460/r/{name}.json",
      },
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

    const result = await registryResolveItemsTree(
      ["@override/final-component"],
      config
    )

    // Check files - should only have the final version
    expect(result?.files).toHaveLength(1)
    expect(result?.files?.[0]).toMatchObject({
      path: "ui/component.tsx",
      content: "export const Component = () => <div>Final</div>",
    })

    // Check CSS - properties should be merged with later values overriding
    expect(result?.css).toMatchInlineSnapshot(`
      {
        ".component": {
          "border": "1px solid",
          "margin": "1rem",
          "padding": "2rem",
        },
      }
    `)

    // Check cssVars - later values should override earlier ones
    expect(result?.cssVars).toMatchInlineSnapshot(`
      {
        "dark": {
          "--background": "#1a1a1a",
          "--foreground": "#ffffff",
        },
        "light": {
          "--background": "#e0e0e0",
          "--foreground": "#000000",
          "--primary": "#0066cc",
        },
      }
    `)

    // Check envVars - later values should override
    expect(result?.envVars).toMatchInlineSnapshot(`
      {
        "API_URL": "https://override.example.com",
        "APP_NAME": "Final App",
        "DEBUG": "true",
      }
    `)

    // Check dependencies - all should be included
    expect(result?.dependencies).toEqual([
      "react",
      "clsx",
      "react-dom",
    ])

    // Check docs - all should be concatenated
    expect(result?.docs).toMatchInlineSnapshot(`
      "Base component documentation
      Override component documentation
      Final component documentation
      "
    `)
  })

  test("should handle multiple items where last wins", async () => {
    const config = {
      style: "default",
      tailwind: { baseColor: "neutral" },
      registries: {
        "@override": "http://localhost:4460/r/{name}.json",
      },
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

    // Request multiple items that have the same file path
    const result = await registryResolveItemsTree(
      ["@override/base-component", "@override/override-component"],
      config
    )

    // Files should deduplicate with last one winning
    expect(result?.files).toHaveLength(1)
    expect(result?.files?.[0]).toMatchObject({
      path: "ui/component.tsx",
      content: "export const Component = () => <div>Override</div>", // Override wins
    })

    // CSS should merge with override winning for same properties
    expect(result?.css?.[".component"]).toMatchObject({
      padding: "2rem", // Override wins
      margin: "0.5rem", // From base (not overridden)
      border: "1px solid", // From override (new property)
    })

    // cssVars should merge with override winning
    expect(result?.cssVars?.light).toMatchObject({
      "--background": "#f0f0f0", // Override wins
      "--foreground": "#000000", // From base (not overridden)
      "--primary": "#0066cc", // From override (new property)
    })
  })
})
