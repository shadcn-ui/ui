import { FRAMEWORKS } from "@/src/utils/frameworks"
import { type Config } from "@/src/utils/get-config"
import { transformNext } from "@/src/utils/transformers/transform-next"
import { describe, expect, test, vi } from "vitest"

import { transform } from "../transformers"

const testConfig: Config = {
  style: "new-york",
  tsx: true,
  rsc: true,
  tailwind: {
    baseColor: "neutral",
    cssVariables: true,
    config: "tailwind.config.ts",
    css: "tailwind.css",
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
  },
  resolvedPaths: {
    cwd: "/test-project",
    components: "/test-project/components",
    utils: "/test-project/lib/utils",
    ui: "/test-project/ui",
    lib: "/test-project/lib",
    hooks: "/test-project/hooks",
    tailwindConfig: "tailwind.config.ts",
    tailwindCss: "tailwind.css",
  },
}

vi.mock("@/src/utils/get-project-info", () => ({
  getProjectInfo: vi.fn(),
}))

describe("transformNext", () => {
  describe("Next.js 16+ transformations", () => {
    test("should transform function declaration export", async () => {
      const { getProjectInfo } = await import("@/src/utils/get-project-info")
      vi.mocked(getProjectInfo).mockResolvedValue({
        framework: FRAMEWORKS["next-app"],
        frameworkVersion: "16.0.0",
        isSrcDir: false,
        isRSC: true,
        isTsx: true,
        tailwindConfigFile: null,
        tailwindCssFile: null,
        tailwindVersion: "v4",
        aliasPrefix: "@",
      })

      expect(
        await transform(
          {
            filename: "middleware.ts",
            raw: `import { NextResponse } from "next/server"

export function middleware(request: Request) {
  return NextResponse.next()
}`,
            config: testConfig,
          },
          [transformNext]
        )
      ).toMatchInlineSnapshot(`
        "import { NextResponse } from "next/server"

        export function proxy(request: Request) {
          return NextResponse.next()
        }"
      `)
    })

    test("should transform async function declaration", async () => {
      const { getProjectInfo } = await import("@/src/utils/get-project-info")
      vi.mocked(getProjectInfo).mockResolvedValue({
        framework: FRAMEWORKS["next-app"],
        frameworkVersion: "16.1.0",
        isSrcDir: false,
        isRSC: true,
        isTsx: true,
        tailwindConfigFile: null,
        tailwindCssFile: null,
        tailwindVersion: "v4",
        aliasPrefix: "@",
      })

      expect(
        await transform(
          {
            filename: "middleware.ts",
            raw: `import { NextResponse } from "next/server"

export async function middleware(request: Request) {
  return NextResponse.next()
}`,
            config: testConfig,
          },
          [transformNext]
        )
      ).toMatchInlineSnapshot(`
        "import { NextResponse } from "next/server"

        export async function proxy(request: Request) {
          return NextResponse.next()
        }"
      `)
    })

    test("should transform const arrow function export", async () => {
      const { getProjectInfo } = await import("@/src/utils/get-project-info")
      vi.mocked(getProjectInfo).mockResolvedValue({
        framework: FRAMEWORKS["next-app"],
        frameworkVersion: "16.0.0",
        isSrcDir: false,
        isRSC: true,
        isTsx: true,
        tailwindConfigFile: null,
        tailwindCssFile: null,
        tailwindVersion: "v4",
        aliasPrefix: "@",
      })

      expect(
        await transform(
          {
            filename: "middleware.ts",
            raw: `import { NextResponse } from "next/server"

export const middleware = (request: Request) => {
  return NextResponse.next()
}`,
            config: testConfig,
          },
          [transformNext]
        )
      ).toMatchInlineSnapshot(`
        "import { NextResponse } from "next/server"

        export const proxy = (request: Request) => {
          return NextResponse.next()
        }"
      `)
    })

    test("should transform named export with alias", async () => {
      const { getProjectInfo } = await import("@/src/utils/get-project-info")
      vi.mocked(getProjectInfo).mockResolvedValue({
        framework: FRAMEWORKS["next-app"],
        frameworkVersion: "16.0.0",
        isSrcDir: false,
        isRSC: true,
        isTsx: true,
        tailwindConfigFile: null,
        tailwindCssFile: null,
        tailwindVersion: "v4",
        aliasPrefix: "@",
      })

      expect(
        await transform(
          {
            filename: "middleware.ts",
            raw: `import { NextResponse } from "next/server"

function handler(request: Request) {
  return NextResponse.next()
}

export { handler as middleware }`,
            config: testConfig,
          },
          [transformNext]
        )
      ).toMatchInlineSnapshot(`
        "import { NextResponse } from "next/server"

        function handler(request: Request) {
          return NextResponse.next()
        }

        export { handler as proxy }"
      `)
    })
  })

  describe("Next.js < 16 or unknown versions (no transformation)", () => {
    test("should not transform for Next.js 15", async () => {
      const { getProjectInfo } = await import("@/src/utils/get-project-info")
      vi.mocked(getProjectInfo).mockResolvedValue({
        framework: FRAMEWORKS["next-app"],
        frameworkVersion: "15.0.0",
        isSrcDir: false,
        isRSC: true,
        isTsx: true,
        tailwindConfigFile: null,
        tailwindCssFile: null,
        tailwindVersion: "v4",
        aliasPrefix: "@",
      })

      const input = `import { NextResponse } from "next/server"

export function middleware(request: Request) {
  return NextResponse.next()
}`

      expect(
        await transform(
          {
            filename: "middleware.ts",
            raw: input,
            config: testConfig,
          },
          [] // Don't include transformNext for Next.js 15
        )
      ).toBe(input)
    })

    test("should not transform when frameworkVersion is null", async () => {
      const { getProjectInfo } = await import("@/src/utils/get-project-info")
      vi.mocked(getProjectInfo).mockResolvedValue({
        framework: FRAMEWORKS["next-app"],
        frameworkVersion: null,
        isSrcDir: false,
        isRSC: true,
        isTsx: true,
        tailwindConfigFile: null,
        tailwindCssFile: null,
        tailwindVersion: "v4",
        aliasPrefix: "@",
      })

      const input = `import { NextResponse } from "next/server"

export function middleware(request: Request) {
  return NextResponse.next()
}`

      expect(
        await transform(
          {
            filename: "middleware.ts",
            raw: input,
            config: testConfig,
          },
          [] // Don't include transformNext when frameworkVersion is null
        )
      ).toBe(input)
    })

    test("should not transform for canary tag (unknown version)", async () => {
      const { getProjectInfo } = await import("@/src/utils/get-project-info")
      vi.mocked(getProjectInfo).mockResolvedValue({
        framework: FRAMEWORKS["next-app"],
        frameworkVersion: "canary",
        isSrcDir: false,
        isRSC: true,
        isTsx: true,
        tailwindConfigFile: null,
        tailwindCssFile: null,
        tailwindVersion: "v4",
        aliasPrefix: "@",
      })

      const input = `import { NextResponse } from "next/server"

export function middleware(request: Request) {
  return NextResponse.next()
}`

      expect(
        await transform(
          {
            filename: "middleware.ts",
            raw: input,
            config: testConfig,
          },
          [] // Don't include transformNext for canary tag
        )
      ).toBe(input)
    })

    test("should not transform for latest tag (unknown version)", async () => {
      const { getProjectInfo } = await import("@/src/utils/get-project-info")
      vi.mocked(getProjectInfo).mockResolvedValue({
        framework: FRAMEWORKS["next-app"],
        frameworkVersion: "latest",
        isSrcDir: false,
        isRSC: true,
        isTsx: true,
        tailwindConfigFile: null,
        tailwindCssFile: null,
        tailwindVersion: "v4",
        aliasPrefix: "@",
      })

      const input = `import { NextResponse } from "next/server"

export function middleware(request: Request) {
  return NextResponse.next()
}`

      expect(
        await transform(
          {
            filename: "middleware.ts",
            raw: input,
            config: testConfig,
          },
          [] // Don't include transformNext for latest tag
        )
      ).toBe(input)
    })
  })

  describe("Non-middleware files", () => {
    test("should not transform non-middleware files", async () => {
      const { getProjectInfo } = await import("@/src/utils/get-project-info")
      vi.mocked(getProjectInfo).mockResolvedValue({
        framework: FRAMEWORKS["next-app"],
        frameworkVersion: "16.0.0",
        isSrcDir: false,
        isRSC: true,
        isTsx: true,
        tailwindConfigFile: null,
        tailwindCssFile: null,
        tailwindVersion: "v4",
        aliasPrefix: "@",
      })

      const input = `export function middleware() {
  return "not a middleware file"
}`

      expect(
        await transform(
          {
            filename: "utils.ts",
            raw: input,
            config: testConfig,
          },
          [] // Don't include transformNext for non-middleware files
        )
      ).toBe(input)
    })

    test("should not transform nested middleware files", async () => {
      const { getProjectInfo } = await import("@/src/utils/get-project-info")
      vi.mocked(getProjectInfo).mockResolvedValue({
        framework: FRAMEWORKS["next-app"],
        frameworkVersion: "16.0.0",
        isSrcDir: false,
        isRSC: true,
        isTsx: true,
        tailwindConfigFile: null,
        tailwindCssFile: null,
        tailwindVersion: "v4",
        aliasPrefix: "@",
      })

      const input = `export function middleware() {
  return "nested middleware"
}`

      // Nested middleware files should not be transformed
      expect(
        await transform(
          {
            filename: "lib/middleware.ts",
            raw: input,
            config: testConfig,
          },
          [] // Don't include transformNext for nested middleware files
        )
      ).toBe(input)

      expect(
        await transform(
          {
            filename: "lib/supabase/middleware.ts",
            raw: input,
            config: testConfig,
          },
          [] // Don't include transformNext for nested middleware files
        )
      ).toBe(input)
    })
  })

  describe("Non-Next.js projects", () => {
    test("should not transform for Vite projects", async () => {
      const { getProjectInfo } = await import("@/src/utils/get-project-info")
      vi.mocked(getProjectInfo).mockResolvedValue({
        framework: FRAMEWORKS["vite"],
        frameworkVersion: null,
        isSrcDir: false,
        isRSC: false,
        isTsx: true,
        tailwindConfigFile: null,
        tailwindCssFile: null,
        tailwindVersion: "v4",
        aliasPrefix: "@",
      })

      const input = `export function middleware() {
  return "some middleware"
}`

      expect(
        await transform(
          {
            filename: "middleware.ts",
            raw: input,
            config: testConfig,
          },
          [] // Don't include transformNext for non-Next.js projects
        )
      ).toBe(input)
    })
  })
})

async function transformNextIn(raw: string) {
  return transform(
    {
      filename: "middleware.ts",
      raw,
      config: testConfig,
    },
    [transformNext]
  )
}

describe("transformNext characterization", () => {
  describe("declarations", () => {
    test("renames a default exported function", async () => {
      expect(
        await transformNextIn(`import { NextResponse, type NextRequest } from "next/server"

export default function middleware(request: NextRequest) {
  return NextResponse.next()
}`)
      ).toMatchInlineSnapshot(`
        "import { NextResponse, type NextRequest } from "next/server"

        export default function proxy(request: NextRequest) {
          return NextResponse.next()
        }"
      `)
    })

    test("renames a const and its default export (next-intl)", async () => {
      expect(
        await transformNextIn(`import createMiddleware from "next-intl/middleware"

import { routing } from "./i18n/routing"

const middleware = createMiddleware(routing)

export default middleware

export const config = {
  matcher: ["/((?!api|_next|.*\\\\..*).*)"],
}`)
      ).toMatchInlineSnapshot(`
        "import createMiddleware from "next-intl/middleware"

        import { routing } from "./i18n/routing"

        const proxy = createMiddleware(routing)

        export default proxy

        export const config = {
          matcher: ["/((?!api|_next|.*\\\\..*).*)"],
        }"
      `)
    })

    test("does not rename a destructured binding (next-auth)", async () => {
      // Current behavior: destructured declarations are not renamed.
      const raw = `import NextAuth from "next-auth"

import { authConfig } from "./auth.config"

export const { auth: middleware } = NextAuth(authConfig)`
      expect(await transformNextIn(raw)).toBe(raw)
    })

    test("leaves a file without middleware untouched", async () => {
      const raw = `export function proxy() {}

export const config = { matcher: "/" }`
      expect(await transformNextIn(raw)).toBe(raw)
    })
  })

  describe("export specifiers", () => {
    test("renames a local function exported with export { middleware }", async () => {
      expect(
        await transformNextIn(`import { NextResponse } from "next/server"

function middleware() {
  return NextResponse.next()
}

export { middleware }`)
      ).toMatchInlineSnapshot(`
        "import { NextResponse } from "next/server"

        function proxy() {
          return NextResponse.next()
        }

        export { proxy }"
      `)
    })

    test("renames a local const exported as default", async () => {
      expect(
        await transformNextIn(`import { NextResponse } from "next/server"

const middleware = () => NextResponse.next()

export { middleware as default }`)
      ).toMatchInlineSnapshot(`
        "import { NextResponse } from "next/server"

        const proxy = () => NextResponse.next()

        export { proxy as default }"
      `)
    })

    test("renames an aliased re-export (next-auth v5)", async () => {
      expect(
        await transformNextIn(`export { auth as middleware } from "@/auth"`)
      ).toMatchInlineSnapshot(`"export { auth as proxy } from "@/auth""`)
    })

    test("renames a default re-export alias", async () => {
      expect(
        await transformNextIn(`export { default as middleware } from "next-auth/middleware"

export const config = { matcher: ["/dashboard"] }`)
      ).toMatchInlineSnapshot(`
        "export { default as proxy } from "next-auth/middleware"

        export const config = { matcher: ["/dashboard"] }"
      `)
    })

    test("renames the exported name of a plain re-export", async () => {
      // Current behavior: the re-exported name changes, so it no longer matches the source module.
      expect(
        await transformNextIn(`export { middleware } from "./lib/middleware"`)
      ).toMatchInlineSnapshot(`"export { proxy } from "./lib/middleware""`)
    })

    test("renames the export of an imported binding but not the import", async () => {
      // Current behavior: the export refers to an undeclared proxy.
      expect(
        await transformNextIn(`import { middleware } from "./lib/middleware"

export { middleware }`)
      ).toMatchInlineSnapshot(`
        "import { middleware } from "./lib/middleware"

        export { proxy }"
      `)
    })
  })

  describe("references", () => {
    test("renames references, typeof and nested uses but not strings or comments", async () => {
      expect(
        await transformNextIn(`import { NextResponse, type NextRequest } from "next/server"

// middleware runs before every request.
export function middleware(request: NextRequest) {
  console.log("middleware", middleware.name)
  return NextResponse.next()
}

export type Middleware = typeof middleware

export function withLogging(handler: Middleware = middleware) {
  return (request: NextRequest) => middleware(request) ?? handler(request)
}`)
      ).toMatchInlineSnapshot(`
        "import { NextResponse, type NextRequest } from "next/server"

        // middleware runs before every request.
        export function proxy(request: NextRequest) {
          console.log("middleware", proxy.name)
          return NextResponse.next()
        }

        export type Middleware = typeof proxy

        export function withLogging(handler: Middleware = proxy) {
          return (request: NextRequest) => proxy(request) ?? handler(request)
        }"
      `)
    })

    test("does not rename a shadowed local middleware", async () => {
      expect(
        await transformNextIn(`import { NextResponse, type NextRequest } from "next/server"

export const middleware = (request: NextRequest) => NextResponse.next()

function compose() {
  const middleware = (request: NextRequest) => request
  function inner(middleware: unknown) {
    return middleware
  }
  return inner(middleware)
}

export { compose }`)
      ).toMatchInlineSnapshot(`
        "import { NextResponse, type NextRequest } from "next/server"

        export const proxy = (request: NextRequest) => NextResponse.next()

        function compose() {
          const middleware = (request: NextRequest) => request
          function inner(middleware: unknown) {
            return middleware
          }
          return inner(middleware)
        }

        export { compose }"
      `)
    })

    test("renames into a local name that already exists", async () => {
      // Current behavior: no conflict check, so two declarations named proxy result.
      expect(
        await transformNextIn(`import { createProxy } from "./proxy-client"

const proxy = createProxy()

export function middleware(request: Request) {
  return proxy(request)
}`)
      ).toMatchInlineSnapshot(`
        "import { createProxy } from "./proxy-client"

        const proxy = createProxy()

        export function proxy(request: Request) {
          return proxy(request)
        }"
      `)
    })

    test("renames next to an existing exported proxy", async () => {
      // Current behavior: no conflict check, so two exported proxy functions result.
      expect(
        await transformNextIn(`export function proxy(request: Request) {
  return request
}

export function middleware(request: Request) {
  return proxy(request)
}`)
      ).toMatchInlineSnapshot(`
        "export function proxy(request: Request) {
          return request
        }

        export function proxy(request: Request) {
          return proxy(request)
        }"
      `)
    })
  })

  describe("line endings", () => {
    test("keeps CRLF line endings", async () => {
      expect(
        await transformNextIn(
          [
            `import { NextResponse } from "next/server"`,
            ``,
            `export function middleware() {`,
            `  return NextResponse.next()`,
            `}`,
          ].join("\r\n")
        )
      ).toBe(
        [
          `import { NextResponse } from "next/server"`,
          ``,
          `export function proxy() {`,
          `  return NextResponse.next()`,
          `}`,
        ].join("\r\n")
      )
    })
  })
})
