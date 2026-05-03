import { Agent, EnvHttpProxyAgent } from "undici"
import { describe, expect, it } from "vitest"

import { createProxyDispatcher, PacDispatcher } from "./proxy"

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
      expect(
        createProxyDispatcher({ ALL_PROXY: "not a url" })
      ).toBeUndefined()
    })
  })

  describe("PAC via PAC_URL", () => {
    it.each(["PAC_URL", "pac_url"] as const)(
      "returns a PacDispatcher when %s is set",
      (name) => {
        const dispatcher = createProxyDispatcher({
          [name]: "http://example.com/proxy.pac",
        })
        expect(dispatcher).toBeInstanceOf(PacDispatcher)
      }
    )

    it("ignores empty PAC_URL", () => {
      expect(createProxyDispatcher({ PAC_URL: "" })).toBeUndefined()
      expect(createProxyDispatcher({ pac_url: "" })).toBeUndefined()
    })

    it("ignores PAC_URL that is not a valid URL", () => {
      expect(createProxyDispatcher({ PAC_URL: "not a url" })).toBeUndefined()
    })
  })

  describe("priority ordering", () => {
    it("prefers PAC over SOCKS over HTTP", () => {
      const dispatcher = createProxyDispatcher({
        PAC_URL: "http://example.com/proxy.pac",
        ALL_PROXY: "socks5://socks.example.com:1080",
        HTTPS_PROXY: "http://proxy.example.com:8080",
      })
      expect(dispatcher).toBeInstanceOf(PacDispatcher)
    })

    it("prefers SOCKS over HTTP when both are set without PAC", () => {
      const dispatcher = createProxyDispatcher({
        ALL_PROXY: "socks5://socks.example.com:1080",
        HTTPS_PROXY: "http://proxy.example.com:8080",
      })
      expect(dispatcher).toBeInstanceOf(Agent)
      expect(dispatcher).not.toBeInstanceOf(EnvHttpProxyAgent)
      expect(dispatcher).not.toBeInstanceOf(PacDispatcher)
    })
  })
})
