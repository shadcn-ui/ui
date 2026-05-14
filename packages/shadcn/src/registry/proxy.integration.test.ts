import {
  type AddressInfo,
  connect as netConnect,
  createServer as netCreateServer,
  type Server as NetServer,
  type Socket,
} from "net"
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
  "ALL_PROXY",
  "all_proxy",
  "PAC_URL",
  "pac_url",
] as const

let originServer: Server
let originUrl: string
let proxyServer: Server
let proxyUrl: string
let socksServer: NetServer
let socksUrl: string
let pacServer: Server
let pacUrl: string
let pacScript = ""
let proxyHits: { url: string; method: string }[] = []
let socksHits: { host: string; port: number }[] = []
let savedEnv: Record<string, string | undefined> = {}

function listen(server: Server): Promise<string> {
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { address, port } = server.address() as AddressInfo
      resolve(`http://${address}:${port}`)
    })
  })
}

function listenTcp(server: NetServer): Promise<{ host: string; port: number }> {
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { address, port } = server.address() as AddressInfo
      resolve({ host: address, port })
    })
  })
}

function close(server: Server | NetServer): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()))
  })
}

// Minimal SOCKS5 server (no auth) for integration tests. Implements the
// CONNECT command for IPv4 and domain destinations — enough to route an
// HTTP fetch through it. References RFC 1928.
function createSocksServer(): NetServer {
  return netCreateServer((client: Socket) => {
    let phase: "greeting" | "request" | "tunneling" = "greeting"
    let buffer = Buffer.alloc(0)

    const onData = (chunk: Buffer) => {
      buffer = Buffer.concat([buffer, chunk])

      if (phase === "greeting") {
        if (buffer.length < 2) return
        const nMethods = buffer[1]
        if (buffer.length < 2 + nMethods) return
        // Always reply with no-auth (0x00).
        client.write(Buffer.from([0x05, 0x00]))
        buffer = buffer.subarray(2 + nMethods)
        phase = "request"
      }

      if (phase === "request") {
        if (buffer.length < 4) return
        const version = buffer[0]
        const cmd = buffer[1]
        const atyp = buffer[3]
        if (version !== 0x05 || cmd !== 0x01) {
          client.end(
            Buffer.from([0x05, 0x07, 0x00, 0x01, 0, 0, 0, 0, 0, 0])
          )
          return
        }
        let host: string
        let headerLen: number
        if (atyp === 0x01) {
          if (buffer.length < 10) return
          host = `${buffer[4]}.${buffer[5]}.${buffer[6]}.${buffer[7]}`
          headerLen = 10
        } else if (atyp === 0x03) {
          if (buffer.length < 5) return
          const dlen = buffer[4]
          if (buffer.length < 5 + dlen + 2) return
          host = buffer.subarray(5, 5 + dlen).toString("utf8")
          headerLen = 5 + dlen + 2
        } else {
          client.end(
            Buffer.from([0x05, 0x08, 0x00, 0x01, 0, 0, 0, 0, 0, 0])
          )
          return
        }
        const port = buffer.readUInt16BE(headerLen - 2)
        socksHits.push({ host, port })

        const upstream = netConnect(port, host, () => {
          // Reply: success, IPv4, 0.0.0.0:0 as bound address (acceptable per RFC).
          client.write(
            Buffer.from([0x05, 0x00, 0x00, 0x01, 0, 0, 0, 0, 0, 0])
          )
          phase = "tunneling"
          const remainder = buffer.subarray(headerLen)
          if (remainder.length > 0) upstream.write(remainder)
          buffer = Buffer.alloc(0)
          upstream.pipe(client)
          client.pipe(upstream)
        })
        upstream.on("error", () => client.end())
        client.on("error", () => upstream.end())
      }
    }

    client.on("data", onData)
    client.on("error", () => {})
  })
}

beforeAll(async () => {
  originServer = createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ from: "origin" }))
  })
  originUrl = await listen(originServer)

  // The test proxy is CONNECT-only — it tunnels TCP via the `connect` handler
  // below. Direct HTTP requests (treating the proxy as an origin server) are
  // not a path undici exercises, so we reject them with 502 rather than
  // returning content that no test would assert on.
  proxyServer = createServer((req, res) => {
    proxyHits.push({ url: req.url ?? "", method: req.method ?? "" })
    res.writeHead(502, { Connection: "close" })
    res.end("Bad Gateway: this proxy only supports CONNECT tunneling")
  })
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

  socksServer = createSocksServer()
  const socksAddr = await listenTcp(socksServer)
  socksUrl = `socks5://${socksAddr.host}:${socksAddr.port}`

  // Server that serves the current pacScript content. Tests mutate pacScript
  // to control which directive PAC will return.
  pacServer = createServer((_req, res) => {
    res.writeHead(200, {
      "Content-Type": "application/x-ns-proxy-autoconfig",
      "Content-Length": Buffer.byteLength(pacScript).toString(),
      Connection: "close",
    })
    res.end(pacScript)
  })
  pacUrl = `${await listen(pacServer)}/proxy.pac`

  for (const name of PROXY_ENV_VARS) {
    savedEnv[name] = process.env[name]
    delete process.env[name]
  }
})

afterAll(async () => {
  await close(originServer)
  await close(proxyServer)
  await close(socksServer)
  await close(pacServer)
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
  socksHits = []
  pacScript = ""
  for (const name of PROXY_ENV_VARS) {
    delete process.env[name]
  }
})

describe("test proxy server contract", () => {
  // Documents the test proxy's intended behavior so future edits to the
  // request handler don't silently introduce a code path that no test
  // exercises. The proxy implements CONNECT tunneling only — direct HTTP
  // requests to it (treating it as an origin server) are not supported.
  it("responds 502 to direct (non-CONNECT) HTTP requests", async () => {
    const response = await fetch(`${proxyUrl}/anything`)
    expect(response.status).toBe(502)
  })
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
    const originHost = new URL(originUrl).host
    expect(proxyHits).toEqual([{ url: originHost, method: "CONNECT" }])
  })

  describe("SOCKS via ALL_PROXY", () => {
    it.each(["ALL_PROXY", "all_proxy"] as const)(
      "routes HTTP requests through the SOCKS5 proxy when %s=socks5://...",
      async (name) => {
        process.env[name] = socksUrl
        const dispatcher = createProxyDispatcher()

        const response = await fetch(`${originUrl}/test.json`, { dispatcher })
        const body = (await response.json()) as { from: string }
        expect(body.from).toBe("origin")
        // SOCKS server saw a CONNECT to the origin host:port.
        const originAddr = new URL(originUrl)
        expect(socksHits).toEqual([
          { host: originAddr.hostname, port: Number(originAddr.port) },
        ])
        // HTTP proxy was not involved.
        expect(proxyHits).toHaveLength(0)
      }
    )

    it("does not invoke SOCKS when ALL_PROXY scheme is http (falls through to direct)", async () => {
      process.env.ALL_PROXY = `http://127.0.0.1:1`
      const dispatcher = createProxyDispatcher()
      expect(dispatcher).toBeUndefined()

      const response = await fetch(`${originUrl}/test.json`)
      const body = (await response.json()) as { from: string }
      expect(body.from).toBe("origin")
      expect(socksHits).toHaveLength(0)
    })
  })

  describe("PAC via PAC_URL", () => {
    it("dispatches direct when PAC returns DIRECT", async () => {
      pacScript = `function FindProxyForURL(url, host) { return "DIRECT"; }`
      process.env.PAC_URL = pacUrl
      const dispatcher = createProxyDispatcher()

      const response = await fetch(`${originUrl}/test.json`, { dispatcher })
      const body = (await response.json()) as { from: string }
      expect(body.from).toBe("origin")
      expect(proxyHits).toHaveLength(0)
      expect(socksHits).toHaveLength(0)
    })

    it("routes via HTTP CONNECT proxy when PAC returns PROXY host:port", async () => {
      const proxyHost = new URL(proxyUrl).host
      pacScript = `function FindProxyForURL(url, host) { return "PROXY ${proxyHost}"; }`
      process.env.PAC_URL = pacUrl
      const dispatcher = createProxyDispatcher()

      const response = await fetch(`${originUrl}/test.json`, { dispatcher })
      const body = (await response.json()) as { from: string }
      expect(body.from).toBe("origin")
      const originHost = new URL(originUrl).host
      expect(proxyHits).toEqual([{ url: originHost, method: "CONNECT" }])
      expect(socksHits).toHaveLength(0)
    })

    it("routes via SOCKS5 when PAC returns SOCKS5 host:port", async () => {
      const socksAddr = new URL(socksUrl)
      pacScript = `function FindProxyForURL(url, host) { return "SOCKS5 ${socksAddr.hostname}:${socksAddr.port}"; }`
      process.env.PAC_URL = pacUrl
      const dispatcher = createProxyDispatcher()

      const response = await fetch(`${originUrl}/test.json`, { dispatcher })
      const body = (await response.json()) as { from: string }
      expect(body.from).toBe("origin")
      const originAddr = new URL(originUrl)
      expect(socksHits).toEqual([
        { host: originAddr.hostname, port: Number(originAddr.port) },
      ])
      expect(proxyHits).toHaveLength(0)
    })

    it("can return different directives per host (uses PAC helpers like host)", async () => {
      const proxyHost = new URL(proxyUrl).host
      pacScript = `
        function FindProxyForURL(url, host) {
          if (host === "example.com") return "PROXY ${proxyHost}";
          return "DIRECT";
        }
      `
      process.env.PAC_URL = pacUrl
      const dispatcher = createProxyDispatcher()

      // 127.0.0.1 → DIRECT per the PAC.
      const response = await fetch(`${originUrl}/test.json`, { dispatcher })
      const body = (await response.json()) as { from: string }
      expect(body.from).toBe("origin")
      expect(proxyHits).toHaveLength(0)
    })
  })
})
