import path from "path"
import { describe, expect, test } from "vitest"

import { isTypeScriptProject } from "../../src/utils/get-project-info"

describe("is TypeScript project", async () => {
  test.each([
    {
      name: "next-app",
      result: true,
    },
    {
      name: "next-app-src",
      result: true,
    },
    {
      name: "next-pages",
      result: true,
    },
    {
      name: "next-pages-src",
      result: true,
    },
    {
      name: "t3-app",
      result: true,
    },
    {
      name: "next-app-js",
      result: false,
    },
  ])(`isTypeScriptProject($name) -> $result`, async ({ name, result }) => {
    expect(
      await isTypeScriptProject(
        path.resolve(__dirname, `../fixtures/frameworks/${name}`)
      )
    ).toBe(result)
  })
})
