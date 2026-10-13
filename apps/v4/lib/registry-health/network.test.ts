import { describe, expect, it, vi } from "vitest"

import {
  createGuardedConnector,
  detectBotChallenge,
  fetchRegistryJson,
  isForbiddenAddress,
  validateRegistryUrl,
} from "./network"

describe("network destination safety", () => {
  it.each([
    "127.0.0.1",
    "10.0.0.1",
    "168.63.129.16",
    "169.254.169.254",
    "192.0.2.1",
    "192.88.99.1",
    "192.168.1.1",
    "::1",
    "64:ff9b::7f00:1",
    "100::",
    "2001::1",
    "2002:7f00:1::",
    "fe80::1",
    "fec0::1",
    "fd00:ec2::254",
    "::ffff:127.0.0.1",
  ])("rejects non-public address %s", (address) => {
    expect(isForbiddenAddress(address)).toBe(true)
  })

  it.each(["1.1.1.1", "8.8.8.8", "2606:4700:4700::1111"])(
    "allows public address %s",
    (address) => {
      expect(isForbiddenAddress(address)).toBe(false)
    }
  )

  it("rejects unsupported protocols and embedded credentials", () => {
    expect(() => validateRegistryUrl("file:///etc/passwd")).toThrow(
      "unsupported_protocol"
    )
    expect(() =>
      validateRegistryUrl("https://user:secret@example.com/registry.json")
    ).toThrow("embedded_credentials")
  })

  it("pins the validated address used by the socket connector", async () => {
    const connect = vi.fn((_options, callback) => callback(null, {}))
    const connector = createGuardedConnector({
      resolve: async () => [{ address: "203.0.114.10", family: 4 }],
      connect,
    })

    await new Promise<void>((resolve, reject) => {
      connector(
        {
          hostname: "registry.example.com",
          protocol: "https:",
          port: "443",
        },
        (error, _socket) => (error ? reject(error) : resolve())
      )
    })

    expect(connect).toHaveBeenCalledWith(
      expect.objectContaining({
        hostname: "203.0.114.10",
        servername: "registry.example.com",
      }),
      expect.any(Function)
    )
  })

  it("rejects a hostname when DNS includes a private address", async () => {
    const connector = createGuardedConnector({
      resolve: async () => [
        { address: "203.0.114.10", family: 4 },
        { address: "127.0.0.1", family: 4 },
      ],
      connect: vi.fn(),
    })

    await expect(
      new Promise<void>((resolve, reject) => {
        connector(
          {
            hostname: "registry.example.com",
            protocol: "https:",
            port: "443",
          },
          (error, _socket) => (error ? reject(error) : resolve())
        )
      })
    ).rejects.toThrow("forbidden_address")
  })
})

describe("fetchRegistryJson", () => {
  const dispatcher = {
    close: vi.fn(async () => {}),
  }

  it("validates every manual redirect target", async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(null, {
          status: 302,
          headers: { location: "http://127.0.0.1/registry.json" },
        })
    )

    await expect(
      fetchRegistryJson("https://example.com/registry.json", {
        fetchImpl,
        createDispatcher: () => dispatcher as never,
        attempts: 1,
      })
    ).resolves.toMatchObject({
      ok: false,
      failureCode: "forbidden_address",
    })
  })

  it("shares one timeout budget across redirects", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-08-24T12:00:00.000Z"))

    try {
      const fetchImpl = vi
        .fn()
        .mockImplementationOnce(async () => {
          vi.setSystemTime(new Date("2026-08-24T12:00:00.080Z"))
          return new Response(null, {
            status: 302,
            headers: { location: "https://example.com/final.json" },
          })
        })
        .mockImplementationOnce(
          async (_url: string, init: RequestInit) =>
            new Promise<Response>((_resolve, reject) => {
              init.signal?.addEventListener("abort", () => {
                reject(new DOMException("Aborted", "AbortError"))
              })
            })
        )

      const resultPromise = fetchRegistryJson(
        "https://example.com/registry.json",
        {
          fetchImpl,
          createDispatcher: () => dispatcher as never,
          attempts: 1,
          timeoutMs: 100,
        }
      )

      await vi.advanceTimersByTimeAsync(20)

      await expect(resultPromise).resolves.toMatchObject({
        ok: false,
        failureCode: "timeout",
      })
      expect(fetchImpl).toHaveBeenCalledTimes(2)
    } finally {
      vi.useRealTimers()
    }
  })

  it("retries a retryable response and honors Retry-After", async () => {
    const wait = vi.fn(async () => {})
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(
        new Response("busy", {
          status: 429,
          headers: { "retry-after": "1" },
        })
      )
      .mockResolvedValueOnce(
        new Response('{"name":"acme"}', {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      )

    const result = await fetchRegistryJson(
      "https://example.com/registry.json",
      {
        fetchImpl,
        createDispatcher: () => dispatcher as never,
        wait,
      }
    )

    expect(result.ok).toBe(true)
    expect(fetchImpl).toHaveBeenCalledTimes(2)
    expect(wait).toHaveBeenCalledWith(1000)
  })

  it("enforces the response-size limit", async () => {
    const result = await fetchRegistryJson(
      "https://example.com/registry.json",
      {
        fetchImpl: async () => new Response("too large"),
        createDispatcher: () => dispatcher as never,
        maximumBytes: 3,
        attempts: 1,
      }
    )

    expect(result).toMatchObject({
      ok: false,
      failureCode: "body_too_large",
    })
  })
})

describe("detectBotChallenge", () => {
  it("recognizes a provider challenge page", () => {
    expect(
      detectBotChallenge({
        status: 403,
        contentType: "text/html",
        server: "cloudflare",
        body: "<title>Just a moment...</title><div class='cf-chl-test'>",
      })
    ).toBe(true)
  })

  it("does not classify an ordinary JSON 403 as a challenge", () => {
    expect(
      detectBotChallenge({
        status: 403,
        contentType: "application/json",
        server: "",
        body: '{"error":"forbidden"}',
      })
    ).toBe(false)
  })
})
