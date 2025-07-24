import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  clearRegistryCache,
  fetchRegistry,
  getRegistryItem,
  registryResolveItemsTree,
} from "./api"

// Mock the handleError function to prevent process.exit in tests
vi.mock("@/src/utils/handle-error", () => ({
  handleError: vi.fn(),
}))

// Mock the logger to prevent console output in tests
vi.mock("@/src/utils/logger", () => ({
  logger: {
    error: vi.fn(),
    break: vi.fn(),
    log: vi.fn(),
  },
}))

const REGISTRY_URL = "https://ui.shadcn.com/r"

const server = setupServer(
  http.get(`${REGISTRY_URL}/index.json`, () => {
    return HttpResponse.json([
      {
        name: "button",
        type: "registry:ui",
      },
      {
        name: "card",
        type: "registry:ui",
      },
    ])
  }),
  http.get(`${REGISTRY_URL}/styles/new-york/button.json`, () => {
    return HttpResponse.json({
      name: "button",
      type: "registry:ui",
      dependencies: ["@radix-ui/react-slot"],
      files: [
        {
          path: "registry/new-york/ui/button.tsx",
          content: "// button component content",
          type: "registry:ui",
        },
      ],
    })
  }),
  http.get(`${REGISTRY_URL}/styles/new-york/card.json`, () => {
    return HttpResponse.json({
      name: "card",
      type: "registry:ui",
      dependencies: ["@radix-ui/react-slot"],
      files: [
        {
          path: "registry/new-york/ui/card.tsx",
          content: "// card component content",
          type: "registry:ui",
        },
      ],
    })
  })
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => server.close())

describe("fetchRegistry", () => {
  it("should fetch registry data", async () => {
    const paths = ["styles/new-york/button.json"]
    const result = await fetchRegistry(paths)

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      name: "button",
      type: "registry:ui",
      dependencies: ["@radix-ui/react-slot"],
    })
  })

  it("should use cache for subsequent requests", async () => {
    const paths = ["styles/new-york/button.json"]
    let fetchCount = 0

    // Clear any existing cache before test
    clearRegistryCache()

    // Define the handler with counter before making requests
    server.use(
      http.get(`${REGISTRY_URL}/styles/new-york/button.json`, async () => {
        // Add a small delay to simulate network latency
        await new Promise((resolve) => setTimeout(resolve, 10))
        fetchCount++
        return HttpResponse.json({
          name: "button",
          type: "registry:ui",
          dependencies: ["@radix-ui/react-slot"],
          files: [
            {
              path: "registry/new-york/ui/button.tsx",
              content: "// button component content",
              type: "registry:ui",
            },
          ],
        })
      })
    )

    // First request
    const result1 = await fetchRegistry(paths)
    expect(fetchCount).toBe(1)
    expect(result1).toHaveLength(1)
    expect(result1[0]).toMatchObject({ name: "button" })

    // Second request - should use cache
    const result2 = await fetchRegistry(paths)
    expect(fetchCount).toBe(1) // Should still be 1
    expect(result2).toHaveLength(1)
    expect(result2[0]).toMatchObject({ name: "button" })

    // Third request - double check cache
    const result3 = await fetchRegistry(paths)
    expect(fetchCount).toBe(1) // Should still be 1
    expect(result3).toHaveLength(1)
    expect(result3[0]).toMatchObject({ name: "button" })
  })

  it("should handle multiple paths", async () => {
    const paths = ["styles/new-york/button.json", "styles/new-york/card.json"]
    const result = await fetchRegistry(paths)

    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ name: "button" })
    expect(result[1]).toMatchObject({ name: "card" })
  })
})

describe("getRegistryItem with local files", () => {
  it("should read and parse a valid local JSON file", async () => {
    // Create a temporary file
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
    const tempFile = path.join(tempDir, "test-component.json")

    const componentData = {
      name: "test-component",
      type: "registry:ui",
      dependencies: ["@radix-ui/react-dialog"],
      files: [
        {
          path: "ui/test-component.tsx",
          content: "// test component content",
          type: "registry:ui",
        },
      ],
    }

    await fs.writeFile(tempFile, JSON.stringify(componentData, null, 2))

    try {
      const result = await getRegistryItem(tempFile, "unused-style")

      expect(result).toMatchObject({
        name: "test-component",
        type: "registry:ui",
        dependencies: ["@radix-ui/react-dialog"],
        files: [
          {
            path: "ui/test-component.tsx",
            content: "// test component content",
            type: "registry:ui",
          },
        ],
      })
    } finally {
      // Clean up
      await fs.unlink(tempFile)
      await fs.rmdir(tempDir)
    }
  })

  it("should handle relative paths", async () => {
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
    const tempFile = path.join(tempDir, "relative-component.json")

    const componentData = {
      name: "relative-component",
      type: "registry:ui",
      files: [],
    }

    await fs.writeFile(tempFile, JSON.stringify(componentData))

    try {
      // Change to temp directory to test relative path
      const originalCwd = process.cwd()
      process.chdir(tempDir)

      const result = await getRegistryItem(
        "./relative-component.json",
        "unused-style"
      )

      expect(result).toMatchObject({
        name: "relative-component",
        type: "registry:ui",
      })

      process.chdir(originalCwd)
    } finally {
      // Clean up
      await fs.unlink(tempFile)
      await fs.rmdir(tempDir)
    }
  })

  it("should handle tilde (~) home directory paths", async () => {
    const os = await import("os")
    const homeDir = os.homedir()
    const tempFile = path.join(homeDir, "shadcn-test-tilde.json")

    const componentData = {
      name: "tilde-component",
      type: "registry:ui",
      files: [],
    }

    await fs.writeFile(tempFile, JSON.stringify(componentData))

    try {
      // Test with tilde path
      const tildeePath = "~/shadcn-test-tilde.json"
      const result = await getRegistryItem(tildeePath, "unused-style")

      expect(result).toMatchObject({
        name: "tilde-component",
        type: "registry:ui",
      })
    } finally {
      // Clean up
      await fs.unlink(tempFile)
    }
  })

  it("should return null for non-existent files", async () => {
    const result = await getRegistryItem(
      "/non/existent/file.json",
      "unused-style"
    )
    expect(result).toBe(null)
  })

  it("should return null for invalid JSON", async () => {
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
    const tempFile = path.join(tempDir, "invalid.json")

    await fs.writeFile(tempFile, "{ invalid json }")

    try {
      const result = await getRegistryItem(tempFile, "unused-style")
      expect(result).toBe(null)
    } finally {
      // Clean up
      await fs.unlink(tempFile)
      await fs.rmdir(tempDir)
    }
  })

  it("should return null for JSON that doesn't match registry schema", async () => {
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
    const tempFile = path.join(tempDir, "invalid-schema.json")

    const invalidData = {
      notAValidRegistryItem: true,
      missing: "required fields",
    }

    await fs.writeFile(tempFile, JSON.stringify(invalidData))

    try {
      const result = await getRegistryItem(tempFile, "unused-style")
      expect(result).toBe(null)
    } finally {
      // Clean up
      await fs.unlink(tempFile)
      await fs.rmdir(tempDir)
    }
  })

  it("should still handle URLs and component names", async () => {
    // Test that existing functionality still works
    const result = await getRegistryItem("button", "new-york")
    expect(result).toMatchObject({
      name: "button",
      type: "registry:ui",
    })
  })

  it("should handle local files with URL dependencies", async () => {
    // Mock a URL endpoint for dependency
    const dependencyUrl = "https://example.com/dependency.json"
    server.use(
      http.get(dependencyUrl, () => {
        return HttpResponse.json({
          name: "url-dependency",
          type: "registry:ui",
          files: [
            {
              path: "ui/url-dependency.tsx",
              content: "// url dependency content",
              type: "registry:ui",
            },
          ],
        })
      })
    )

    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
    const tempFile = path.join(tempDir, "component-with-url-deps.json")

    const componentData = {
      name: "component-with-url-deps",
      type: "registry:ui",
      registryDependencies: [dependencyUrl, "button"], // Mix of URL and registry name
      files: [
        {
          path: "ui/component-with-url-deps.tsx",
          content: "// component with url deps content",
          type: "registry:ui",
        },
      ],
    }

    await fs.writeFile(tempFile, JSON.stringify(componentData, null, 2))

    try {
      const result = await getRegistryItem(tempFile, "unused-style")

      expect(result).toMatchObject({
        name: "component-with-url-deps",
        type: "registry:ui",
        registryDependencies: [dependencyUrl, "button"],
      })
    } finally {
      // Clean up
      await fs.unlink(tempFile)
      await fs.rmdir(tempDir)
    }
  })
})

describe("registryResolveItemsTree with URL dependencies", () => {
  it("should resolve URL dependencies from local files", async () => {
    // Mock a URL endpoint for dependency
    const dependencyUrl = "https://example.com/dependency.json"
    server.use(
      http.get(dependencyUrl, () => {
        return HttpResponse.json({
          name: "url-dependency",
          type: "registry:ui",
          files: [
            {
              path: "ui/url-dependency.tsx",
              content: "// url dependency content",
              type: "registry:ui",
            },
          ],
        })
      })
    )

    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
    const tempFile = path.join(tempDir, "component-with-url-deps.json")

    const componentData = {
      name: "component-with-url-deps",
      type: "registry:ui",
      registryDependencies: [dependencyUrl], // URL dependency
      files: [
        {
          path: "ui/component-with-url-deps.tsx",
          content: "// component with url deps content",
          type: "registry:ui",
        },
      ],
    }

    await fs.writeFile(tempFile, JSON.stringify(componentData, null, 2))

    try {
      const mockConfig = {
        style: "new-york",
        tailwind: { baseColor: "neutral", cssVariables: true },
        resolvedPaths: { cwd: process.cwd() },
      } as any

      const result = await registryResolveItemsTree([tempFile], mockConfig)

      expect(result).toBeDefined()
      expect(result?.files).toBeDefined()
      // Should contain files from both the main component and its URL dependency
      const filePaths = result?.files?.map((f: any) => f.path) ?? []
      expect(filePaths).toContain("ui/component-with-url-deps.tsx")
      expect(filePaths).toContain("ui/url-dependency.tsx")
    } finally {
      // Clean up
      await fs.unlink(tempFile)
      await fs.rmdir(tempDir)
    }
  })
})
