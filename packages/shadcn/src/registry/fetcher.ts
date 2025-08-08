import { resolveRegistryUrl } from "@/src/registry/builder"
import { getRegistryHeadersFromContext } from "@/src/registry/context"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { HttpsProxyAgent } from "https-proxy-agent"
import fetch from "node-fetch"

const agent = process.env.https_proxy
  ? new HttpsProxyAgent(process.env.https_proxy)
  : undefined

const registryCache = new Map<string, Promise<any>>()

export function clearRegistryCache() {
  registryCache.clear()
}

export async function fetchRegistry(
  paths: string[],
  options: { useCache?: boolean } = {}
) {
  options = {
    useCache: true,
    ...options,
  }

  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const url = resolveRegistryUrl(path)

        // Check cache first if caching is enabled
        if (options.useCache && registryCache.has(url)) {
          return registryCache.get(url)
        }

        // Store the promise in the cache before awaiting if caching is enabled
        const fetchPromise = (async () => {
          // Get headers from context for this URL
          const headers = getRegistryHeadersFromContext(url)

          const response = await fetch(url, {
            agent,
            headers: {
              ...headers,
            },
          })

          if (!response.ok) {
            const errorMessages: { [key: number]: string } = {
              400: "Bad request",
              401: "Unauthorized",
              403: "Forbidden",
              404: "Not found",
              500: "Internal server error",
            }

            let errorDetails = ""
            try {
              const result = await response.json()
              if (result && typeof result === "object") {
                const messages = []
                if ("error" in result && result.error) {
                  messages.push(`[${result.error}]: `)
                }
                if ("message" in result && result.message) {
                  messages.push(result.message)
                }
                if (messages.length > 0) {
                  errorDetails = `\n\nServer response: \n${messages.join("")}`
                }
              }
            } catch {
              // If we can't parse JSON, that's okay
            }

            if (response.status === 401) {
              throw new Error(
                `You are not authorized to access the component at ${highlighter.info(
                  url
                )}.\nIf this is a remote registry, you may need to authenticate.${errorDetails}`
              )
            }

            if (response.status === 404) {
              throw new Error(
                `The component at ${highlighter.info(
                  url
                )} was not found.\nIt may not exist at the registry. Please make sure it is a valid component.${errorDetails}`
              )
            }

            if (response.status === 403) {
              throw new Error(
                `You do not have access to the component at ${highlighter.info(
                  url
                )}.\nIf this is a remote registry, you may need to authenticate or a token.${errorDetails}`
              )
            }

            throw new Error(
              `Failed to fetch from ${highlighter.info(url)}.\n${
                errorDetails ||
                response.statusText ||
                errorMessages[response.status]
              }`
            )
          }

          return response.json()
        })()

        if (options.useCache) {
          registryCache.set(url, fetchPromise)
        }
        return fetchPromise
      })
    )

    return results
  } catch (error) {
    logger.error("\n")
    handleError(error)
    return []
  }
}
