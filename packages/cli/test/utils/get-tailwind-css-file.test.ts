import path from "path"
import { describe, expect, test } from "vitest"

import { getTailwindCssFile } from "../../src/utils/get-project-info"

describe("get tailwind css file", async () => {
  test.each([
    {
      name: "next-app",
      file: "app/globals.css",
    },
    {
      name: "next-app-src",
      file: "src/app/styles.css",
    },
    {
      name: "next-pages",
      file: "styles/globals.css",
    },
    {
      name: "next-pages-src",
      file: "src/styles/globals.css",
    },
    {
      name: "t3-app",
      file: "src/styles/globals.css",
    },
  ])(`getTailwindCssFile($name) -> $file`, async ({ name, file }) => {
    expect(
      await getTailwindCssFile(path.resolve(__dirname, `../fixtures/${name}`))
    ).toBe(file)
  })
})
