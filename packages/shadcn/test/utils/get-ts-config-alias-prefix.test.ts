import path from "path"
import { describe, expect, test } from "vitest"

import { getTsConfigAliasPrefix } from "../../src/utils/get-project-info"

describe("get ts config alias prefix", async () => {
  test.each([
    {
      name: "next-app",
      prefix: "@",
    },
    {
      name: "next-app-src",
      prefix: "#",
    },
    {
      name: "next-pages",
      prefix: "~",
    },
    {
      name: "next-pages-src",
      prefix: "@",
    },
    {
      name: "t3-app",
      prefix: "~",
    },
    {
      name: "next-app-custom-alias",
      prefix: "@custom-alias",
    },
  ])(`getTsConfigAliasPrefix($name) -> $prefix`, async ({ name, prefix }) => {
    expect(
      await getTsConfigAliasPrefix(
        path.resolve(__dirname, `../fixtures/frameworks/${name}`)
      )
    ).toBe(prefix)
  })
})
