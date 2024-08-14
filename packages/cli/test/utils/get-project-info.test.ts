import path from "path"
import { describe, expect, test } from "vitest"

import { getProjectInfo } from "../../src/utils/get-project-info"

describe("get project info", async () => {
  test.each([
    {
      name: "next-app",
      type: {
        framework: "next-app",
        isUsingSrcDir: false,
        isTypescript: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "app/globals.css",
        tsConfigAliasPrefix: "@",
      },
    },
    {
      name: "next-app-src",
      type: {
        framework: "next-app",
        isUsingSrcDir: true,
        isTypescript: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "src/app/styles.css",
        tsConfigAliasPrefix: "#",
      },
    },
    {
      name: "next-pages",
      type: {
        framework: "next-pages",
        isUsingSrcDir: false,
        isTypescript: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "styles/globals.css",
        tsConfigAliasPrefix: "~",
      },
    },
    {
      name: "next-pages-src",
      type: {
        framework: "next-pages",
        isUsingSrcDir: true,
        isTypescript: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "src/styles/globals.css",
        tsConfigAliasPrefix: "@",
      },
    },
    {
      name: "t3-app",
      type: {
        framework: "next-app",
        isUsingSrcDir: true,
        isTypescript: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "src/styles/globals.css",
        tsConfigAliasPrefix: "~",
      },
    },
    {
      name: "t3-pages",
      type: {
        framework: "next-pages",
        isUsingSrcDir: true,
        isTypescript: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "src/styles/globals.css",
        tsConfigAliasPrefix: "~",
      },
    },
    {
      name: "remix",
      type: {
        framework: "remix",
        isUsingSrcDir: false,
        isTypescript: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "app/tailwind.css",
        tsConfigAliasPrefix: "~",
      },
    },
    {
      name: "vite",
      type: {
        framework: "vite",
        isUsingSrcDir: true,
        isTypescript: true,
        tailwindConfigFile: "tailwind.config.js",
        tailwindCssFile: "src/index.css",
        tsConfigAliasPrefix: null,
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
