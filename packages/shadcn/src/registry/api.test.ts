import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import { REGISTRY_URL } from "@/src/registry/constants"
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

import { getRegistry, getRegistryItem } from "./api"

vi.mock("@/src/utils/handle-error", () => ({
  handleError: vi.fn(),
}))

vi.mock("@/src/utils/logger", () => ({
  logger: {
    error: vi.fn(),
    break: vi.fn(),
    log: vi.fn(),
  },
}))

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

describe("getRegistryItem", () => {
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
      const result = await getRegistryItem(tempFile)

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

      const result = await getRegistryItem("./relative-component.json")

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
      const result = await getRegistryItem(tildeePath)

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
    const result = await getRegistryItem("/non/existent/file.json")
    expect(result).toBe(null)
  })

  it("should return null for invalid JSON", async () => {
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
    const tempFile = path.join(tempDir, "invalid.json")

    await fs.writeFile(tempFile, "{ invalid json }")

    try {
      const result = await getRegistryItem(tempFile)
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
      const result = await getRegistryItem(tempFile)
      expect(result).toBe(null)
    } finally {
      // Clean up
      await fs.unlink(tempFile)
      await fs.rmdir(tempDir)
    }
  })

  it("should still handle URLs and component names", async () => {
    // Test that existing functionality still works
    const result = await getRegistryItem("button")
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
      const result = await getRegistryItem(tempFile)

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

describe("getRegistry", () => {
  it("should fetch registry catalog", async () => {
    const registryData = {
      name: "@acme/registry",
      homepage: "https://acme.com",
      items: [
        { name: "button", type: "registry:ui" },
        { name: "card", type: "registry:ui" },
      ],
    }

    server.use(
      http.get("https://acme.com/registry.json", () => {
        return HttpResponse.json(registryData)
      })
    )

    const mockConfig = {
      style: "new-york",
      tailwind: { baseColor: "neutral", cssVariables: true },
      registries: {
        "@acme": {
          url: "https://acme.com/{name}.json",
        },
      },
    } as any

    const result = await getRegistry("@acme/registry", mockConfig)

    expect(result).toMatchObject({
      name: "@acme/registry",
      homepage: "https://acme.com",
      items: [
        { name: "button", type: "registry:ui" },
        { name: "card", type: "registry:ui" },
      ],
    })
  })
  it("should handle registry with auth headers", async () => {
    const registryData = {
      name: "@private/registry",
      homepage: "https://private.com",
      items: [{ name: "secure-component", type: "registry:ui" }],
    }

    let receivedHeaders: Record<string, string> = {}
    server.use(
      http.get("https://private.com/registry.json", ({ request }) => {
        // Convert headers to a plain object
        request.headers.forEach((value, key) => {
          receivedHeaders[key] = value
        })
        return HttpResponse.json(registryData)
      })
    )

    const mockConfig = {
      style: "new-york",
      tailwind: { baseColor: "neutral", cssVariables: true },
      registries: {
        "@private": {
          url: "https://private.com/{name}.json",
          headers: {
            Authorization: "Bearer test-token",
          },
        },
      },
    } as any

    const result = await getRegistry("@private/registry", mockConfig)

    expect(result).toMatchObject({
      name: "@private/registry",
      homepage: "https://private.com",
      items: [{ name: "secure-component", type: "registry:ui" }],
    })

    expect(receivedHeaders.authorization).toBe("Bearer test-token")
  })

  it("should return null on error", async () => {
    server.use(
      http.get("https://example.com/registry.json", () => {
        return HttpResponse.json({ error: "Not found" }, { status: 404 })
      })
    )

    const mockConfig = {
      style: "new-york",
      tailwind: { baseColor: "neutral", cssVariables: true },
      registries: {
        "@example": {
          url: "https://example.com/{name}.json",
        },
      },
    } as any

    const result = await getRegistry("@example/registry", mockConfig)
    expect(result).toBe(null)
  })
})
