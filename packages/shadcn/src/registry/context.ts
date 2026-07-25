import { AsyncLocalStorage } from "async_hooks"

interface RegistryContext {
  headers: Record<string, Record<string, string>>
  env?: NodeJS.ProcessEnv
}

const registryContext = new AsyncLocalStorage<RegistryContext>()
const fallbackContext: RegistryContext = {
  headers: {},
}

export function withRegistryContext<T>(
  callback: () => T,
  options: {
    env?: NodeJS.ProcessEnv
  } = {}
): T {
  const parentContext = registryContext.getStore()

  return registryContext.run(
    {
      headers: {},
      env: options.env ?? parentContext?.env,
    },
    callback
  )
}

export function setRegistryHeaders(
  headers: Record<string, Record<string, string>>
) {
  const context = registryContext.getStore() ?? fallbackContext

  // Merge new headers with existing ones to preserve headers for nested dependencies
  context.headers = { ...context.headers, ...headers }
}

export function getRegistryHeadersFromContext(
  url: string
): Record<string, string> {
  const context = registryContext.getStore() ?? fallbackContext

  return context.headers[url] || {}
}

export function getRegistryEnvFromContext(key: string): string | undefined {
  const context = registryContext.getStore()

  return context?.env ? context.env[key] : process.env[key]
}

export function clearRegistryContext() {
  const context = registryContext.getStore() ?? fallbackContext

  context.headers = {}
}
