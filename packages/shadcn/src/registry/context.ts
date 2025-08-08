interface RegistryContext {
  headers: Record<string, Record<string, string>>
}

let context: RegistryContext = {
  headers: {},
}

export function setRegistryHeaders(
  headers: Record<string, Record<string, string>>
) {
  // Merge new headers with existing ones to preserve headers for nested dependencies
  context.headers = { ...context.headers, ...headers }
}

export function getRegistryHeadersFromContext(
  url: string
): Record<string, string> {
  return context.headers[url] || {}
}

export function clearRegistryContext() {
  context.headers = {}
}
