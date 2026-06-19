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

  test("should use configCssFile when provided and file exists", async () => {
    const cwd = path.resolve(
      __dirname,
      "../fixtures/frameworks/next-monorepo"
    )
    expect(
      await getTailwindCssFile(cwd, "packages/ui/src/globals.css")
    ).toBe("packages/ui/src/globals.css")
  })

  test("should fall back to glob when configCssFile does not exist", async () => {
    const cwd = path.resolve(__dirname, "../fixtures/frameworks/next-app")
    expect(
      await getTailwindCssFile(cwd, "nonexistent/styles.css")
    ).toBe("app/globals.css")
  })

  test("should return null when no css file found and no configCssFile", async () => {
    const cwd = path.resolve(
      __dirname,
      "../fixtures/frameworks/next-monorepo"
    )
    // The CSS file is nested under packages/ which the glob finds.
    // Without configCssFile, it should still find it via glob.
    expect(await getTailwindCssFile(cwd)).toBe(
      "packages/ui/src/globals.css"
    )
  })
})
