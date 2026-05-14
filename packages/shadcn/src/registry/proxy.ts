import { createPacResolver, type FindProxyForURL } from "pac-resolver"
import { QuickJS } from "quickjs-wasi"
import { SocksClient, type SocksProxy } from "socks"
import {
  Agent,
  Dispatcher,
  EnvHttpProxyAgent,
  fetch as undiciFetch,
  getGlobalDispatcher,
  ProxyAgent,
} from "undici"

const HTTP_PROXY_ENV_VARS = [
  "HTTPS_PROXY",
  "https_proxy",
  "HTTP_PROXY",
  "http_proxy",
] as const

const ALL_PROXY_ENV_VARS = ["ALL_PROXY", "all_proxy"] as const

const PAC_ENV_VARS = ["PAC_URL", "pac_url"] as const

const SOCKS_VERSION_BY_SCHEME: Record<string, SocksProxy["type"]> = {
  "socks:": 5,
  "socks4:": 4,
  "socks4a:": 4,
  "socks5:": 5,
  "socks5h:": 5,
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

function parseSocksUrl(value: string): SocksProxy | undefined {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return undefined
  }
  const type = SOCKS_VERSION_BY_SCHEME[url.protocol]
  if (!type) return undefined
  const port = Number(url.port) || 1080
  return {
    host: url.hostname,
    port,
    type,
    ...(url.username
      ? { userId: decodeURIComponent(url.username) }
      : undefined),
    ...(url.password
      ? { password: decodeURIComponent(url.password) }
      : undefined),
  }
}

function createSocksAgent(proxy: SocksProxy): Agent {
  return new Agent({
    connect: (opts, callback) => {
      SocksClient.createConnection({
        proxy,
        command: "connect",
        destination: {
          host: opts.hostname ?? "",
          port: Number(opts.port),
        },
      })
        .then(({ socket }) => callback(null, socket))
        .catch((err: Error) => callback(err, null))
    },
  })
}

// PAC directive parsing per the PAC spec — directives are semicolon-separated
// alternatives, each in the form "TYPE host:port" or "DIRECT".
type PacDirective =
  | { kind: "direct" }
  | { kind: "http"; host: string; port: number }
  | { kind: "socks"; host: string; port: number; version: 4 | 5 }

function parsePacDirective(directive: string): PacDirective | undefined {
  const trimmed = directive.trim()
  if (!trimmed) return undefined
  const upper = trimmed.toUpperCase()
  if (upper === "DIRECT") return { kind: "direct" }

  const parts = trimmed.split(/\s+/)
  if (parts.length < 2) return undefined
  const type = parts[0].toUpperCase()
  const [host, portStr] = parts[1].split(":")
  const port = Number(portStr)
  if (!host || !Number.isFinite(port)) return undefined

  if (type === "PROXY" || type === "HTTP" || type === "HTTPS") {
    return { kind: "http", host, port }
  }
  if (type === "SOCKS" || type === "SOCKS5" || type === "SOCKS5H") {
    return { kind: "socks", host, port, version: 5 }
  }
  if (type === "SOCKS4" || type === "SOCKS4A") {
    return { kind: "socks", host, port, version: 4 }
  }
  return undefined
}

export class PacDispatcher extends Dispatcher {
  private resolverPromise?: Promise<FindProxyForURL>
  private readonly subDispatchers = new Map<string, Dispatcher>()

  constructor(public readonly pacUrl: string) {
    super()
  }

  private async getResolver(): Promise<FindProxyForURL> {
    if (!this.resolverPromise) {
      this.resolverPromise = (async () => {
        const qjs = await QuickJS.create()
        const response = await undiciFetch(this.pacUrl)
        const script = await response.text()
        return createPacResolver(qjs, script)
      })()
    }
    return this.resolverPromise
  }

  private getDispatcherFor(directive: PacDirective): Dispatcher {
    const cacheKey =
      directive.kind === "direct"
        ? "direct"
        : `${directive.kind}:${directive.host}:${directive.port}${
            directive.kind === "socks" ? `:v${directive.version}` : ""
          }`
    const cached = this.subDispatchers.get(cacheKey)
    if (cached) return cached

    let next: Dispatcher
    if (directive.kind === "direct") {
      next = getGlobalDispatcher()
    } else if (directive.kind === "http") {
      next = new ProxyAgent(`http://${directive.host}:${directive.port}`)
    } else {
      next = createSocksAgent({
        host: directive.host,
        port: directive.port,
        type: directive.version,
      })
    }
    this.subDispatchers.set(cacheKey, next)
    return next
  }

  dispatch(
    opts: Dispatcher.DispatchOptions,
    handler: Dispatcher.DispatchHandler
  ): boolean {
    const onError = (err: Error) => {
      const onErrorFn = handler.onError as
        | ((err: Error) => void)
        | undefined
      if (onErrorFn) onErrorFn(err)
    }
    ;(async () => {
      try {
        const findProxy = await this.getResolver()
        const origin =
          typeof opts.origin === "string"
            ? opts.origin
            : opts.origin?.toString() ?? ""
        const url = `${origin}${opts.path ?? ""}`
        const directiveStr = await findProxy(url)
        // Pick the first parseable directive from the semicolon-separated list.
        const directive = directiveStr
          .split(";")
          .map(parsePacDirective)
          .find((d): d is PacDirective => d !== undefined)
        if (!directive) {
          onError(
            new Error(
              `PAC returned no usable directive for ${url}: ${directiveStr}`
            )
          )
          return
        }
        const next = this.getDispatcherFor(directive)
        next.dispatch(opts, handler)
      } catch (err) {
        onError(err instanceof Error ? err : new Error(String(err)))
      }
    })()
    return true
  }

  async close(): Promise<void> {
    await Promise.all(
      Array.from(this.subDispatchers.values()).map((d) =>
        d === getGlobalDispatcher() ? Promise.resolve() : d.close()
      )
    )
  }
}

export function createProxyDispatcher(
  env: NodeJS.ProcessEnv = process.env
): Dispatcher | undefined {
  // PAC takes priority — a PAC script can return PROXY/SOCKS/DIRECT directives
  // per request, so it supersedes the per-process env vars below.
  for (const name of PAC_ENV_VARS) {
    const value = env[name]
    if (value && isValidUrl(value)) return new PacDispatcher(value)
  }

  // SOCKS via ALL_PROXY (curl convention). Only triggers for socks* schemes;
  // other schemes (http/https) are unhandled here — users configure those via
  // HTTP_PROXY / HTTPS_PROXY explicitly.
  for (const name of ALL_PROXY_ENV_VARS) {
    const value = env[name]
    if (!value) continue
    const socks = parseSocksUrl(value)
    if (socks) return createSocksAgent(socks)
  }

  // HTTP/HTTPS proxy via HTTP_PROXY / HTTPS_PROXY / NO_PROXY.
  const hasHttpProxy = HTTP_PROXY_ENV_VARS.some((name) => env[name])
  return hasHttpProxy ? new EnvHttpProxyAgent() : undefined
}
