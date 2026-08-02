import { Agent, EnvHttpProxyAgent } from "undici"
import { afterEach, describe, expect, it, vi } from "vitest"

import { createProxyDispatcher, fetchWithProxy } from "./proxy"

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("createProxyDispatcher", () => {
  it("returns undefined when no proxy env vars are set", () => {
    expect(createProxyDispatcher({})).toBeUndefined()
  })

  it("returns undefined when only no_proxy is set (no proxy to bypass)", () => {
    expect(createProxyDispatcher({ no_proxy: "*" })).toBeUndefined()
    expect(createProxyDispatcher({ NO_PROXY: "*" })).toBeUndefined()
  })

  it.each([
    ["https_proxy", "http://proxy.example.com:8080"],
    ["HTTPS_PROXY", "http://proxy.example.com:8080"],
    ["http_proxy", "http://proxy.example.com:8080"],
    ["HTTP_PROXY", "http://proxy.example.com:8080"],
  ])("returns an EnvHttpProxyAgent when %s is set", (name, value) => {
    const dispatcher = createProxyDispatcher({ [name]: value })
    expect(dispatcher).toBeInstanceOf(EnvHttpProxyAgent)
  })

  it("ignores empty proxy env var values", () => {
    expect(createProxyDispatcher({ HTTPS_PROXY: "" })).toBeUndefined()
    expect(createProxyDispatcher({ https_proxy: "" })).toBeUndefined()
    expect(createProxyDispatcher({ HTTP_PROXY: "" })).toBeUndefined()
    expect(createProxyDispatcher({ http_proxy: "" })).toBeUndefined()
  })

  it("returns an EnvHttpProxyAgent when multiple proxy vars are set", () => {
    const dispatcher = createProxyDispatcher({
      HTTPS_PROXY: "http://proxy.example.com:8080",
      HTTP_PROXY: "http://proxy.example.com:8080",
      NO_PROXY: "localhost",
    })
    expect(dispatcher).toBeInstanceOf(EnvHttpProxyAgent)
  })

  it("defaults to process.env when no env argument is passed", () => {
    // Behavior with the real process.env depends on the host; just assert it
    // returns either undefined or a Dispatcher, never throws.
    const dispatcher = createProxyDispatcher()
    if (dispatcher !== undefined) {
      expect(dispatcher).toBeDefined()
    }
  })

  describe("SOCKS via ALL_PROXY", () => {
    it.each([
      ["ALL_PROXY", "socks5://proxy.example.com:1080"],
      ["all_proxy", "socks5://proxy.example.com:1080"],
      ["ALL_PROXY", "socks4://proxy.example.com:1080"],
      ["ALL_PROXY", "socks://proxy.example.com:1080"],
      ["ALL_PROXY", "socks5h://proxy.example.com:1080"],
    ])(
      "returns a SOCKS-routed Agent (not EnvHttpProxyAgent) when %s=%s",
      (name, value) => {
        const dispatcher = createProxyDispatcher({ [name]: value })
        expect(dispatcher).toBeInstanceOf(Agent)
        expect(dispatcher).not.toBeInstanceOf(EnvHttpProxyAgent)
      }
    )

    it("does NOT trigger SOCKS path when ALL_PROXY scheme is http", () => {
      const dispatcher = createProxyDispatcher({
        ALL_PROXY: "http://proxy.example.com:8080",
      })
      // ALL_PROXY=http://... is unhandled; user should use HTTP_PROXY explicitly.
      expect(dispatcher).toBeUndefined()
    })

    it("ignores empty ALL_PROXY values", () => {
      expect(createProxyDispatcher({ ALL_PROXY: "" })).toBeUndefined()
      expect(createProxyDispatcher({ all_proxy: "" })).toBeUndefined()
    })

    it("ignores ALL_PROXY values that don't parse as URLs", () => {
      expect(createProxyDispatcher({ ALL_PROXY: "not a url" })).toBeUndefined()
    })
  })

  describe("priority ordering", () => {
    it("prefers SOCKS over HTTP when both are set", () => {
      const dispatcher = createProxyDispatcher({
        ALL_PROXY: "socks5://socks.example.com:1080",
        HTTPS_PROXY: "http://proxy.example.com:8080",
      })
      expect(dispatcher).toBeInstanceOf(Agent)
      expect(dispatcher).not.toBeInstanceOf(EnvHttpProxyAgent)
    })
  })
})

function redirectResponse(status: number, location: string) {
  return new Response(null, { status, headers: { location } })
}

function okResponse() {
  return new Response("ok", { status: 200 })
}

function headersForCall(mock: ReturnType<typeof vi.fn>, index: number) {
  return mock.mock.calls[index][1].headers as Headers
}

describe("fetchWithProxy", () => {
  it("returns a direct (non-redirect) response as-is", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(okResponse())
    vi.stubGlobal("fetch", fetchMock)

    const response = await fetchWithProxy(
      "https://registry.example.com/a.json",
      {
        headers: { "X-API-Key": "secret" },
      }
    )

    expect(response.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(headersForCall(fetchMock, 0).get("x-api-key")).toBe("secret")
  })

  it("keeps custom headers on a same-origin redirect", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        redirectResponse(302, "https://registry.example.com/final.json")
      )
      .mockResolvedValueOnce(okResponse())
    vi.stubGlobal("fetch", fetchMock)

    const response = await fetchWithProxy(
      "https://registry.example.com/start.json",
      {
        headers: {
          "X-API-Key": "secret",
          Accept: "application/json",
        },
      }
    )

    expect(response.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    const second = headersForCall(fetchMock, 1)
    expect(second.get("x-api-key")).toBe("secret")
    expect(second.get("accept")).toBe("application/json")
  })

  it("keeps custom headers on a relative (path-only) same-origin redirect", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(redirectResponse(307, "/final.json"))
      .mockResolvedValueOnce(okResponse())
    vi.stubGlobal("fetch", fetchMock)

    await fetchWithProxy("https://registry.example.com/start.json", {
      headers: { "X-API-Key": "secret" },
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(headersForCall(fetchMock, 1).get("x-api-key")).toBe("secret")
  })

  it("drops custom headers on a cross-origin redirect", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        redirectResponse(302, "https://attacker.example/steal")
      )
      .mockResolvedValueOnce(okResponse())
    vi.stubGlobal("fetch", fetchMock)

    const response = await fetchWithProxy(
      "https://registry.example.com/start.json",
      {
        headers: {
          "X-API-Key": "secret",
          Accept: "application/json",
          "User-Agent": "shadcn",
        },
      }
    )

    expect(response.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    const second = headersForCall(fetchMock, 1)
    // Sensitive custom header must not be forwarded to the new origin.
    expect(second.get("x-api-key")).toBeNull()
    // Non-sensitive headers may be kept.
    expect(second.get("accept")).toBe("application/json")
    expect(second.get("user-agent")).toBe("shadcn")
  })

  it("throws when the redirect chain exceeds the limit", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        redirectResponse(302, "https://registry.example.com/loop")
      )
    vi.stubGlobal("fetch", fetchMock)

    await expect(
      fetchWithProxy("https://registry.example.com/start", {
        headers: { "X-API-Key": "secret" },
      })
    ).rejects.toThrow(/Too many redirects/)
  })
})
