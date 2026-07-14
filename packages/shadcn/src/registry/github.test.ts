import { execa } from "execa"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import { RegistrySourceFileError, RegistryValidationError } from "./errors"
import { validateGitHubRegistrySource } from "./github"
import {
  fetchRegistryItems,
  resolveRegistryItemsFromRegistries,
  resolveRegistryTree,
} from "./resolver"
import { searchRegistries } from "./search"

vi.mock("execa", () => ({
  execa: vi.fn(),
}))

const server = setupServer()
const HEAD_SHA = "1111111111111111111111111111111111111111"
const TAG_SHA = "2222222222222222222222222222222222222222"
const TAG_OBJECT_SHA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
const BRANCH_SHA = "3333333333333333333333333333333333333333"
const V1_SHA = "4444444444444444444444444444444444444444"
const FULL_SHA = "5555555555555555555555555555555555555555"

describe("GitHub registry items", () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" })
  })

  beforeEach(() => {
    vi.mocked(execa).mockResolvedValue({
      stdout: [
        `ref: refs/heads/main\tHEAD`,
        `${HEAD_SHA}\tHEAD`,
        `${HEAD_SHA}\trefs/heads/main`,
        `${TAG_OBJECT_SHA}\trefs/tags/v1.2.0`,
        `${TAG_SHA}\trefs/tags/v1.2.0^{}`,
        `${BRANCH_SHA}\trefs/heads/feature/forms`,
        `${V1_SHA}\trefs/tags/v1.0.0`,
      ].join("\n"),
    } as any)
  })

  afterEach(() => {
    server.resetHandlers()
    vi.mocked(execa).mockReset()
  })

  afterAll(() => {
    server.close()
  })

  it("fetches an item from a GitHub source registry with include", async () => {
    server.use(
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/registry.json",
        () => {
          return HttpResponse.json({
            name: "acme-ui",
            homepage: "https://github.com/acme/ui",
            include: ["components/ui/registry.json"],
          })
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/components/ui/registry.json",
        () => {
          return HttpResponse.json({
            items: [
              {
                name: "button",
                type: "registry:ui",
                files: [
                  {
                    path: "button.tsx",
                    type: "registry:ui",
                  },
                ],
              },
            ],
          })
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/components/ui/button.tsx",
        () => {
          return HttpResponse.text("export function Button() {}")
        }
      )
    )

    const [item] = await fetchRegistryItems(["acme/ui/button"], {} as any, {
      useCache: false,
    })

    expect(item).toMatchObject({
      name: "button",
      type: "registry:ui",
      files: [
        {
          path: "components/ui/button.tsx",
          type: "registry:ui",
          content: "export function Button() {}",
        },
      ],
    })
    expect(vi.mocked(execa)).toHaveBeenCalledTimes(1)
  })

  it("fetches an item from an explicit GitHub ref", async () => {
    server.use(
      http.get(
        "https://raw.githubusercontent.com/acme/ui/2222222222222222222222222222222222222222/registry.json",
        () => {
          return HttpResponse.json({
            name: "acme-ui",
            homepage: "https://github.com/acme/ui",
            items: [
              {
                name: "button",
                type: "registry:ui",
                files: [
                  {
                    path: "button.tsx",
                    type: "registry:ui",
                  },
                ],
              },
            ],
          })
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/acme/ui/2222222222222222222222222222222222222222/button.tsx",
        () => {
          return HttpResponse.text("export function Button() {}")
        }
      )
    )

    const [item] = await fetchRegistryItems(
      ["acme/ui/button#v1.2.0"],
      {} as any
    )

    expect(item.files?.[0]?.path).toBe("button.tsx")
  })

  it("uses a full commit SHA without resolving refs through git", async () => {
    server.use(
      http.get(
        "https://raw.githubusercontent.com/acme/ui/5555555555555555555555555555555555555555/registry.json",
        () => {
          return HttpResponse.json({
            name: "acme-ui",
            homepage: "https://github.com/acme/ui",
            items: [
              {
                name: "button",
                type: "registry:ui",
              },
            ],
          })
        }
      )
    )

    const [item] = await fetchRegistryItems(
      [`acme/ui/button#${FULL_SHA}`],
      {} as any
    )

    expect(item.name).toBe("button")
    expect(vi.mocked(execa)).not.toHaveBeenCalled()
  })

  it("encodes GitHub refs with slashes", async () => {
    server.use(
      http.get(
        "https://raw.githubusercontent.com/acme/ui/3333333333333333333333333333333333333333/registry.json",
        () => {
          return HttpResponse.json({
            name: "acme-ui",
            homepage: "https://github.com/acme/ui",
            items: [
              {
                name: "button",
                type: "registry:ui",
              },
            ],
          })
        }
      )
    )

    const [item] = await fetchRegistryItems(
      ["acme/ui/button#feature/forms"],
      {} as any
    )

    expect(item.name).toBe("button")
  })

  it("fails when a GitHub ref cannot be resolved", async () => {
    vi.mocked(execa).mockResolvedValueOnce({ stdout: "" } as any)

    await expect(
      fetchRegistryItems(["acme/ui/button#missing"], {} as any)
    ).rejects.toThrow('Could not resolve GitHub ref "missing"')
  })

  it("fails when the root registry.json file is missing", async () => {
    server.use(
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/registry.json",
        () => {
          return new HttpResponse(null, { status: 404 })
        }
      )
    )

    await expect(
      fetchRegistryItems(["acme/ui/button"], {} as any)
    ).rejects.toThrow(RegistrySourceFileError)
    await expect(
      fetchRegistryItems(["acme/ui/button"], {} as any)
    ).rejects.toThrow("registry.json")
  })

  it("explains raw.githubusercontent.com failures after ref resolution", async () => {
    server.use(
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/registry.json",
        () => {
          return HttpResponse.error()
        }
      )
    )

    await expect(
      fetchRegistryItems(["acme/ui/button"], {} as any)
    ).rejects.toMatchObject({
      suggestion:
        "GitHub ref resolution succeeded, but the CLI could not fetch from raw.githubusercontent.com. Check that raw.githubusercontent.com is accessible from this network.",
    })
  })

  it("validates root registry item file paths", async () => {
    server.use(
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/registry.json",
        () => {
          return HttpResponse.json({
            name: "acme-ui",
            homepage: "https://github.com/acme/ui",
            items: [
              {
                name: "button",
                type: "registry:ui",
                files: [
                  {
                    path: "../button.tsx",
                    type: "registry:ui",
                  },
                ],
              },
            ],
          })
        }
      )
    )

    await expect(
      fetchRegistryItems(["acme/ui/button"], {} as any)
    ).rejects.toThrow(RegistryValidationError)
  })

  it("resolves explicit GitHub dependencies and keeps bare dependencies as shadcn items", async () => {
    server.use(
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/registry.json",
        () => {
          return HttpResponse.json({
            name: "acme-ui",
            homepage: "https://github.com/acme/ui",
            items: [
              {
                name: "login-form",
                type: "registry:block",
                registryDependencies: ["acme/ui/button", "input"],
                files: [
                  {
                    path: "login-form.tsx",
                    type: "registry:block",
                  },
                ],
              },
              {
                name: "button",
                type: "registry:ui",
                files: [
                  {
                    path: "button.tsx",
                    type: "registry:ui",
                  },
                ],
              },
            ],
          })
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/login-form.tsx",
        () => {
          return HttpResponse.text("export function LoginForm() {}")
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/button.tsx",
        () => {
          return HttpResponse.text("export function Button() {}")
        }
      ),
      http.get("https://ui.shadcn.com/r/index.json", () => {
        return HttpResponse.json([
          {
            name: "input",
            type: "registry:ui",
            registryDependencies: [],
          },
        ])
      }),
      http.get("https://ui.shadcn.com/r/styles/new-york-v4/input.json", () => {
        return HttpResponse.json({
          name: "input",
          type: "registry:ui",
          files: [
            {
              path: "input.tsx",
              type: "registry:ui",
              content: "export function Input() {}",
            },
          ],
        })
      })
    )

    const result = await resolveRegistryTree(["acme/ui/login-form"], {
      style: "new-york-v4",
      tailwind: { baseColor: "neutral", cssVariables: true },
      resolvedPaths: {
        cwd: process.cwd(),
        tailwindCss: "globals.css",
        tailwindConfig: "tailwind.config.js",
        components: "components",
        ui: "components/ui",
        lib: "lib",
        utils: "lib/utils",
        hooks: "hooks",
      },
    } as any)

    expect(result?.files?.map((file) => file.path)).toEqual([
      "button.tsx",
      "input.tsx",
      "login-form.tsx",
    ])
  })

  it("resolves tagged and SHA-pinned GitHub dependencies", async () => {
    server.use(
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/registry.json",
        () => {
          return HttpResponse.json({
            name: "acme-ui",
            homepage: "https://github.com/acme/ui",
            items: [
              {
                name: "login-form",
                type: "registry:block",
                registryDependencies: [
                  "acme/ui/button#v1.2.0",
                  `acme/ui/card#${FULL_SHA}`,
                ],
                files: [
                  {
                    path: "login-form.tsx",
                    type: "registry:block",
                  },
                ],
              },
            ],
          })
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/login-form.tsx",
        () => {
          return HttpResponse.text("export function LoginForm() {}")
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/acme/ui/2222222222222222222222222222222222222222/registry.json",
        () => {
          return HttpResponse.json({
            name: "acme-ui",
            homepage: "https://github.com/acme/ui",
            items: [
              {
                name: "button",
                type: "registry:ui",
                files: [
                  {
                    path: "button.tsx",
                    type: "registry:ui",
                  },
                ],
              },
            ],
          })
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/acme/ui/2222222222222222222222222222222222222222/button.tsx",
        () => {
          return HttpResponse.text("export function Button() {}")
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/acme/ui/5555555555555555555555555555555555555555/registry.json",
        () => {
          return HttpResponse.json({
            name: "acme-ui",
            homepage: "https://github.com/acme/ui",
            items: [
              {
                name: "card",
                type: "registry:ui",
                files: [
                  {
                    path: "card.tsx",
                    type: "registry:ui",
                  },
                ],
              },
            ],
          })
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/acme/ui/5555555555555555555555555555555555555555/card.tsx",
        () => {
          return HttpResponse.text("export function Card() {}")
        }
      )
    )

    const result = await resolveRegistryTree(["acme/ui/login-form"], {
      style: "new-york-v4",
      tailwind: { baseColor: "neutral", cssVariables: true },
      resolvedPaths: {
        cwd: process.cwd(),
        tailwindCss: "globals.css",
        tailwindConfig: "tailwind.config.js",
        components: "components",
        ui: "components/ui",
        lib: "lib",
        utils: "lib/utils",
        hooks: "hooks",
      },
    } as any)

    expect(result?.files?.map((file) => file.path)).toEqual([
      "button.tsx",
      "card.tsx",
      "login-form.tsx",
    ])
    expect(vi.mocked(execa)).toHaveBeenCalledTimes(2)
  })

  it("keeps same-name GitHub dependencies from different repositories distinct", async () => {
    server.use(
      http.get(
        "https://raw.githubusercontent.com/acme/app/1111111111111111111111111111111111111111/registry.json",
        () => {
          return HttpResponse.json({
            name: "acme-app",
            homepage: "https://github.com/acme/app",
            items: [
              {
                name: "page",
                type: "registry:block",
                registryDependencies: ["acme/ui/button", "craft/ui/button"],
                files: [
                  {
                    path: "page.tsx",
                    type: "registry:block",
                  },
                ],
              },
            ],
          })
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/acme/app/1111111111111111111111111111111111111111/page.tsx",
        () => {
          return HttpResponse.text("export function Page() {}")
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/registry.json",
        () => {
          return HttpResponse.json({
            name: "acme-ui",
            homepage: "https://github.com/acme/ui",
            items: [
              {
                name: "button",
                type: "registry:ui",
                files: [
                  {
                    path: "button.tsx",
                    type: "registry:ui",
                  },
                ],
              },
            ],
          })
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/button.tsx",
        () => {
          return HttpResponse.text("export function AcmeButton() {}")
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/craft/ui/1111111111111111111111111111111111111111/registry.json",
        () => {
          return HttpResponse.json({
            name: "craft-ui",
            homepage: "https://github.com/craft/ui",
            items: [
              {
                name: "button",
                type: "registry:ui",
                files: [
                  {
                    path: "craft-button.tsx",
                    type: "registry:ui",
                  },
                ],
              },
            ],
          })
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/craft/ui/1111111111111111111111111111111111111111/craft-button.tsx",
        () => {
          return HttpResponse.text("export function CraftButton() {}")
        }
      )
    )

    const result = await resolveRegistryTree(["acme/app/page"], {
      style: "new-york-v4",
      tailwind: { baseColor: "neutral", cssVariables: true },
      resolvedPaths: {
        cwd: process.cwd(),
        tailwindCss: "globals.css",
        tailwindConfig: "tailwind.config.js",
        components: "components",
        ui: "components/ui",
        lib: "lib",
        utils: "lib/utils",
        hooks: "hooks",
      },
    } as any)

    expect(result?.files?.map((file) => file.path)).toEqual([
      "button.tsx",
      "craft-button.tsx",
      "page.tsx",
    ])
  })

  it("validates a GitHub source registry with include and checks item files", async () => {
    server.use(
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/registry.json",
        () => {
          return HttpResponse.json({
            name: "acme-ui",
            homepage: "https://github.com/acme/ui",
            include: ["components/ui/registry.json"],
          })
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/components/ui/registry.json",
        () => {
          return HttpResponse.json({
            items: [
              {
                name: "button",
                type: "registry:ui",
                files: [
                  {
                    path: "button.tsx",
                    type: "registry:ui",
                  },
                ],
              },
            ],
          })
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/components/ui/button.tsx",
        () => {
          return HttpResponse.text("export function Button() {}")
        }
      )
    )

    const result = await validateGitHubRegistrySource({
      owner: "acme",
      repo: "ui",
    })

    expect(result).toMatchObject({
      valid: true,
      cwd: "acme/ui#HEAD",
      registryFiles: 2,
      registryFilePaths: [
        "acme/ui#HEAD/registry.json",
        "acme/ui#HEAD/components/ui/registry.json",
      ],
      items: 1,
      diagnostics: [],
    })
  })

  it("bounds item validation concurrency for GitHub source registries", async () => {
    const items = Array.from({ length: 16 }, (_, index) => ({
      name: `item-${index}`,
      type: "registry:ui",
      files: [
        {
          path: `item-${index}.tsx`,
          type: "registry:ui",
        },
      ],
    }))
    let activeRequests = 0
    let maxActiveRequests = 0

    server.use(
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/:file",
        async ({ params }) => {
          const file = String(params.file)

          if (file === "registry.json") {
            return HttpResponse.json({
              name: "acme-ui",
              homepage: "https://github.com/acme/ui",
              items,
            })
          }

          activeRequests += 1
          maxActiveRequests = Math.max(maxActiveRequests, activeRequests)
          await new Promise((resolve) => setTimeout(resolve, 10))
          activeRequests -= 1

          return HttpResponse.text(
            `export const ${file.replace(/\W/g, "_")} = {}`
          )
        }
      )
    )

    const result = await validateGitHubRegistrySource({
      owner: "acme",
      repo: "ui",
    })

    expect(result.valid).toBe(true)
    expect(result.items).toBe(items.length)
    expect(maxActiveRequests).toBeLessThanOrEqual(8)
    expect(maxActiveRequests).toBeGreaterThan(1)
  })

  it("reports duplicate item names in a root GitHub source registry", async () => {
    server.use(
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/registry.json",
        () => {
          return HttpResponse.json({
            name: "acme-ui",
            homepage: "https://github.com/acme/ui",
            items: [
              {
                name: "button",
                type: "registry:ui",
              },
              {
                name: "button",
                type: "registry:ui",
              },
            ],
          })
        }
      )
    )

    const result = await validateGitHubRegistrySource({
      owner: "acme",
      repo: "ui",
    })

    expect(result.valid).toBe(false)
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        registryFile: "acme/ui#HEAD/registry.json",
        message: expect.stringContaining(
          'Duplicate registry item name "button"'
        ),
      }),
    ])
  })

  it("reports invalid GitHub source registry item files", async () => {
    server.use(
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/registry.json",
        () => {
          return HttpResponse.json({
            name: "acme-ui",
            homepage: "https://github.com/acme/ui",
            include: ["components/ui/registry.json"],
          })
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/components/ui/registry.json",
        () => {
          return HttpResponse.json({
            items: [
              {
                name: "button",
                type: "registry:ui",
                files: [
                  {
                    path: "missing.tsx",
                    type: "registry:ui",
                  },
                ],
              },
            ],
          })
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/components/ui/missing.tsx",
        () => {
          return new HttpResponse(null, { status: 404 })
        }
      )
    )

    const result = await validateGitHubRegistrySource({
      owner: "acme",
      repo: "ui",
    })

    expect(result.valid).toBe(false)
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        registryFile: "acme/ui#HEAD/components/ui/registry.json",
        itemName: "button",
        itemIndex: 0,
        filePath: "missing.tsx",
        suggestion:
          "Check that the file path exists in the public GitHub repository.",
      }),
    ])
  })

  it("does not rewrite GitHub addresses as shadcn registry items", () => {
    const result = resolveRegistryItemsFromRegistries(
      ["acme/ui/button", "button", "@acme/card"],
      {
        registries: {
          "@acme": "https://example.com/{name}.json",
        },
      } as any
    )

    expect(result).toEqual([
      "acme/ui/button",
      "https://ui.shadcn.com/r/styles/{style}/button.json",
      "https://example.com/card.json",
    ])
  })

  it("lists items from a GitHub source registry", async () => {
    server.use(
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/registry.json",
        () => {
          return HttpResponse.json({
            name: "acme-ui",
            homepage: "https://github.com/acme/ui",
            include: ["components/ui/registry.json"],
          })
        }
      ),
      http.get(
        "https://raw.githubusercontent.com/acme/ui/1111111111111111111111111111111111111111/components/ui/registry.json",
        () => {
          return HttpResponse.json({
            items: [
              {
                name: "button",
                type: "registry:ui",
                description: "A button component",
                files: [
                  {
                    path: "button.tsx",
                    type: "registry:ui",
                  },
                ],
              },
              {
                name: "card",
                type: "registry:ui",
                description: "A card component",
              },
            ],
          })
        }
      )
    )

    const result = await searchRegistries(["acme/ui"])

    expect(result.items).toEqual([
      {
        name: "button",
        type: "registry:ui",
        description: "A button component",
        registry: "acme/ui",
        addCommandArgument: "acme/ui/button",
      },
      {
        name: "card",
        type: "registry:ui",
        description: "A card component",
        registry: "acme/ui",
        addCommandArgument: "acme/ui/card",
      },
    ])
  })

  it("searches items from a GitHub source registry with an explicit ref", async () => {
    server.use(
      http.get(
        "https://raw.githubusercontent.com/acme/ui/4444444444444444444444444444444444444444/registry.json",
        () => {
          return HttpResponse.json({
            name: "acme-ui",
            homepage: "https://github.com/acme/ui",
            items: [
              {
                name: "button",
                type: "registry:ui",
                description: "A button component",
              },
              {
                name: "dialog",
                type: "registry:ui",
                description: "A modal component",
              },
            ],
          })
        }
      )
    )

    const result = await searchRegistries(["acme/ui#v1.0.0"], {
      query: "button",
    })

    expect(result.items).toEqual([
      {
        name: "button",
        type: "registry:ui",
        description: "A button component",
        registry: "acme/ui#v1.0.0",
        addCommandArgument: "acme/ui/button#v1.0.0",
      },
    ])
  })
})
