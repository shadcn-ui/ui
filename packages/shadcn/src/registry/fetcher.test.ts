import { REGISTRY_URL } from "@/src/registry/constants"
import {
  RegistryFetchError,
  RegistryForbiddenError,
  RegistryNotFoundError,
  RegistryUnauthorizedError,
} from "@/src/registry/errors"
import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"

import { clearRegistryCache, fetchRegistry } from "./fetcher"

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
    await expect(fetchRegistry(["not-found.json"])).rejects.toThrow(
      RegistryNotFoundError
    )
  })

  it("should handle 401 errors", async () => {
    await expect(fetchRegistry(["unauthorized.json"])).rejects.toThrow(
      RegistryUnauthorizedError
    )
  })

  it("should handle 403 errors", async () => {
    await expect(fetchRegistry(["forbidden.json"])).rejects.toThrow(
      RegistryForbiddenError
    )
  })

  it("should handle network errors", async () => {
    await expect(fetchRegistry(["error.json"])).rejects.toThrow()
  })

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
