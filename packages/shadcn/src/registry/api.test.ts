import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"

import { clearRegistryCache, fetchRegistry } from "./api"

const REGISTRY_URL = "https://ui.shadcn.com/r"

const server = setupServer(
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
