import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import { BUILTIN_REGISTRIES, REGISTRY_URL } from "@/src/registry/constants"
import {
  ConfigParseError,
  RegistryErrorCode,
  RegistryFetchError,
  RegistryForbiddenError,
  RegistryInvalidNamespaceError,
  RegistryLocalFileError,
  RegistryNotConfiguredError,
  RegistryNotFoundError,
  RegistryParseError,
  RegistryUnauthorizedError,
} from "@/src/registry/errors"
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
import { z } from "zod"

import {
  getRegistriesConfig,
  getRegistriesIndex,
  getRegistry,
  getRegistryItems,
} from "./api"
import { RegistriesIndexParseError } from "./errors"

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

  http.get(`${REGISTRY_URL}/styles/new-york-v4/button.json`, () => {
    return HttpResponse.json({
      name: "button",
      type: "registry:ui",
      dependencies: ["@radix-ui/react-slot"],
      files: [
        {
          path: "registry/new-york/ui/button.tsx",
          content: "// button component content v4",
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
  }),
  http.get(`${REGISTRY_URL}/registries.json`, () => {
    return HttpResponse.json({
      "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
      "@example": "https://example.com/registry/styles/{style}/{name}.json",
      "@test": "https://test.com/registry/{name}.json",
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
      const [result] = await getRegistryItems([tempFile])

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

      const [result] = await getRegistryItems(["./relative-component.json"])

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
      const [result] = await getRegistryItems([tildeePath])

      expect(result).toMatchObject({
        name: "tilde-component",
        type: "registry:ui",
      })
    } finally {
      // Clean up
      await fs.unlink(tempFile)
    }
  })

  it("should throw error for non-existent files", async () => {
    await expect(getRegistryItems(["/non/existent/file.json"])).rejects.toThrow(
      RegistryLocalFileError
    )
  })

  it("should throw error for invalid JSON", async () => {
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
    const tempFile = path.join(tempDir, "invalid.json")

    await fs.writeFile(tempFile, "{ invalid json }")

    try {
      await expect(getRegistryItems([tempFile])).rejects.toThrow()
    } finally {
      // Clean up
      await fs.unlink(tempFile)
      await fs.rmdir(tempDir)
    }
  })

  it("should throw error for JSON that doesn't match registry schema", async () => {
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
    const tempFile = path.join(tempDir, "invalid-schema.json")

    const invalidData = {
      notAValidRegistryItem: true,
      missing: "required fields",
    }

    await fs.writeFile(tempFile, JSON.stringify(invalidData))

    try {
      await expect(getRegistryItems([tempFile])).rejects.toThrow(
        RegistryParseError
      )
    } finally {
      // Clean up
      await fs.unlink(tempFile)
      await fs.rmdir(tempDir)
    }
  })

  it("should still handle URLs and component names", async () => {
    // Test that existing functionality still works
    const [result] = await getRegistryItems(["button"])
    expect(result).toMatchObject({
      name: "button",
      type: "registry:ui",
    })
  })

  it("should fetch items from direct URLs", async () => {
    const itemUrl = "https://example.com/custom-button.json"

    server.use(
      http.get(itemUrl, () => {
        return HttpResponse.json({
          name: "custom-button",
          type: "registry:ui",
          files: [
            {
              path: "ui/custom-button.tsx",
              content: "// custom button content",
              type: "registry:ui",
            },
          ],
        })
      })
    )

    const [result] = await getRegistryItems([itemUrl])
    expect(result).toMatchObject({
      name: "custom-button",
      type: "registry:ui",
      files: [
        {
          path: "ui/custom-button.tsx",
          content: "// custom button content",
          type: "registry:ui",
        },
      ],
    })
  })

  it("should handle mixed inputs (URLs, local files, and registry names)", async () => {
    const itemUrl = "https://example.com/url-item.json"
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
    const localFile = path.join(tempDir, "local-item.json")

    // Setup URL mock
    server.use(
      http.get(itemUrl, () => {
        return HttpResponse.json({
          name: "url-item",
          type: "registry:ui",
          files: [],
        })
      })
    )

    // Setup local file
    await fs.writeFile(
      localFile,
      JSON.stringify({
        name: "local-item",
        type: "registry:ui",
        files: [],
      })
    )

    try {
      // Fetch mixed: URL, local file, and registry name
      const results = await getRegistryItems([itemUrl, localFile, "button"])

      expect(results).toHaveLength(3)
      expect(results[0].name).toBe("url-item")
      expect(results[1].name).toBe("local-item")
      expect(results[2].name).toBe("button")
    } finally {
      await fs.unlink(localFile)
      await fs.rmdir(tempDir)
    }
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
      const [result] = await getRegistryItems([tempFile])

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

  it("should include error code in RegistryNotFoundError", async () => {
    server.use(
      http.get(`${REGISTRY_URL}/styles/new-york-v4/non-existent.json`, () => {
        return HttpResponse.json({ error: "Not found" }, { status: 404 })
      })
    )

    try {
      await getRegistryItems(["non-existent"])
    } catch (error) {
      expect(error).toBeInstanceOf(RegistryNotFoundError)
      if (error instanceof RegistryNotFoundError) {
        expect(error.code).toBe(RegistryErrorCode.NOT_FOUND)
        expect(error.statusCode).toBe(404)
        expect(error.suggestion).toContain("Check if the item name is correct")
        expect(error.url).toContain("non-existent.json")
      }
    }
  })

  it("should include error code in RegistryUnauthorizedError", async () => {
    server.use(
      http.get(`${REGISTRY_URL}/styles/new-york-v4/protected.json`, () => {
        return HttpResponse.json({ error: "Unauthorized" }, { status: 401 })
      })
    )

    try {
      await getRegistryItems(["protected"])
    } catch (error) {
      expect(error).toBeInstanceOf(RegistryUnauthorizedError)
      if (error instanceof RegistryUnauthorizedError) {
        expect(error.code).toBe(RegistryErrorCode.UNAUTHORIZED)
        expect(error.statusCode).toBe(401)
        expect(error.suggestion).toContain(
          "Check your authentication credentials"
        )
        expect(error.url).toContain("protected.json")
      }
    }
  })

  it("should include error code in RegistryForbiddenError", async () => {
    server.use(
      http.get(`${REGISTRY_URL}/styles/new-york-v4/forbidden.json`, () => {
        return HttpResponse.json({ error: "Forbidden" }, { status: 403 })
      })
    )

    try {
      await getRegistryItems(["forbidden"])
    } catch (error) {
      expect(error).toBeInstanceOf(RegistryForbiddenError)
      if (error instanceof RegistryForbiddenError) {
        expect(error.code).toBe(RegistryErrorCode.FORBIDDEN)
        expect(error.statusCode).toBe(403)
        expect(error.suggestion).toContain(
          "Check your authentication credentials"
        )
        expect(error.url).toContain("forbidden.json")
      }
    }
  })

  it("should include error code in RegistryFetchError for 500 errors", async () => {
    server.use(
      http.get(`${REGISTRY_URL}/styles/new-york-v4/server-error.json`, () => {
        return HttpResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        )
      })
    )

    try {
      await getRegistryItems(["server-error"])
    } catch (error) {
      expect(error).toBeInstanceOf(RegistryFetchError)
      if (error instanceof RegistryFetchError) {
        expect(error.code).toBe(RegistryErrorCode.FETCH_ERROR)
        expect(error.statusCode).toBe(500)
        expect(error.suggestion).toContain(
          "The registry server encountered an error"
        )
        expect(error.url).toContain("server-error.json")
      }
    }
  })

  it("should extract Zod validation issues in RegistryParseError", async () => {
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
    const tempFile = path.join(tempDir, "invalid-schema.json")

    const invalidData = {
      name: "test",
      // Missing required "type" field
      // Invalid "files" field (should be array)
      files: "not-an-array",
    }

    await fs.writeFile(tempFile, JSON.stringify(invalidData))

    try {
      await getRegistryItems([tempFile])
    } catch (error) {
      expect(error).toBeInstanceOf(RegistryParseError)
      if (error instanceof RegistryParseError) {
        expect(error.code).toBe(RegistryErrorCode.PARSE_ERROR)
        expect(error.message).toContain("Failed to parse registry item")
        expect(error.message).toContain(tempFile)
        // The message should include Zod validation issues
        expect(error.suggestion).toContain(
          "may be corrupted or have an invalid format"
        )
        expect(error.context?.item).toBe(tempFile)
      }
    } finally {
      await fs.unlink(tempFile)
      await fs.rmdir(tempDir)
    }
  })

  it("should include context in RegistryLocalFileError", async () => {
    const nonExistentFile = "/path/to/non/existent/file.json"

    try {
      await getRegistryItems([nonExistentFile])
    } catch (error) {
      expect(error).toBeInstanceOf(RegistryLocalFileError)
      if (error instanceof RegistryLocalFileError) {
        expect(error.code).toBe(RegistryErrorCode.LOCAL_FILE_ERROR)
        expect(error.filePath).toBe(nonExistentFile)
        expect(error.suggestion).toContain("Check if the file exists")
        expect(error.context?.filePath).toBe(nonExistentFile)
      }
    }
  })

  it("should serialize error to JSON correctly", async () => {
    server.use(
      http.get(`${REGISTRY_URL}/styles/new-york-v4/test-json.json`, () => {
        return HttpResponse.json({ error: "Not found" }, { status: 404 })
      })
    )

    try {
      await getRegistryItems(["test-json"])
    } catch (error) {
      if (error instanceof RegistryNotFoundError) {
        const json = error.toJSON()
        expect(json).toHaveProperty("name", "RegistryNotFoundError")
        expect(json).toHaveProperty("message")
        expect(json).toHaveProperty("code", RegistryErrorCode.NOT_FOUND)
        expect(json).toHaveProperty("statusCode", 404)
        expect(json).toHaveProperty("context")
        expect(json).toHaveProperty("suggestion")
        expect(json).toHaveProperty("timestamp")
        expect(json).toHaveProperty("stack")
      }
    }
  })

  it("should include timestamp in errors", async () => {
    server.use(
      http.get(`${REGISTRY_URL}/styles/new-york-v4/timestamp-test.json`, () => {
        return HttpResponse.json({ error: "Not found" }, { status: 404 })
      })
    )

    try {
      await getRegistryItems(["timestamp-test"])
    } catch (error) {
      if (error instanceof RegistryNotFoundError) {
        expect(error.timestamp).toBeInstanceOf(Date)
        expect(error.timestamp.getTime()).toBeLessThanOrEqual(Date.now())
      }
    }
  })

  it("should handle multiple validation errors in RegistryParseError", async () => {
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
    const tempFile = path.join(tempDir, "multiple-errors.json")

    const invalidData = {
      // Missing name and type
      files: 123, // Should be array
      dependencies: "not-an-array", // Should be array
    }

    await fs.writeFile(tempFile, JSON.stringify(invalidData))

    try {
      await getRegistryItems([tempFile])
    } catch (error) {
      expect(error).toBeInstanceOf(RegistryParseError)
      if (error instanceof RegistryParseError) {
        // The error message should contain multiple validation issues
        expect(error.message).toContain("Failed to parse registry item")
        // Check that context contains validation issues
        if (error.context && "validationIssues" in error.context) {
          const issues = error.context.validationIssues as Array<{
            path: string
            message: string
          }>
          expect(Array.isArray(issues)).toBe(true)
        }
      }
    } finally {
      await fs.unlink(tempFile)
      await fs.rmdir(tempDir)
    }
  })

  it("should include response body in RegistryFetchError", async () => {
    const errorResponse = {
      error: "Bad Request",
      details: "Invalid parameters",
    }
    server.use(
      http.get(`${REGISTRY_URL}/styles/new-york-v4/bad-request.json`, () => {
        return HttpResponse.json(errorResponse, { status: 400 })
      })
    )

    try {
      await getRegistryItems(["bad-request"])
    } catch (error) {
      expect(error).toBeInstanceOf(RegistryFetchError)
      if (error instanceof RegistryFetchError) {
        expect(error.code).toBe(RegistryErrorCode.FETCH_ERROR)
        expect(error.statusCode).toBe(400)
        expect(error.suggestion).toContain("client error")
        // Response body should be available as context
        expect(error.responseBody).toBeDefined()
      }
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

    const result = await getRegistry("@acme", { config: mockConfig })

    expect(result).toMatchObject({
      name: "@acme/registry",
      homepage: "https://acme.com",
      items: [
        { name: "button", type: "registry:ui" },
        { name: "card", type: "registry:ui" },
      ],
    })
  })

  it("should auto-append /registry to registry name", async () => {
    const registryData = {
      name: "@acme/registry",
      homepage: "https://acme.com",
      items: [],
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

    // Test both with and without /registry suffix
    const result1 = await getRegistry("@acme", { config: mockConfig })
    expect(result1.name).toBe("@acme/registry")

    const result2 = await getRegistry("@acme/registry", { config: mockConfig })
    expect(result2.name).toBe("@acme/registry")
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

    const result = await getRegistry("@private", { config: mockConfig })

    expect(result).toMatchObject({
      name: "@private/registry",
      homepage: "https://private.com",
      items: [{ name: "secure-component", type: "registry:ui" }],
    })

    expect(receivedHeaders.authorization).toBe("Bearer test-token")
  })

  it("should throw RegistryNotConfiguredError when registry is not configured", async () => {
    const mockConfig = {
      style: "new-york",
      tailwind: { baseColor: "neutral", cssVariables: true },
      registries: {},
    } as any

    await expect(
      getRegistry("@unknown", { config: mockConfig })
    ).rejects.toThrow(RegistryNotConfiguredError)
  })

  it("should throw RegistryParseError on invalid registry data", async () => {
    server.use(
      http.get("https://invalid.com/registry.json", () => {
        return HttpResponse.json({
          // Invalid registry data - missing required fields
          invalid: "data",
        })
      })
    )

    const mockConfig = {
      style: "new-york",
      tailwind: { baseColor: "neutral", cssVariables: true },
      registries: {
        "@invalid": {
          url: "https://invalid.com/{name}.json",
        },
      },
    } as any

    await expect(
      getRegistry("@invalid", { config: mockConfig })
    ).rejects.toThrow(RegistryParseError)
  })

  it("should throw RegistryFetchError on network error", async () => {
    server.use(
      http.get("https://error.com/registry.json", () => {
        return HttpResponse.json({ error: "Server Error" }, { status: 500 })
      })
    )

    const mockConfig = {
      style: "new-york",
      tailwind: { baseColor: "neutral", cssVariables: true },
      registries: {
        "@error": {
          url: "https://error.com/{name}.json",
        },
      },
    } as any

    await expect(getRegistry("@error", { config: mockConfig })).rejects.toThrow(
      RegistryFetchError
    )
  })

  it("should throw RegistryNotConfiguredError when registry is not in config", async () => {
    const mockConfig = {
      style: "new-york",
      tailwind: { baseColor: "neutral", cssVariables: true },
    } as any

    await expect(
      getRegistry("@nonexistent", { config: mockConfig })
    ).rejects.toThrow(RegistryNotConfiguredError)
  })

  it("should handle registry with no items gracefully", async () => {
    const registryData = {
      name: "@empty/registry",
      homepage: "https://empty.com",
      items: [],
    }

    server.use(
      http.get("https://empty.com/registry.json", () => {
        return HttpResponse.json(registryData)
      })
    )

    const mockConfig = {
      style: "new-york",
      tailwind: { baseColor: "neutral", cssVariables: true },
      registries: {
        "@empty": {
          url: "https://empty.com/{name}.json",
        },
      },
    } as any

    const result = await getRegistry("@empty", { config: mockConfig })
    expect(result).toMatchObject(registryData)
    expect(result.items).toHaveLength(0)
  })

  it("should handle 404 error from registry endpoint", async () => {
    server.use(
      http.get("https://notfound.com/registry.json", () => {
        return HttpResponse.json({ error: "Not Found" }, { status: 404 })
      })
    )

    const mockConfig = {
      style: "new-york",
      tailwind: { baseColor: "neutral", cssVariables: true },
      registries: {
        "@notfound": {
          url: "https://notfound.com/{name}.json",
        },
      },
    } as any

    await expect(
      getRegistry("@notfound", { config: mockConfig })
    ).rejects.toThrow(RegistryNotFoundError)
  })

  it("should handle 401 error from registry endpoint", async () => {
    server.use(
      http.get("https://unauthorized.com/registry.json", () => {
        return HttpResponse.json({ error: "Unauthorized" }, { status: 401 })
      })
    )

    const mockConfig = {
      style: "new-york",
      tailwind: { baseColor: "neutral", cssVariables: true },
      registries: {
        "@unauthorized": {
          url: "https://unauthorized.com/{name}.json",
        },
      },
    } as any

    await expect(
      getRegistry("@unauthorized", { config: mockConfig })
    ).rejects.toThrow(RegistryUnauthorizedError)
  })

  it("should handle 403 error from registry endpoint", async () => {
    server.use(
      http.get("https://forbidden.com/registry.json", () => {
        return HttpResponse.json({ error: "Forbidden" }, { status: 403 })
      })
    )

    const mockConfig = {
      style: "new-york",
      tailwind: { baseColor: "neutral", cssVariables: true },
      registries: {
        "@forbidden": {
          url: "https://forbidden.com/{name}.json",
        },
      },
    } as any

    await expect(
      getRegistry("@forbidden", { config: mockConfig })
    ).rejects.toThrow(RegistryForbiddenError)
  })

  it("should set headers in context when provided", async () => {
    const registryData = {
      name: "@headers-test/registry",
      homepage: "https://headers.com",
      items: [],
    }

    let receivedHeaders: Record<string, string> = {}
    server.use(
      http.get("https://headers.com/registry.json", ({ request }) => {
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
        "@headers-test": {
          url: "https://headers.com/{name}.json",
          headers: {
            "X-Custom-Header": "test-value",
            Authorization: "Bearer test-token",
          },
        },
      },
    } as any

    await getRegistry("@headers-test", { config: mockConfig })

    expect(receivedHeaders["x-custom-header"]).toBe("test-value")
    expect(receivedHeaders.authorization).toBe("Bearer test-token")
  })

  it("should not set headers in context when none provided", async () => {
    const registryData = {
      name: "@no-headers/registry",
      homepage: "https://noheaders.com",
      items: [],
    }

    server.use(
      http.get("https://noheaders.com/registry.json", () => {
        return HttpResponse.json(registryData)
      })
    )

    const mockConfig = {
      style: "new-york",
      tailwind: { baseColor: "neutral", cssVariables: true },
      registries: {
        "@no-headers": {
          url: "https://noheaders.com/{name}.json",
        },
      },
    } as any

    const result = await getRegistry("@no-headers", { config: mockConfig })
    expect(result).toMatchObject(registryData)
  })

  it("should handle registry items with slashes", async () => {
    const registryData = {
      name: "@acme/registry",
      homepage: "https://acme.com",
      items: [],
    }

    server.use(
      http.get("https://acme.com/sub/registry.json", () => {
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

    const result = await getRegistry("@acme/sub", { config: mockConfig })
    expect(result).toMatchObject(registryData)
  })

  it("should use configWithDefaults to fill missing config values", async () => {
    const registryData = {
      name: "@defaults/registry",
      homepage: "https://defaults.com",
      items: [],
    }

    server.use(
      http.get("https://defaults.com/registry.json", () => {
        return HttpResponse.json(registryData)
      })
    )

    const minimalConfig = {
      registries: {
        "@defaults": {
          url: "https://defaults.com/{name}.json",
        },
      },
    } as any

    const result = await getRegistry("@defaults", { config: minimalConfig })
    expect(result).toMatchObject(registryData)
  })

  it("should handle malformed JSON response", async () => {
    server.use(
      http.get("https://malformed.com/registry.json", () => {
        return new Response("{ malformed json }", {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      })
    )

    const mockConfig = {
      style: "new-york",
      tailwind: { baseColor: "neutral", cssVariables: true },
      registries: {
        "@malformed": {
          url: "https://malformed.com/{name}.json",
        },
      },
    } as any

    await expect(
      getRegistry("@malformed", { config: mockConfig })
    ).rejects.toThrow()
  })

  it("should throw RegistryParseError with proper context", async () => {
    const invalidData = {
      homepage: "https://invalid.com",
      items: "not-an-array",
    }

    server.use(
      http.get("https://parsetest.com/registry.json", () => {
        return HttpResponse.json(invalidData)
      })
    )

    const mockConfig = {
      style: "new-york",
      tailwind: { baseColor: "neutral", cssVariables: true },
      registries: {
        "@parsetest": {
          url: "https://parsetest.com/{name}.json",
        },
      },
    } as any

    try {
      await getRegistry("@parsetest/registry", { config: mockConfig })
      expect.fail("Should have thrown RegistryParseError")
    } catch (error) {
      expect(error).toBeInstanceOf(RegistryParseError)
      if (error instanceof RegistryParseError) {
        expect(error.message).toContain("Failed to parse registry")
        expect(error.message).toContain("@parsetest/registry")
        expect(error.context?.item).toBe("@parsetest/registry")
        expect(error.parseError).toBeDefined()
        if (error.parseError instanceof z.ZodError) {
          expect(error.parseError.errors.length).toBeGreaterThan(0)
        }
      }
    }
  })

  it("should throw RegistryInvalidNamespaceError for registry name without @ prefix", async () => {
    const mockConfig = {
      style: "new-york",
      tailwind: { baseColor: "neutral", cssVariables: true },
      registries: {},
    } as any

    await expect(
      getRegistry("invalid-name", { config: mockConfig })
    ).rejects.toThrow(RegistryInvalidNamespaceError)
  })

  it("should accept valid registry names with hyphens and underscores", async () => {
    const registryData = {
      name: "@test-123_abc/registry",
      homepage: "https://test.com",
      items: [],
    }

    server.use(
      http.get("https://test.com/registry.json", () => {
        return HttpResponse.json(registryData)
      })
    )

    const mockConfig = {
      style: "new-york",
      tailwind: { baseColor: "neutral", cssVariables: true },
      registries: {
        "@test-123_abc": {
          url: "https://test.com/{name}.json",
        },
      },
    } as any

    const result = await getRegistry("@test-123_abc", { config: mockConfig })
    expect(result).toMatchObject(registryData)
  })

  // Tests for URL support
  it("should fetch registry from a direct URL", async () => {
    const registryUrl = "https://example.com/custom-registry.json"

    server.use(
      http.get(registryUrl, () => {
        return HttpResponse.json({
          name: "custom-registry",
          homepage: "https://example.com",
          items: [
            { name: "button", type: "registry:ui" },
            { name: "card", type: "registry:ui" },
          ],
        })
      })
    )

    const result = await getRegistry(registryUrl)
    expect(result).toMatchObject({
      name: "custom-registry",
      homepage: "https://example.com",
      items: [
        { name: "button", type: "registry:ui" },
        { name: "card", type: "registry:ui" },
      ],
    })
  })

  it("should handle malformed URL gracefully", async () => {
    const badUrl = "not-a-valid-url"

    // Should throw RegistryInvalidNamespaceError for non-@ and non-URL strings
    await expect(getRegistry(badUrl)).rejects.toThrow(
      RegistryInvalidNamespaceError
    )
  })

  it("should distinguish between URL and registry name", async () => {
    // Test that it correctly identifies and handles a URL vs registry name
    const registryName = "@shadcn"
    const registryUrl = "https://ui.shadcn.com/registry.json"

    // Mock for URL
    server.use(
      http.get(registryUrl, () => {
        return HttpResponse.json({
          name: "shadcn-from-url",
          homepage: "https://ui.shadcn.com",
          items: [],
        })
      })
    )

    const mockConfig = {
      style: "new-york",
      tailwind: { baseColor: "neutral", cssVariables: true },
      registries: {
        "@shadcn": {
          url: "https://ui.shadcn.com/{name}.json",
        },
      },
    } as any

    // Fetch by URL should bypass registry config
    const urlResult = await getRegistry(registryUrl)
    expect(urlResult.name).toBe("shadcn-from-url")

    // Fetch by registry name should use config
    const nameResult = await getRegistry(registryName, { config: mockConfig })
    expect(nameResult).toBeDefined()
  })
})

describe("getRegistriesConfig", () => {
  it("should return built-in registries when no components.json exists", async () => {
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))

    try {
      const result = await getRegistriesConfig(tempDir)

      expect(result).toEqual({
        registries: BUILTIN_REGISTRIES,
      })
    } finally {
      await fs.rmdir(tempDir)
    }
  })

  it("should parse valid components.json with registries", async () => {
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
    const configFile = path.join(tempDir, "components.json")

    const config = {
      style: "new-york",
      tailwind: {
        config: "./tailwind.config.ts",
        css: "./src/app/globals.css",
        baseColor: "neutral",
        cssVariables: true,
      },
      registries: {
        "@acme": "https://acme.com/{name}.json",
        "@private": {
          url: "https://private.com/{name}.json",
          headers: {
            Authorization: "Bearer token",
          },
        },
      },
    }

    await fs.writeFile(configFile, JSON.stringify(config, null, 2))

    try {
      const result = await getRegistriesConfig(tempDir)

      // The result includes both custom and built-in registries
      expect(result.registries).toMatchObject({
        "@acme": "https://acme.com/{name}.json",
        "@private": {
          url: "https://private.com/{name}.json",
          headers: {
            Authorization: "Bearer token",
          },
        },
        "@shadcn": expect.any(String),
      })
    } finally {
      await fs.unlink(configFile)
      await fs.rmdir(tempDir)
    }
  })

  it("should throw ConfigParseError for invalid components.json", async () => {
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
    const configFile = path.join(tempDir, "components.json")

    const invalidConfig = {
      style: "new-york",
      registries: {
        "@invalid": {
          // Missing required 'url' field
          headers: {
            Authorization: "Bearer token",
          },
        },
      },
    }

    await fs.writeFile(configFile, JSON.stringify(invalidConfig, null, 2))

    try {
      await getRegistriesConfig(tempDir)
      expect.fail("Should have thrown ConfigParseError")
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigParseError)
      if (error instanceof ConfigParseError) {
        expect(error.cwd).toBe(tempDir)
        expect(error.message).toContain("Invalid components.json")
      }
    } finally {
      await fs.unlink(configFile)
      await fs.rmdir(tempDir)
    }
  })

  it("should handle components.json with no registries field", async () => {
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
    const configFile = path.join(tempDir, "components.json")

    const config = {
      style: "new-york",
      tailwind: {
        config: "./tailwind.config.ts",
        css: "./src/app/globals.css",
        baseColor: "neutral",
        cssVariables: true,
      },
      // No registries field
    }

    await fs.writeFile(configFile, JSON.stringify(config, null, 2))

    try {
      const result = await getRegistriesConfig(tempDir)

      // When no registries are defined, built-in registries are still included
      expect(result.registries).toEqual(BUILTIN_REGISTRIES)
    } finally {
      await fs.unlink(configFile)
      await fs.rmdir(tempDir)
    }
  })

  it("should handle malformed JSON file", async () => {
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
    const configFile = path.join(tempDir, "components.json")

    await fs.writeFile(configFile, "{ invalid json }")

    try {
      // Malformed JSON should throw an error from cosmiconfig
      await getRegistriesConfig(tempDir)
      expect.fail("Should have thrown an error")
    } catch (error) {
      // cosmiconfig throws a JSONError for malformed JSON
      expect((error as Error).message).toContain("JSON Error")
    } finally {
      await fs.unlink(configFile)
      await fs.rmdir(tempDir)
    }
  })

  it("should include error details in ConfigParseError", async () => {
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
    const configFile = path.join(tempDir, "components.json")

    const invalidConfig = {
      style: "new-york",
      registries: {
        "@invalid": {
          url: 123, // Should be string
        },
      },
    }

    await fs.writeFile(configFile, JSON.stringify(invalidConfig, null, 2))

    try {
      await getRegistriesConfig(tempDir)
      expect.fail("Should have thrown ConfigParseError")
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigParseError)
      if (error instanceof ConfigParseError) {
        expect(error.cwd).toBe(tempDir)
        expect(error.message).toContain("Invalid components.json")
        expect(error.message).toContain(tempDir)
        expect(error.code).toBe(RegistryErrorCode.INVALID_CONFIG)
        expect(error.suggestion).toContain("Check your components.json")
      }
    } finally {
      await fs.unlink(configFile)
      await fs.rmdir(tempDir)
    }
  })

  it("should handle complex registry configurations", async () => {
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
    const configFile = path.join(tempDir, "components.json")

    const config = {
      style: "new-york",
      registries: {
        "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
        "@acme": "https://acme.com/registry/{name}.json",
        "@private": {
          url: "https://private.registry.com/{name}.json",
          headers: {
            Authorization: "Bearer ${REGISTRY_TOKEN}",
            "X-Custom-Header": "value",
          },
        },
        "@local": "file:///local/registry/{name}.json",
      },
    }

    await fs.writeFile(configFile, JSON.stringify(config, null, 2))

    try {
      const result = await getRegistriesConfig(tempDir)

      expect(result.registries).toBeDefined()
      expect(result.registries?.["@shadcn"]).toBe(
        "https://ui.shadcn.com/r/styles/{style}/{name}.json"
      )
      expect(result.registries?.["@acme"]).toBe(
        "https://acme.com/registry/{name}.json"
      )
      expect(result.registries?.["@private"]).toEqual({
        url: "https://private.registry.com/{name}.json",
        headers: {
          Authorization: "Bearer ${REGISTRY_TOKEN}",
          "X-Custom-Header": "value",
        },
      })
      expect(result.registries?.["@local"]).toBe(
        "file:///local/registry/{name}.json"
      )
    } finally {
      await fs.unlink(configFile)
      await fs.rmdir(tempDir)
    }
  })

  describe("caching behavior", () => {
    it("should use cache by default", async () => {
      const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
      const configFile = path.join(tempDir, "components.json")

      const initialConfig = {
        style: "new-york",
        registries: {
          "@cached": "https://cached.com/{name}.json",
        },
      }

      await fs.writeFile(configFile, JSON.stringify(initialConfig, null, 2))

      try {
        // First call - should read from file
        const result1 = await getRegistriesConfig(tempDir)
        expect(result1.registries?.["@cached"]).toBe(
          "https://cached.com/{name}.json"
        )

        // Modify the file
        const updatedConfig = {
          style: "new-york",
          registries: {
            "@cached": "https://updated.com/{name}.json",
          },
        }
        await fs.writeFile(configFile, JSON.stringify(updatedConfig, null, 2))

        // Second call - should still return cached result (default behavior)
        const result2 = await getRegistriesConfig(tempDir)
        expect(result2.registries?.["@cached"]).toBe(
          "https://cached.com/{name}.json"
        )
      } finally {
        await fs.unlink(configFile)
        await fs.rmdir(tempDir)
      }
    })

    it("should use cache when explicitly enabled", async () => {
      const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
      const configFile = path.join(tempDir, "components.json")

      const initialConfig = {
        style: "new-york",
        registries: {
          "@test": "https://test.com/{name}.json",
        },
      }

      await fs.writeFile(configFile, JSON.stringify(initialConfig, null, 2))

      try {
        // First call with cache enabled
        const result1 = await getRegistriesConfig(tempDir, { useCache: true })
        expect(result1.registries?.["@test"]).toBe(
          "https://test.com/{name}.json"
        )

        // Modify the file
        const updatedConfig = {
          style: "new-york",
          registries: {
            "@test": "https://modified.com/{name}.json",
          },
        }
        await fs.writeFile(configFile, JSON.stringify(updatedConfig, null, 2))

        // Second call with cache enabled - should return cached result
        const result2 = await getRegistriesConfig(tempDir, { useCache: true })
        expect(result2.registries?.["@test"]).toBe(
          "https://test.com/{name}.json"
        )
      } finally {
        await fs.unlink(configFile)
        await fs.rmdir(tempDir)
      }
    })

    it("should bypass cache when useCache is false", async () => {
      const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
      const configFile = path.join(tempDir, "components.json")

      const initialConfig = {
        style: "new-york",
        registries: {
          "@nocache": "https://nocache.com/{name}.json",
        },
      }

      await fs.writeFile(configFile, JSON.stringify(initialConfig, null, 2))

      try {
        // First call - should read from file
        const result1 = await getRegistriesConfig(tempDir, { useCache: false })
        expect(result1.registries?.["@nocache"]).toBe(
          "https://nocache.com/{name}.json"
        )

        // Modify the file
        const updatedConfig = {
          style: "new-york",
          registries: {
            "@nocache": "https://fresh.com/{name}.json",
          },
        }
        await fs.writeFile(configFile, JSON.stringify(updatedConfig, null, 2))

        // Second call with cache disabled - should read fresh data
        const result2 = await getRegistriesConfig(tempDir, { useCache: false })
        expect(result2.registries?.["@nocache"]).toBe(
          "https://fresh.com/{name}.json"
        )
      } finally {
        await fs.unlink(configFile)
        await fs.rmdir(tempDir)
      }
    })

    it("should clear cache for subsequent calls when useCache is false", async () => {
      const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
      const configFile = path.join(tempDir, "components.json")

      const config1 = {
        style: "new-york",
        registries: {
          "@step1": "https://step1.com/{name}.json",
        },
      }

      await fs.writeFile(configFile, JSON.stringify(config1, null, 2))

      try {
        // First call with cache enabled
        const result1 = await getRegistriesConfig(tempDir, { useCache: true })
        expect(result1.registries?.["@step1"]).toBe(
          "https://step1.com/{name}.json"
        )

        // Update config
        const config2 = {
          style: "new-york",
          registries: {
            "@step2": "https://step2.com/{name}.json",
          },
        }
        await fs.writeFile(configFile, JSON.stringify(config2, null, 2))

        // Call with cache disabled - should clear cache and read fresh
        const result2 = await getRegistriesConfig(tempDir, { useCache: false })
        expect(result2.registries?.["@step2"]).toBe(
          "https://step2.com/{name}.json"
        )
        expect(result2.registries?.["@step1"]).toBeUndefined()

        // Update config again
        const config3 = {
          style: "new-york",
          registries: {
            "@step3": "https://step3.com/{name}.json",
          },
        }
        await fs.writeFile(configFile, JSON.stringify(config3, null, 2))

        // Call with cache disabled again to ensure we get fresh data
        const result3 = await getRegistriesConfig(tempDir, { useCache: false })
        expect(result3.registries?.["@step3"]).toBe(
          "https://step3.com/{name}.json"
        )
        expect(result3.registries?.["@step2"]).toBeUndefined()

        // Now a call with cache enabled should cache the current state
        const result4 = await getRegistriesConfig(tempDir, { useCache: true })
        expect(result4.registries?.["@step3"]).toBe(
          "https://step3.com/{name}.json"
        )
      } finally {
        await fs.unlink(configFile)
        await fs.rmdir(tempDir)
      }
    })

    it("should handle missing config with cache options", async () => {
      const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))

      try {
        // With cache enabled (default)
        const result1 = await getRegistriesConfig(tempDir)
        expect(result1.registries).toEqual(BUILTIN_REGISTRIES)

        // With cache explicitly enabled
        const result2 = await getRegistriesConfig(tempDir, { useCache: true })
        expect(result2.registries).toEqual(BUILTIN_REGISTRIES)

        // With cache disabled
        const result3 = await getRegistriesConfig(tempDir, { useCache: false })
        expect(result3.registries).toEqual(BUILTIN_REGISTRIES)
      } finally {
        await fs.rmdir(tempDir)
      }
    })

    it("should handle invalid config with cache options", async () => {
      const tempDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-test-"))
      const configFile = path.join(tempDir, "components.json")

      const invalidConfig = {
        style: "new-york",
        registries: {
          "@invalid": {
            // Missing required 'url' field
            headers: {
              Authorization: "Bearer token",
            },
          },
        },
      }

      await fs.writeFile(configFile, JSON.stringify(invalidConfig, null, 2))

      try {
        // Should throw regardless of cache setting
        await expect(
          getRegistriesConfig(tempDir, { useCache: true })
        ).rejects.toThrow(ConfigParseError)

        await expect(
          getRegistriesConfig(tempDir, { useCache: false })
        ).rejects.toThrow(ConfigParseError)
      } finally {
        await fs.unlink(configFile)
        await fs.rmdir(tempDir)
      }
    })
  })

  describe("getRegistriesIndex", () => {
    it("should fetch and parse the registries index successfully", async () => {
      const result = await getRegistriesIndex()

      expect(result).toEqual({
        "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
        "@example": "https://example.com/registry/styles/{style}/{name}.json",
        "@test": "https://test.com/registry/{name}.json",
      })
    })

    it("should respect cache options", async () => {
      // Test with cache disabled
      const result1 = await getRegistriesIndex({ useCache: false })
      expect(result1).toBeDefined()

      // Test with cache enabled
      const result2 = await getRegistriesIndex({ useCache: true })
      expect(result2).toBeDefined()

      // Results should be the same
      expect(result1).toEqual(result2)
    })

    it("should use default cache behavior when no options provided", async () => {
      const result = await getRegistriesIndex()
      expect(result).toBeDefined()
      expect(typeof result).toBe("object")
    })

    it("should handle network errors properly", async () => {
      server.use(
        http.get(`${REGISTRY_URL}/registries.json`, () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      await expect(getRegistriesIndex({ useCache: false })).rejects.toThrow()

      try {
        await getRegistriesIndex({ useCache: false })
      } catch (error) {
        expect(error).not.toBeInstanceOf(RegistriesIndexParseError)
      }
    })

    it("should handle invalid JSON response", async () => {
      server.use(
        http.get(`${REGISTRY_URL}/registries.json`, () => {
          return HttpResponse.json({
            "invalid-namespace": "some-url",
          })
        })
      )

      await expect(getRegistriesIndex({ useCache: false })).rejects.toThrow(
        RegistriesIndexParseError
      )
    })

    it("should handle network timeout", async () => {
      server.use(
        http.get(`${REGISTRY_URL}/registries.json`, () => {
          return HttpResponse.error()
        })
      )

      await expect(getRegistriesIndex({ useCache: false })).rejects.toThrow()
    })
  })
})
