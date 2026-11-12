import { track } from "@vercel/analytics/server"
import { describe, expect, it, vi } from "vitest"

import {
  buildRegistryBase,
  DEFAULT_CONFIG,
  POINTER_CURSOR_SELECTOR,
} from "@/registry/config"

import { GET, OPTIONS } from "./route"

vi.mock("@vercel/analytics/server", () => ({ track: vi.fn() }))

function createRequest(search = "") {
  const searchParams = new URLSearchParams(
    Object.entries(DEFAULT_CONFIG).map(([key, value]) => [key, String(value)])
  )
  const url = new URL(`http://localhost:4000/init${search}`)

  for (const [key, value] of url.searchParams) {
    searchParams.set(key, value)
  }

  return {
    nextUrl: new URL(`http://localhost:4000/init?${searchParams}`),
  } as Parameters<typeof GET>[0]
}

describe("GET /init", () => {
  it("returns the full registry base when only is omitted", async () => {
    const response = await GET(createRequest())
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual(buildRegistryBase(DEFAULT_CONFIG))
    expect(json.css["@layer base"][POINTER_CURSOR_SELECTOR]).toBeUndefined()
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*")
    expect(response.headers.has("Access-Control-Allow-Credentials")).toBe(false)
  })

  it("returns pointer cursor css when pointer is enabled", async () => {
    const response = await GET(createRequest("?pointer=true"))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.css["@layer base"][POINTER_CURSOR_SELECTOR]).toEqual({
      cursor: "pointer",
    })
  })

  it("returns a sparse registry base when only is provided", async () => {
    const response = await GET(createRequest("?only=theme"))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.type).toBe("registry:base")
    expect(json.config).toEqual({
      menuColor: "default",
      menuAccent: "subtle",
      tailwind: {
        baseColor: "neutral",
      },
    })
    expect(json.cssVars.light).toBeDefined()
    expect(json.cssVars.light.radius).toBe("0.625rem")
    expect(json.dependencies).toBeUndefined()
    expect(json.registryDependencies).toBeUndefined()
  })

  it("rejects unsupported only values", async () => {
    const response = await GET(createRequest("?only=icon"))
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe(
      "Invalid only value. Use one or more of: theme, font"
    )
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*")
  })

  it("allows cross-origin clients to read invalid configuration errors", async () => {
    const response = await GET(createRequest("?base=not-a-base"))

    expect(response.status).toBe(400)
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*")
    expect(response.headers.has("Access-Control-Allow-Credentials")).toBe(false)
  })

  it("keeps unexpected 500 response unchanged without CORS headers", async () => {
    vi.mocked(track).mockImplementationOnce(() => {
      throw new Error("synthetic internal detail")
    })

    const response = await GET(createRequest("?track=1"))

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: "synthetic internal detail",
    })
    expect(response.headers.has("Access-Control-Allow-Origin")).toBe(false)
  })

  it("handles read-only preflight requests without credentialed access", async () => {
    const response = await OPTIONS()

    expect(response.status).toBe(204)
    expect(response.headers.get("Allow")).toBe("GET, HEAD, OPTIONS")
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*")
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "GET, HEAD, OPTIONS"
    )
    expect(response.headers.get("Access-Control-Allow-Headers")).toBe(
      "Accept, User-Agent"
    )
    expect(response.headers.has("Access-Control-Allow-Credentials")).toBe(false)
  })
})
