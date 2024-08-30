import path from "path"
import { describe, expect, test } from "vitest"

import { getTailwindCssFile } from "../../src/utils/get-project-info"

describe("get tailwindcss file", async () => {
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
    {
      name: "t3-pages",
      file: "src/styles/globals.css",
    },
    {
      name: "remix",
      file: "app/tailwind.css",
    },
    {
      name: "vite",
      file: "src/index.css",
    },
  ])(`getTailwindCssFile($name) -> $file`, async ({ name, file }) => {
    expect(
      await getTailwindCssFile(
        path.resolve(__dirname, `../fixtures/frameworks/${name}`)
      )
    ).toBe(file)
  })
})
