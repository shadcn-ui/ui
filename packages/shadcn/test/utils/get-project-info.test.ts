import path from "path"
import { describe, expect, test } from "vitest"

import { FRAMEWORKS } from "../../src/utils/frameworks"
import {
  getFrameworkVersion,
  getProjectInfo,
} from "../../src/utils/get-project-info"

describe("get project info", async () => {
  test.each([
    {
      name: "next-app",
      type: {
        framework: FRAMEWORKS["next-app"],
        isSrcDir: false,
        isRSC: true,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "app/globals.css",
        tailwindVersion: "v3",
        frameworkVersion: null,
        aliasPrefix: "@",
      },
    },
    {
      name: "next-app-src",
      type: {
        framework: FRAMEWORKS["next-app"],
        isSrcDir: true,
        isRSC: true,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "src/app/styles.css",
        tailwindVersion: "v3",
        frameworkVersion: null,
        aliasPrefix: "#",
      },
    },
    {
      name: "next-pages",
      type: {
        framework: FRAMEWORKS["next-pages"],
        isSrcDir: false,
        isRSC: false,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "styles/globals.css",
        tailwindVersion: "v4",
        frameworkVersion: null,
        aliasPrefix: "~",
      },
    },
    {
      name: "next-pages-src",
      type: {
        framework: FRAMEWORKS["next-pages"],
        isSrcDir: true,
        isRSC: false,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "src/styles/globals.css",
        tailwindVersion: "v4",
        frameworkVersion: null,
        aliasPrefix: "@",
      },
    },
    {
      name: "t3-app",
      type: {
        framework: FRAMEWORKS["next-app"],
        isSrcDir: true,
        isRSC: true,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "src/styles/globals.css",
        tailwindVersion: "v3",
        frameworkVersion: "14.2.4",
        aliasPrefix: "~",
      },
    },
    {
      name: "t3-pages",
      type: {
        framework: FRAMEWORKS["next-pages"],
        isSrcDir: true,
        isRSC: false,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "src/styles/globals.css",
        tailwindVersion: "v3",
        frameworkVersion: "13.4.2",
        aliasPrefix: "~",
      },
    },
    {
      name: "remix",
      type: {
        framework: FRAMEWORKS["remix"],
        isSrcDir: false,
        isRSC: false,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "app/tailwind.css",
        tailwindVersion: "v3",
        frameworkVersion: null,
        aliasPrefix: "~",
      },
    },
    {
      name: "remix-indie-stack",
      type: {
        framework: FRAMEWORKS["remix"],
        isSrcDir: false,
        isRSC: false,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "app/tailwind.css",
        tailwindVersion: "v3",
        frameworkVersion: null,
        aliasPrefix: "~",
      },
    },
    {
      name: "vite",
      type: {
        framework: FRAMEWORKS["vite"],
        isSrcDir: true,
        isRSC: false,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.js",
        tailwindCssFile: "src/index.css",
        tailwindVersion: "v3",
        frameworkVersion: null,
        aliasPrefix: null,
      },
    },
  ])(`getProjectType($name) -> $type`, async ({ name, type }) => {
    expect(
      await getProjectInfo(
        path.resolve(__dirname, `../fixtures/frameworks/${name}`)
      )
    ).toStrictEqual(type)
  })
})

describe("getFrameworkVersion", () => {
  describe("Next.js version detection", () => {
    test.each([
      {
        name: "exact semver",
        input: "16.0.0",
        framework: "next-app",
        expected: "16.0.0",
      },
      {
        name: "caret prefix",
        input: "^16.1.2",
        framework: "next-app",
        expected: "16.1.2",
      },
      {
        name: "tilde prefix",
        input: "~15.0.3",
        framework: "next-app",
        expected: "15.0.3",
      },
      {
        name: "version range",
        input: ">=15.0.0 <16.0.0",
        framework: "next-app",
        expected: "15.0.0",
      },
      {
        name: "latest tag",
        input: "latest",
        framework: "next-app",
        expected: "latest",
      },
      {
        name: "canary tag",
        input: "canary",
        framework: "next-app",
        expected: "canary",
      },
      {
        name: "rc tag",
        input: "rc",
        framework: "next-app",
        expected: "rc",
      },
    ])(
      `should extract $name ($input) -> $expected`,
      async ({ input, framework, expected }) => {
        const packageJson = {
          dependencies: {
            next: input,
          },
        }
        const version = await getFrameworkVersion(
          FRAMEWORKS[framework as keyof typeof FRAMEWORKS],
          packageJson
        )
        expect(version).toBe(expected)
      }
    )

    test("should handle version in devDependencies", async () => {
      const packageJson = {
        devDependencies: {
          next: "16.0.0",
        },
      }
      const version = await getFrameworkVersion(
        FRAMEWORKS["next-pages"],
        packageJson
      )
      expect(version).toBe("16.0.0")
    })

    test("should return null when next is not in dependencies", async () => {
      const packageJson = {
        dependencies: {
          react: "^18.0.0",
        },
      }
      const version = await getFrameworkVersion(
        FRAMEWORKS["next-app"],
        packageJson
      )
      expect(version).toBe(null)
    })

    test("should return null when packageJson is null", async () => {
      const version = await getFrameworkVersion(FRAMEWORKS["next-app"], null)
      expect(version).toBe(null)
    })
  })

  describe("Other frameworks", () => {
    test.each([
      {
        name: "Vite",
        framework: "vite",
        package: "vite",
        version: "^5.0.0",
      },
      {
        name: "Remix",
        framework: "remix",
        package: "@remix-run/react",
        version: "^2.0.0",
      },
      {
        name: "Astro",
        framework: "astro",
        package: "astro",
        version: "^4.0.0",
      },
    ])(
      `should return null for $name`,
      async ({ framework, package: pkg, version: ver }) => {
        const packageJson = {
          dependencies: {
            [pkg]: ver,
          },
        }
        const version = await getFrameworkVersion(
          FRAMEWORKS[framework as keyof typeof FRAMEWORKS],
          packageJson
        )
        expect(version).toBe(null)
      }
    )
  })
})
