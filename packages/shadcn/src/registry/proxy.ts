import { type Dispatcher, EnvHttpProxyAgent } from "undici"

const PROXY_ENV_VARS = [
  "HTTPS_PROXY",
  "https_proxy",
  "HTTP_PROXY",
  "http_proxy",
] as const

export function createProxyDispatcher(
  env: NodeJS.ProcessEnv = process.env
): Dispatcher | undefined {
  const hasProxy = PROXY_ENV_VARS.some((name) => env[name])
  return hasProxy ? new EnvHttpProxyAgent() : undefined
}
