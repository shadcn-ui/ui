import { EnvHttpProxyAgent } from "undici"
import { describe, expect, it } from "vitest"

import { createProxyDispatcher } from "./proxy"

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
      expect(dispatcher).toBeInstanceOf(EnvHttpProxyAgent)
    }
  })
})
