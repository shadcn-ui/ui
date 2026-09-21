import { lookup } from "node:dns/promises"
import { isIP } from "node:net"
import {
  Agent,
  buildConnector,
  fetch as undiciFetch,
  type Dispatcher,
} from "undici"

const DEFAULT_TIMEOUT_MS = 10_000
const DEFAULT_MAX_BODY_BYTES = 10 * 1024 * 1024
const DEFAULT_MAX_REDIRECTS = 5
const MAX_RETRY_AFTER_MS = 30_000

type ResolvedAddress = {
  address: string
  family: number
}

type ResolveHostname = (hostname: string) => Promise<ResolvedAddress[]>
type Connector = ReturnType<typeof buildConnector>

type FetchLike = (
  url: string,
  init: RequestInit & { dispatcher?: Dispatcher }
) => Promise<Response>

export type RegistryJsonResult =
  | {
      ok: true
      json: unknown
      status: number
      durationMs: number
      responseSize: number
      contentType: string
      redirectCount: number
      finalUrl: string
    }
  | {
      ok: false
      failureCode: string
      reachable: boolean
      botChallenge: boolean
      status?: number
      durationMs: number
      responseSize?: number
      contentType?: string
      redirectCount: number
      finalUrl: string
    }

type RegistryJsonAttemptResult =
  | Extract<RegistryJsonResult, { ok: true }>
  | (Extract<RegistryJsonResult, { ok: false }> & {
      retryAfterMs?: number
    })

function parseIpv4(address: string) {
  if (isIP(address) !== 4) return null

  return address.split(".").map(Number)
}

function parseIpv6(address: string) {
  if (address.includes("%") || isIP(address) !== 6) return null

  let value = address.toLowerCase()
  const ipv4Match = value.match(/(\d+\.\d+\.\d+\.\d+)$/)

  if (ipv4Match) {
    const ipv4 = parseIpv4(ipv4Match[1])
    if (!ipv4) return null
    value = value.replace(
      ipv4Match[1],
      `${((ipv4[0] << 8) | ipv4[1]).toString(16)}:${(
        (ipv4[2] << 8) |
        ipv4[3]
      ).toString(16)}`
    )
  }

  const [left = "", right = ""] = value.split("::")
  const leftParts = left ? left.split(":") : []
  const rightParts = right ? right.split(":") : []
  const missing = 8 - leftParts.length - rightParts.length
  const parts = value.includes("::")
    ? [
        ...leftParts,
        ...Array.from({ length: missing }, () => "0"),
        ...rightParts,
      ]
    : leftParts

  if (parts.length !== 8) return null

  const parsed = parts.map((part) => Number.parseInt(part || "0", 16))
  return parsed.every((part) => Number.isInteger(part) && part <= 0xffff)
    ? parsed
    : null
}

function isForbiddenIpv4(address: string) {
  const parts = parseIpv4(address)
  if (!parts) return true

  const [a, b, c] = parts

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0 && c === 0) ||
    (a === 192 && b === 0 && c === 2) ||
    (a === 192 && b === 88 && c === 99) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113) ||
    (a === 168 && b === 63 && c === 129 && parts[3] === 16) ||
    a >= 224
  )
}

function isForbiddenIpv6(address: string) {
  const parts = parseIpv6(address)
  if (!parts) return true

  const isUnspecified = parts.every((part) => part === 0)
  const isLoopback =
    parts.slice(0, 7).every((part) => part === 0) && parts[7] === 1
  const isUniqueLocal = (parts[0] & 0xfe00) === 0xfc00
  const isLinkLocal = (parts[0] & 0xffc0) === 0xfe80
  const isSiteLocal = (parts[0] & 0xffc0) === 0xfec0
  const isMulticast = (parts[0] & 0xff00) === 0xff00
  const isDocumentation = parts[0] === 0x2001 && parts[1] === 0x0db8
  const isProtocolAssignment =
    parts[0] === 0x2001 && parts[1] >= 0 && parts[1] <= 0x01ff
  const isSixToFour = parts[0] === 0x2002
  const isDiscardOnly =
    parts[0] === 0x0100 && parts.slice(1, 4).every((part) => part === 0)
  const isNat64 =
    (parts[0] === 0x0064 &&
      parts[1] === 0xff9b &&
      parts.slice(2, 6).every((part) => part === 0)) ||
    (parts[0] === 0x0064 && parts[1] === 0xff9b && parts[2] === 0x0001)
  const isIpv4Mapped =
    parts.slice(0, 5).every((part) => part === 0) && parts[5] === 0xffff
  const isIpv4Compatible = parts.slice(0, 6).every((part) => part === 0)

  if (isIpv4Mapped) {
    return isForbiddenIpv4(
      `${parts[6] >> 8}.${parts[6] & 255}.${parts[7] >> 8}.${parts[7] & 255}`
    )
  }

  return (
    isUnspecified ||
    isLoopback ||
    isUniqueLocal ||
    isLinkLocal ||
    isSiteLocal ||
    isMulticast ||
    isDocumentation ||
    isProtocolAssignment ||
    isSixToFour ||
    isDiscardOnly ||
    isNat64 ||
    isIpv4Compatible
  )
}

export function isForbiddenAddress(address: string) {
  const normalized = address.replace(/^\[|\]$/g, "")
  const family = isIP(normalized)

  if (family === 4) return isForbiddenIpv4(normalized)
  if (family === 6) return isForbiddenIpv6(normalized)

  return true
}

export function validateRegistryUrl(input: string) {
  const url = new URL(input)

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("unsupported_protocol")
  }

  if (url.username || url.password) {
    throw new Error("embedded_credentials")
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, "")
  if (isIP(hostname) && isForbiddenAddress(hostname)) {
    throw new Error("forbidden_address")
  }

  return url
}

const defaultResolve: ResolveHostname = (hostname) =>
  lookup(hostname, { all: true, verbatim: true })

export function createGuardedConnector({
  resolve = defaultResolve,
  connect = buildConnector({ timeout: DEFAULT_TIMEOUT_MS }),
}: {
  resolve?: ResolveHostname
  connect?: Connector
} = {}): Connector {
  return (options, callback) => {
    const hostname = options.hostname.replace(/^\[|\]$/g, "")

    void (async () => {
      const addresses = isIP(hostname)
        ? [{ address: hostname, family: isIP(hostname) }]
        : await resolve(hostname)

      if (
        addresses.length === 0 ||
        addresses.some(({ address }) => isForbiddenAddress(address))
      ) {
        throw new Error("forbidden_address")
      }

      const [{ address }] = addresses
      connect(
        {
          ...options,
          hostname: address,
          servername: options.servername ?? hostname,
        },
        callback
      )
    })().catch((error) =>
      callback(error instanceof Error ? error : new Error("dns_failure"), null)
    )
  }
}

function createGuardedDispatcher() {
  return new Agent({
    connect: createGuardedConnector(),
    headersTimeout: DEFAULT_TIMEOUT_MS,
    bodyTimeout: DEFAULT_TIMEOUT_MS,
  })
}

async function readLimitedBody(response: Response, maximumBytes: number) {
  if (!response.body) return { text: "", size: 0 }

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength

    if (size > maximumBytes) {
      await reader.cancel()
      throw new Error("body_too_large")
    }

    chunks.push(value)
  }

  const body = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }

  return { text: new TextDecoder().decode(body), size }
}

export function detectBotChallenge({
  status,
  contentType,
  server,
  body,
}: {
  status: number
  contentType: string
  server: string
  body: string
}) {
  const content = body.toLowerCase()
  const provider = server.toLowerCase()
  const isHtml = contentType.toLowerCase().includes("text/html")
  const marker = [
    "cf-chl-",
    "challenge-platform",
    "just a moment",
    "attention required",
    "vercel security checkpoint",
    "captcha",
  ].some((value) => content.includes(value))

  return (
    marker &&
    (isHtml || status === 403 || status === 429) &&
    (provider.includes("cloudflare") ||
      provider.includes("vercel") ||
      content.includes("challenge") ||
      content.includes("captcha"))
  )
}

function isRedirect(status: number) {
  return [301, 302, 303, 307, 308].includes(status)
}

function isRetryableStatus(status: number) {
  return status === 408 || status === 429 || status >= 500
}

function parseRetryAfter(value: string | null, now: number) {
  if (!value) return null

  const seconds = Number(value)
  const delay = Number.isFinite(seconds)
    ? seconds * 1000
    : new Date(value).getTime() - now

  if (!Number.isFinite(delay) || delay < 0) return null
  return Math.min(delay, MAX_RETRY_AFTER_MS)
}

function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

async function fetchOnce(
  input: string,
  {
    timeoutMs,
    maximumBytes,
    maximumRedirects,
    fetchImpl,
    createDispatcher,
  }: {
    timeoutMs: number
    maximumBytes: number
    maximumRedirects: number
    fetchImpl: FetchLike
    createDispatcher: () => Dispatcher
  }
) {
  const startedAt = Date.now()
  let currentUrl = validateRegistryUrl(input)
  let redirectCount = 0

  while (true) {
    validateRegistryUrl(currentUrl.toString())
    const remainingMs = timeoutMs - (Date.now() - startedAt)
    if (remainingMs <= 0) {
      return {
        ok: false,
        failureCode: "timeout",
        reachable: false,
        botChallenge: false,
        durationMs: Date.now() - startedAt,
        redirectCount,
        finalUrl: currentUrl.toString(),
      } satisfies RegistryJsonAttemptResult
    }

    const dispatcher = createDispatcher()
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), remainingMs)

    try {
      const response = await fetchImpl(currentUrl.toString(), {
        dispatcher,
        redirect: "manual",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "shadcn-registry-health/1.0",
        },
      })

      if (isRedirect(response.status)) {
        const location = response.headers.get("location")
        await response.body?.cancel()
        if (!location) {
          return {
            ok: false,
            failureCode: "redirect_without_location",
            reachable: false,
            botChallenge: false,
            status: response.status,
            durationMs: Date.now() - startedAt,
            redirectCount,
            finalUrl: currentUrl.toString(),
          } satisfies RegistryJsonAttemptResult
        }

        redirectCount += 1
        if (redirectCount > maximumRedirects) {
          return {
            ok: false,
            failureCode: "too_many_redirects",
            reachable: false,
            botChallenge: false,
            status: response.status,
            durationMs: Date.now() - startedAt,
            redirectCount,
            finalUrl: currentUrl.toString(),
          } satisfies RegistryJsonAttemptResult
        }

        currentUrl = validateRegistryUrl(
          new URL(location, currentUrl).toString()
        )
        continue
      }

      let body: Awaited<ReturnType<typeof readLimitedBody>>
      try {
        body = await readLimitedBody(response, maximumBytes)
      } catch {
        return {
          ok: false,
          failureCode: "body_too_large",
          reachable: response.ok,
          botChallenge: false,
          status: response.status,
          durationMs: Date.now() - startedAt,
          redirectCount,
          finalUrl: currentUrl.toString(),
        } satisfies RegistryJsonAttemptResult
      }

      const contentType = response.headers.get("content-type") ?? ""
      const botChallenge = detectBotChallenge({
        status: response.status,
        contentType,
        server: response.headers.get("server") ?? "",
        body: body.text,
      })

      if (botChallenge) {
        return {
          ok: false,
          failureCode: "bot_challenge",
          reachable: false,
          botChallenge: true,
          status: response.status,
          durationMs: Date.now() - startedAt,
          responseSize: body.size,
          contentType,
          redirectCount,
          finalUrl: currentUrl.toString(),
        } satisfies RegistryJsonAttemptResult
      }

      if (!response.ok) {
        return {
          ok: false,
          failureCode: `http_${response.status}`,
          reachable: false,
          botChallenge: false,
          status: response.status,
          durationMs: Date.now() - startedAt,
          responseSize: body.size,
          contentType,
          redirectCount,
          finalUrl: currentUrl.toString(),
          retryAfterMs:
            parseRetryAfter(response.headers.get("retry-after"), Date.now()) ??
            undefined,
        } satisfies RegistryJsonAttemptResult
      }

      try {
        return {
          ok: true,
          json: JSON.parse(body.text),
          status: response.status,
          durationMs: Date.now() - startedAt,
          responseSize: body.size,
          contentType,
          redirectCount,
          finalUrl: currentUrl.toString(),
        } satisfies RegistryJsonAttemptResult
      } catch {
        return {
          ok: false,
          failureCode: "invalid_json",
          reachable: true,
          botChallenge: false,
          status: response.status,
          durationMs: Date.now() - startedAt,
          responseSize: body.size,
          contentType,
          redirectCount,
          finalUrl: currentUrl.toString(),
        } satisfies RegistryJsonAttemptResult
      }
    } catch (error) {
      const messages = [
        error instanceof Error ? error.message : "",
        error instanceof Error && error.cause instanceof Error
          ? error.cause.message
          : "",
      ]
      const guardedFailure = [
        "embedded_credentials",
        "forbidden_address",
        "unsupported_protocol",
      ].find((failureCode) => messages.includes(failureCode))
      const failureCode =
        guardedFailure ??
        (error instanceof Error && error.name === "AbortError"
          ? "timeout"
          : "transport_error")

      return {
        ok: false,
        failureCode,
        reachable: false,
        botChallenge: false,
        durationMs: Date.now() - startedAt,
        redirectCount,
        finalUrl: currentUrl.toString(),
      } satisfies RegistryJsonAttemptResult
    } finally {
      clearTimeout(timeout)
      await dispatcher.close()
    }
  }
}

export async function fetchRegistryJson(
  input: string,
  options: {
    attempts?: number
    timeoutMs?: number
    maximumBytes?: number
    maximumRedirects?: number
    fetchImpl?: FetchLike
    createDispatcher?: () => Dispatcher
    wait?: (milliseconds: number) => Promise<unknown>
    random?: () => number
  } = {}
): Promise<RegistryJsonResult> {
  const attempts = options.attempts ?? 3
  const wait = options.wait ?? sleep
  const random = options.random ?? Math.random
  let result: Awaited<ReturnType<typeof fetchOnce>> | undefined

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    result = await fetchOnce(input, {
      timeoutMs: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      maximumBytes: options.maximumBytes ?? DEFAULT_MAX_BODY_BYTES,
      maximumRedirects: options.maximumRedirects ?? DEFAULT_MAX_REDIRECTS,
      fetchImpl: options.fetchImpl ?? (undiciFetch as unknown as FetchLike),
      createDispatcher: options.createDispatcher ?? createGuardedDispatcher,
    })

    const retryable =
      !result.ok &&
      !result.botChallenge &&
      (result.failureCode === "transport_error" ||
        result.failureCode === "timeout" ||
        (result.status !== undefined && isRetryableStatus(result.status)))

    if (!retryable || attempt === attempts - 1) {
      return result
    }

    await wait(
      result.retryAfterMs ??
        Math.min(1000 * 2 ** attempt + random() * 250, 5000)
    )
  }

  return result!
}
