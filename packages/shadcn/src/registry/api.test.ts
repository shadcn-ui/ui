import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import { REGISTRY_URL } from "@/src/registry/constants"
import {
  RegistryErrorCode,
  RegistryFetchError,
  RegistryForbiddenError,
  RegistryLocalFileError,
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

import { getRegistry, getRegistryItems } from "./api"

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

  it("should throw error on 404", async () => {
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

    await expect(getRegistry("@example/registry", mockConfig)).rejects.toThrow(
      RegistryNotFoundError
    )
  })
})

describe("Enhanced Error Handling", () => {
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
