import { type AddressInfo, connect as netConnect } from "net"
import { createServer, type Server } from "http"
import { fetch } from "undici"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"

import { createProxyDispatcher } from "./proxy"

const PROXY_ENV_VARS = [
  "HTTP_PROXY",
  "HTTPS_PROXY",
  "http_proxy",
  "https_proxy",
  "NO_PROXY",
  "no_proxy",
] as const

let originServer: Server
let originUrl: string
let proxyServer: Server
let proxyUrl: string
let proxyHits: { url: string; method: string }[] = []
let savedEnv: Record<string, string | undefined> = {}

function listen(server: Server): Promise<string> {
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { address, port } = server.address() as AddressInfo
      resolve(`http://${address}:${port}`)
    })
  })
}

function close(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()))
  })
}

beforeAll(async () => {
  originServer = createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ from: "origin" }))
  })
  originUrl = await listen(originServer)

  proxyServer = createServer((req, res) => {
    proxyHits.push({ url: req.url ?? "", method: req.method ?? "" })
    const body = JSON.stringify({ from: "proxy-direct" })
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body).toString(),
      Connection: "close",
    })
    res.end(body)
  })
  // Real CONNECT-tunneling proxy: when undici sends `CONNECT host:port`, open
  // a TCP socket to that destination and pipe bytes both ways. This matches
  // real corporate proxies and undici's default proxy behavior.
  proxyServer.on("connect", (req, clientSocket, head) => {
    proxyHits.push({ url: req.url ?? "", method: "CONNECT" })
    const [host, portStr] = (req.url ?? "").split(":")
    const port = Number(portStr)
    if (!host || !Number.isFinite(port)) {
      clientSocket.end("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n")
      return
    }
    const upstream = netConnect(port, host, () => {
      clientSocket.write("HTTP/1.1 200 Connection Established\r\n\r\n")
      if (head.length > 0) upstream.write(head)
      upstream.pipe(clientSocket)
      clientSocket.pipe(upstream)
    })
    upstream.on("error", () => clientSocket.end())
    clientSocket.on("error", () => upstream.end())
  })
  proxyUrl = await listen(proxyServer)

  for (const name of PROXY_ENV_VARS) {
    savedEnv[name] = process.env[name]
    delete process.env[name]
  }
})

afterAll(async () => {
  await close(originServer)
  await close(proxyServer)
  for (const name of PROXY_ENV_VARS) {
    if (savedEnv[name] === undefined) {
      delete process.env[name]
    } else {
      process.env[name] = savedEnv[name]
    }
  }
})

afterEach(() => {
  proxyHits = []
  for (const name of PROXY_ENV_VARS) {
    delete process.env[name]
  }
})

describe("proxy dispatcher integration", () => {
  it("makes direct requests when no proxy env is set", async () => {
    const dispatcher = createProxyDispatcher()
    expect(dispatcher).toBeUndefined()

    const response = await fetch(`${originUrl}/test.json`)
    const body = (await response.json()) as { from: string }
    expect(body.from).toBe("origin")
    expect(proxyHits).toHaveLength(0)
  })

  it.each(["HTTP_PROXY", "http_proxy"] as const)(
    "routes HTTP requests through the proxy via CONNECT tunnel when %s is set",
    async (name) => {
      process.env[name] = proxyUrl
      const dispatcher = createProxyDispatcher()

      const response = await fetch(`${originUrl}/test.json`, { dispatcher })
      const body = (await response.json()) as { from: string }
      // Response body comes from origin (proxy just tunneled the bytes).
      expect(body.from).toBe("origin")
      // Proof the proxy was used: a CONNECT was recorded against the origin.
      const originHost = new URL(originUrl).host
      expect(proxyHits).toEqual([{ url: originHost, method: "CONNECT" }])
    }
  )

  it.each(["NO_PROXY", "no_proxy"] as const)(
    "bypasses the proxy when %s matches the destination host",
    async (noProxyName) => {
      process.env.HTTP_PROXY = proxyUrl
      process.env[noProxyName] = "127.0.0.1"
      const dispatcher = createProxyDispatcher()

      const response = await fetch(`${originUrl}/test.json`, { dispatcher })
      const body = (await response.json()) as { from: string }
      expect(body.from).toBe("origin")
      expect(proxyHits).toHaveLength(0)
    }
  )

  it("routes through the proxy when destination is not in NO_PROXY list", async () => {
    process.env.HTTP_PROXY = proxyUrl
    process.env.NO_PROXY = "example.com"
    const dispatcher = createProxyDispatcher()

    const response = await fetch(`${originUrl}/test.json`, { dispatcher })
    const body = (await response.json()) as { from: string }
    expect(body.from).toBe("origin")
    expect(proxyHits).toHaveLength(1)
    expect(proxyHits[0].method).toBe("CONNECT")
  })
})
