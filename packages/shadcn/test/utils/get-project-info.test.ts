import path from "path"
import { describe, expect, test } from "vitest"

import { FRAMEWORKS } from "../../src/utils/frameworks"
import { getProjectInfo } from "../../src/utils/get-project-info"

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
