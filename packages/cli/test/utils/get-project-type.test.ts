import path from "path"
import { describe, expect, test } from "vitest"

import { getProjectType } from "../../src/utils/get-project-info"

describe("get project type", async () => {
  test.each([
    {
      name: "next-app",
      type: "next-app",
    },
    {
      name: "next-app-src",
      type: "next-app-src",
    },
    {
      name: "next-pages",
      type: "next-pages",
    },
    {
      name: "next-pages-src",
      type: "next-pages-src",
    },
    {
      name: "project",
      type: null,
    },
    {
      name: "t3-app",
      type: "next-pages-src",
    },
  ])(`getProjectType($name) -> $type`, async ({ name, type }) => {
    expect(
      await getProjectType(path.resolve(__dirname, `../fixtures/${name}`))
    ).toBe(type)
  })
})
