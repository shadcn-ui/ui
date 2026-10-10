import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"

import { getRegistryItems, resolveRegistryItems } from "./api"

// End-to-end coverage for per-registry headers: builder -> resolver -> context
// -> fetcher. Nothing is mocked so the header key written by the resolver has
// to match the key the fetcher reads for the URL it actually requests.

const AUTHORIZATION = "Bearer acme-token"

const requests: { url: string; authorization: string | null }[] = []

const server = setupServer(
  http.get("*", ({ request }) => {
    requests.push({
      url: request.url,
      authorization: request.headers.get("authorization"),
    })

    const name = request.url.includes("button") ? "button" : "helper"

    return HttpResponse.json({
      name,
      type: "registry:ui",
      registryDependencies: name === "button" ? ["@acme/helper"] : undefined,
      files: [],
    })
  })
)

beforeAll(() => server.listen())
afterEach(() => {
  requests.length = 0
  server.resetHandlers()
})
afterAll(() => server.close())

// Each template builds a URL that `new URL().toString()` rewrites before the
// request goes out. The canonical template is the control case.
const templates = [
  {
    case: "canonical url",
    url: "https://acme.dev/r/{name}.json",
    requested: "https://acme.dev/r/{name}.json",
  },
  {
    case: "mixed-case host",
    url: "https://Acme.dev/r/{name}.json",
    requested: "https://acme.dev/r/{name}.json",
  },
  {
    case: "bare origin",
    url: "https://acme.dev?item={name}",
    requested: "https://acme.dev/?item={name}",
  },
  {
    case: "unencoded path",
    url: "https://acme.dev/r/my items/{name}.json",
    requested: "https://acme.dev/r/my%20items/{name}.json",
  },
  {
    case: "default port",
    url: "https://acme.dev:443/r/{name}.json",
    requested: "https://acme.dev/r/{name}.json",
  },
  {
    case: "v0 url without /json",
    url: "https://v0.dev/chat/b/{name}",
    requested: "https://v0.dev/chat/b/{name}/json",
  },
]

describe.each([
  { api: "getRegistryItems", fetchItems: getRegistryItems, items: ["button"] },
  {
    api: "resolveRegistryItems",
    fetchItems: resolveRegistryItems,
    items: ["button", "helper"],
  },
])("$api", ({ fetchItems, items }) => {
  it.each(templates)(
    "sends registry headers for a $case",
    async ({ url, requested }) => {
      await fetchItems(["@acme/button"], {
        config: {
          registries: {
            "@acme": {
              url,
              headers: {
                Authorization: AUTHORIZATION,
              },
            },
          },
        },
      })

      expect(requests).toEqual(
        items.map((item) => ({
          url: requested.replace("{name}", item),
          authorization: AUTHORIZATION,
        }))
      )
    }
  )
})
