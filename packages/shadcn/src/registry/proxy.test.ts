import { afterEach, describe, expect, it, vi } from "vitest"

import { fetchWithProxy } from "./proxy"

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
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
