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
