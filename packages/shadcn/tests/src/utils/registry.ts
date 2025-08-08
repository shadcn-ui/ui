import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"

interface RegistryItem {
  name: string
  type: string
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  files?: Array<{
    path: string
    content: string
    type: string
    target?: string
  }>
  tailwind?: any
  cssVars?: any
  css?: any
  envVars?: any
  docs?: string
}

interface CreateRegistryServerOptions {
  port: number
}

export async function createRegistryServer(
  items: RegistryItem[],
  options: CreateRegistryServerOptions
) {
  const { port } = options
  const baseUrl = `http://localhost:${port}/r`

  // Create MSW handlers for each registry item
  const handlers = items.map((item) => {
    return http.get(`${baseUrl}/${item.name}.json`, () => {
      return HttpResponse.json(item)
    })
  })

  // Create a new MSW server with the handlers
  const server = setupServer(...handlers)

  return {
    async start() {
      // Start this server instance
      server.listen({ onUnhandledRequest: "bypass" })
    },
    async stop() {
      // Stop this server instance
      server.close()
    },
  }
}
