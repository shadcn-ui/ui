import { promises as fs } from "fs"
import path from "path"
import { expect, test } from "vitest"

import { applyCSSUpdates } from "../../src/utils/css"

const baseColor = {
  cssVars: {
    light: {
      background: "0 0% 100%",
      foreground: "224 71.4% 4.1%",
      primary: "220.9 39.3% 11%",
      "primary-foreground": "210 20% 98%",
      border: "220 13% 91%",
      input: "220 13% 91%",
      ring: "224 71.4% 4.1%",
    },
    dark: {
      background: "224 71.4% 4.1%",
      foreground: "210 20% 98%",
      primary: "210 20% 98%",
      "primary-foreground": "220.9 39.3% 11%",
      border: "215 27.9% 16.9%",
      input: "215 27.9% 16.9%",
      ring: "216 12.2% 83.9%",
    },
  },
}

test("apply css updates", async () => {
  expect(
    await applyCSSUpdates(
      await fs.readFile(
        path.resolve(__dirname, "../fixtures/css/no-tailwind.css"),
        "utf8"
      ),
      baseColor,
      {
        tailwind: {
          cssVariables: false,
        },
      }
    )
  ).toMatchSnapshot()

  expect(
    await applyCSSUpdates(
      await fs.readFile(
        path.resolve(__dirname, "../fixtures/css/app-globals.css"),
        "utf8"
      ),
      baseColor,
      {
        tailwind: {
          cssVariables: false,
        },
      }
    )
  ).toMatchSnapshot()

  expect(
    await applyCSSUpdates(
      await fs.readFile(
        path.resolve(__dirname, "../fixtures/css/no-tailwind.css"),
        "utf8"
      ),
      baseColor,
      {
        tailwind: {
          cssVariables: true,
        },
      }
    )
  ).toMatchSnapshot()

  expect(
    await applyCSSUpdates(
      await fs.readFile(
        path.resolve(__dirname, "../fixtures/css/app-globals.css"),
        "utf8"
      ),
      baseColor,
      {
        tailwind: {
          cssVariables: true,
        },
      }
    )
  ).toMatchSnapshot()

  // Prefix.
  expect(
    await applyCSSUpdates(
      await fs.readFile(
        path.resolve(__dirname, "../fixtures/css/no-tailwind.css"),
        "utf8"
      ),
      baseColor,
      {
        tailwind: {
          cssVariables: true,
          prefix: "tw-",
        },
      }
    )
  ).toMatchSnapshot()

  expect(
    await applyCSSUpdates(
      await fs.readFile(
        path.resolve(__dirname, "../fixtures/css/app-globals.css"),
        "utf8"
      ),
      baseColor,
      {
        tailwind: {
          cssVariables: true,
          prefix: "cn-",
        },
      }
    )
  ).toMatchSnapshot()

  // Applied.
  expect(
    await applyCSSUpdates(
      await fs.readFile(
        path.resolve(__dirname, "../fixtures/css/applied.css"),
        "utf8"
      ),
      baseColor,
      {
        tailwind: {
          cssVariables: false,
        },
      }
    )
  ).toMatchSnapshot()

  expect(
    await applyCSSUpdates(
      await fs.readFile(
        path.resolve(__dirname, "../fixtures/css/applied-css-vars.css"),
        "utf8"
      ),
      baseColor,
      {
        tailwind: {
          cssVariables: true,
        },
      }
    )
  ).toMatchSnapshot()
})
