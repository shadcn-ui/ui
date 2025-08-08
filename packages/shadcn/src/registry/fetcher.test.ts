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

import { resolveRegistryUrl } from "./builder"
import { clearRegistryCache, fetchRegistry } from "./fetcher"
import { isUrl } from "./utils"

// Mock the handleError function to prevent process.exit in tests.
vi.mock("@/src/utils/handle-error", () => ({
  handleError: vi.fn(),
}))

// Mock the logger to prevent console output in tests.
vi.mock("@/src/utils/logger", () => ({
  logger: {
    error: vi.fn(),
    break: vi.fn(),
    log: vi.fn(),
  },
}))

const server = setupServer(
  http.get(`${REGISTRY_URL}/test.json`, () => {
    return HttpResponse.json({
      name: "test",
      type: "registry:ui",
    })
  }),
  http.get(`${REGISTRY_URL}/error.json`, () => {
    return HttpResponse.error()
  }),
  http.get(`${REGISTRY_URL}/not-found.json`, () => {
    return new HttpResponse(null, { status: 404 })
  }),
  http.get(`${REGISTRY_URL}/unauthorized.json`, () => {
    return new HttpResponse(null, { status: 401 })
  }),
  http.get(`${REGISTRY_URL}/forbidden.json`, () => {
    return new HttpResponse(null, { status: 403 })
  }),
  http.get("https://external.com/component.json", () => {
    return HttpResponse.json({
      name: "external",
      type: "registry:ui",
    })
  })
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  clearRegistryCache()
})
afterAll(() => server.close())

describe("isUrl", () => {
  it("should return true for valid URLs", () => {
    expect(isUrl("https://example.com")).toBe(true)
    expect(isUrl("http://localhost:3000")).toBe(true)
    expect(isUrl("https://example.com/path/to/file.json")).toBe(true)
  })

  it("should return false for non-URLs", () => {
    expect(isUrl("not-a-url")).toBe(false)
    expect(isUrl("/path/to/file")).toBe(false)
    expect(isUrl("./relative/path")).toBe(false)
    expect(isUrl("~/home/path")).toBe(false)
  })
})

describe("resolveRegistryUrl", () => {
  it("should return the URL as-is for valid URLs", () => {
    const url = "https://example.com/component.json"
    expect(resolveRegistryUrl(url)).toBe(url)
  })

  it("should append /json to v0 registry URLs", () => {
    const v0Url = "https://v0.dev/chat/b/abc123"
    expect(resolveRegistryUrl(v0Url)).toBe("https://v0.dev/chat/b/abc123/json")
  })

  it("should not append /json if already present", () => {
    const v0Url = "https://v0.dev/chat/b/abc123/json"
    expect(resolveRegistryUrl(v0Url)).toBe(v0Url)
  })

  it("should prepend REGISTRY_URL for non-URLs", () => {
    expect(resolveRegistryUrl("test.json")).toBe(`${REGISTRY_URL}/test.json`)
    expect(resolveRegistryUrl("styles/default/button.json")).toBe(
      `${REGISTRY_URL}/styles/default/button.json`
    )
  })
})

describe("fetchRegistry", () => {
  it("should fetch a single registry item", async () => {
    const result = await fetchRegistry(["test.json"])
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      name: "test",
      type: "registry:ui",
    })
  })

  it("should fetch multiple registry items in parallel", async () => {
    const result = await fetchRegistry(["test.json", "test.json"])
    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ name: "test" })
    expect(result[1]).toMatchObject({ name: "test" })
  })

  it("should fetch from external URLs", async () => {
    const result = await fetchRegistry(["https://external.com/component.json"])
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      name: "external",
      type: "registry:ui",
    })
  })

  it("should use cache when enabled", async () => {
    // First fetch - should hit the server
    const result1 = await fetchRegistry(["test.json"], { useCache: true })
    expect(result1[0]).toMatchObject({ name: "test" })

    // Second fetch - should use cache
    const result2 = await fetchRegistry(["test.json"], { useCache: true })
    expect(result2[0]).toMatchObject({ name: "test" })
  })

  it("should not use cache when disabled", async () => {
    // Mock the server to return different responses
    let callCount = 0
    server.use(
      http.get(`${REGISTRY_URL}/cache-test.json`, () => {
        callCount++
        return HttpResponse.json({
          name: `test-${callCount}`,
          type: "registry:ui",
        })
      })
    )

    const result1 = await fetchRegistry(["cache-test.json"], {
      useCache: false,
    })
    expect(result1[0]).toMatchObject({ name: "test-1" })

    const result2 = await fetchRegistry(["cache-test.json"], {
      useCache: false,
    })
    expect(result2[0]).toMatchObject({ name: "test-2" })
  })

  it("should handle 404 errors", async () => {
    const result = await fetchRegistry(["not-found.json"])
    expect(result).toEqual([])
  })

  it("should handle 401 errors", async () => {
    const result = await fetchRegistry(["unauthorized.json"])
    expect(result).toEqual([])
  })

  it("should handle 403 errors", async () => {
    const result = await fetchRegistry(["forbidden.json"])
    expect(result).toEqual([])
  })

  it("should handle network errors", async () => {
    const result = await fetchRegistry(["error.json"])
    expect(result).toEqual([])
  })
})

describe("clearRegistryCache", () => {
  it("should clear the cache", async () => {
    // First fetch - should hit the server
    const result1 = await fetchRegistry(["test.json"], { useCache: true })
    expect(result1[0]).toMatchObject({ name: "test" })

    // Clear cache
    clearRegistryCache()

    // Mock the server to return different response
    server.use(
      http.get(`${REGISTRY_URL}/test.json`, () => {
        return HttpResponse.json({
          name: "test-after-clear",
          type: "registry:ui",
        })
      })
    )

    // Third fetch - should hit the server again after cache clear
    const result3 = await fetchRegistry(["test.json"], { useCache: true })
    expect(result3[0]).toMatchObject({ name: "test-after-clear" })
  })
})
