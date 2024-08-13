import path from "path"
import { describe, expect, test } from "vitest"

import { getProjectType } from "../../src/utils/get-project-info"

describe("get project type", async () => {
  test.each([
    {
      name: "next-app",
      type: {
        framework: "next-app",
        isUsingSrcDir: false,
        isTypescript: true,
      },
    },
    {
      name: "next-app-src",
      type: {
        framework: "next-app",
        isUsingSrcDir: true,
        isTypescript: true,
      },
    },
    {
      name: "next-pages",
      type: {
        framework: "next-pages",
        isUsingSrcDir: false,
        isTypescript: true,
      },
    },
    {
      name: "next-pages-src",
      type: {
        framework: "next-pages",
        isUsingSrcDir: true,
        isTypescript: true,
      },
    },
    {
      name: "t3-pages",
      type: {
        framework: "next-pages",
        isUsingSrcDir: true,
        isTypescript: true,
      },
    },
    {
      name: "t3-app",
      type: {
        framework: "next-app",
        isUsingSrcDir: true,
        isTypescript: true,
      },
    },
    {
      name: "astro",
      type: {
        framework: "astro",
        isUsingSrcDir: true,
        isTypescript: true,
      },
    },
    {
      name: "vite",
      type: {
        framework: "vite",
        isUsingSrcDir: true,
        isTypescript: false,
      },
    },
    {
      name: "remix",
      type: {
        framework: "remix",
        isUsingSrcDir: false,
        isTypescript: true,
      },
    },
  ])(`getProjectType($name) -> $type`, async ({ name, type }) => {
    expect(
      await getProjectType(
        path.resolve(__dirname, `../fixtures/frameworks/${name}`)
      )
    ).toStrictEqual(type)
  })
})
