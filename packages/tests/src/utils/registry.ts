import { createServer } from "http"
import path from "path"
import fs from "fs-extra"

export async function createRegistryServer(
  items: Array<{ name: string; type: string } & Record<string, unknown>>,
  {
    port = 4444,
    path = "/r",
  }: {
    port?: number
    path?: string
  }
) {
  const server = createServer((request, response) => {
    const urlWithoutQuery = request.url?.split("?")[0]
    const match = urlWithoutQuery?.match(
      new RegExp(`^${path}/(?:.*/)?([^/]+)$`)
    )
    const itemName = match?.[1]
    const item = itemName
      ? items.find((item) => item.name === itemName)
      : undefined

    if (!item) {
      response.writeHead(404, { "Content-Type": "application/json" })
      response.end(JSON.stringify({ error: "Item not found" }))
      return
    }

    if (request.url?.includes("/bearer/")) {
      // Validate bearer token
      const token = request.headers.authorization?.split(" ")[1]
      if (token !== "EXAMPLE_BEARER_TOKEN") {
        response.writeHead(401, { "Content-Type": "application/json" })
        response.end(JSON.stringify({ error: "Unauthorized" }))
        return
      }
    }

    if (request.url?.includes("/api-key/")) {
      // Validate api key
      const apiKey = request.headers["x-api-key"]
      if (apiKey !== "EXAMPLE_API_KEY") {
        response.writeHead(401, { "Content-Type": "application/json" })
        response.end(JSON.stringify({ error: "Unauthorized" }))
        return
      }
    }

    if (request.url?.includes("/client-secret/")) {
      // Validate client secret
      const clientSecret = request.headers["x-client-secret"]
      const clientId = request.headers["x-client-id"]
      if (
        clientSecret !== "EXAMPLE_CLIENT_SECRET" ||
        clientId !== "EXAMPLE_CLIENT_ID"
      ) {
        response.writeHead(401, { "Content-Type": "application/json" })
        response.end(JSON.stringify({ error: "Unauthorized" }))
        return
      }
    }

    if (request.url?.includes("/params/")) {
      const token = request.url.split("?")[1]?.split("=")[1]
      if (token !== "EXAMPLE_REGISTRY_TOKEN") {
        response.writeHead(401, { "Content-Type": "application/json" })
        response.end(JSON.stringify({ error: "Unauthorized" }))
        return
      }
    }

    response.writeHead(200, { "Content-Type": "application/json" })
    response.end(JSON.stringify(item))
  })

  return {
    start: async () => {
      await new Promise<void>((resolve) => {
        server.listen(port, () => {
          resolve()
        })
      })
    },
    stop: async () => {
      await new Promise<void>((resolve) => {
        server.close(() => {
          resolve()
        })
      })
    },
  }
}

export async function configureRegistries(
  fixturePath: string,
  payload: Record<string, any>
) {
  const componentsJson = await fs.readJSON(
    path.join(fixturePath, "components.json")
  )
  componentsJson.registries = payload
  await fs.writeJSON(path.join(fixturePath, "components.json"), componentsJson)
}
