import { AsyncLocalStorage } from "async_hooks"
import { resolveRegistryUrl } from "@/src/registry/url"

interface RegistryContext {
  headers: Record<string, Record<string, string>>
  env?: NodeJS.ProcessEnv
  onGitHubAuthNotice?: (message: string) => void | Promise<void>
}

const registryContext = new AsyncLocalStorage<RegistryContext>()
const fallbackContext: RegistryContext = {
  headers: {},
}

export function withRegistryContext<T>(
  callback: () => T,
  options: {
    env?: NodeJS.ProcessEnv
    onGitHubAuthNotice?: (message: string) => void | Promise<void>
  } = {}
): T {
  const parentContext = registryContext.getStore()

  return registryContext.run(
    {
      headers: {},
      env: options.env ?? parentContext?.env,
      onGitHubAuthNotice:
        options.onGitHubAuthNotice ?? parentContext?.onGitHubAuthNotice,
    },
    callback
  )
}

export function setRegistryHeaders(
  headers: Record<string, Record<string, string>>
) {
  const context = registryContext.getStore() ?? fallbackContext

  // Key headers by the resolved URL so the fetcher finds them no matter how
  // the registry URL was written (host case, default port, encoding, v0).
  const resolvedHeaders = Object.fromEntries(
    Object.entries(headers).map(([url, value]) => [
      resolveRegistryUrl(url),
      value,
    ])
  )

  // Merge new headers with existing ones to preserve headers for nested dependencies
  context.headers = { ...context.headers, ...resolvedHeaders }
}

export function getRegistryHeadersFromContext(
  url: string
): Record<string, string> {
  const context = registryContext.getStore() ?? fallbackContext

  return context.headers[resolveRegistryUrl(url)] || {}
}

export function getRegistryEnvFromContext(key: string): string | undefined {
  const context = registryContext.getStore()

  return context?.env ? context.env[key] : process.env[key]
}

export function getGitHubAuthNoticeFromContext() {
  return registryContext.getStore()?.onGitHubAuthNotice
}

export function clearRegistryContext() {
  const context = registryContext.getStore() ?? fallbackContext

  context.headers = {}
}
