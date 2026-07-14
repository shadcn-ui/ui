import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"

import { fetchWithProxy } from "./proxy"

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("fetchWithProxy", () => {
  it("keeps the Authorization header on a same-domain redirect (apex -> www)", async () => {
    server.use(
      http.get("https://example.com/r/component.json", () => {
        return new HttpResponse(null, {
          status: 308,
          headers: { Location: "https://www.example.com/r/component.json" },
        })
      }),
      http.get("https://www.example.com/r/component.json", ({ request }) => {
        return HttpResponse.json({
          authorization: request.headers.get("authorization"),
        })
      })
    )

    const response = await fetchWithProxy(
      "https://example.com/r/component.json",
      {
        headers: new Headers({ Authorization: "Bearer secret-token" }),
      }
    )

    await expect(response.json()).resolves.toEqual({
      authorization: "Bearer secret-token",
    })
  })

  it("keeps the Authorization header on a subdomain -> apex redirect", async () => {
    server.use(
      http.get("https://www.example.com/r/component.json", () => {
        return new HttpResponse(null, {
          status: 301,
          headers: { Location: "https://example.com/r/component.json" },
        })
      }),
      http.get("https://example.com/r/component.json", ({ request }) => {
        return HttpResponse.json({
          authorization: request.headers.get("authorization"),
        })
      })
    )

    const response = await fetchWithProxy(
      "https://www.example.com/r/component.json",
      {
        headers: new Headers({ Authorization: "Bearer secret-token" }),
      }
    )

    await expect(response.json()).resolves.toEqual({
      authorization: "Bearer secret-token",
    })
  })

  it("drops the Authorization header on a cross-domain redirect", async () => {
    server.use(
      http.get("https://example.com/r/component.json", () => {
        return new HttpResponse(null, {
          status: 308,
          headers: { Location: "https://not-example.com/r/component.json" },
        })
      }),
      http.get("https://not-example.com/r/component.json", ({ request }) => {
        return HttpResponse.json({
          authorization: request.headers.get("authorization"),
          userAgent: request.headers.get("user-agent"),
        })
      })
    )

    const response = await fetchWithProxy(
      "https://example.com/r/component.json",
      {
        headers: new Headers({
          Authorization: "Bearer secret-token",
          "User-Agent": "shadcn",
        }),
      }
    )

    // Sensitive headers are dropped across origins, but non-sensitive headers
    // (like User-Agent) are preserved.
    await expect(response.json()).resolves.toEqual({
      authorization: null,
      userAgent: "shadcn",
    })
  })

  it("throws once the maximum number of redirects is exceeded", async () => {
    server.use(
      http.get("https://example.com/hop/:step", ({ params }) => {
        const step = Number(params.step)
        return new HttpResponse(null, {
          status: 308,
          headers: { Location: `https://example.com/hop/${step + 1}` },
        })
      })
    )

    await expect(fetchWithProxy("https://example.com/hop/0")).rejects.toThrow(
      /maximum number of redirects/
    )
  })

  it("returns the final response for a non-redirected request", async () => {
    server.use(
      http.get("https://example.com/r/component.json", () => {
        return HttpResponse.json({ ok: true })
      })
    )

    const response = await fetchWithProxy(
      "https://example.com/r/component.json"
    )

    await expect(response.json()).resolves.toEqual({ ok: true })
  })
})
