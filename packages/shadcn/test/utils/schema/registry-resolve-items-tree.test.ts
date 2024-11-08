import { describe, expect, test } from "vitest"

import { registryResolveItemsTree } from "../../../src/utils/registry"

describe("registryResolveItemTree", () => {
  test("should resolve items tree", async () => {
    expect(
      await registryResolveItemsTree(["button"], {
        style: "new-york",
        tailwind: {
          baseColor: "stone",
        },
      }, {
        style: "default",
        url: "https://ui.shadcn.com/r"
      })
    ).toMatchSnapshot()
  })

  test("should resolve multiple items tree", async () => {
    expect(
      await registryResolveItemsTree(["button", "input", "command"], {
        style: "default",
        tailwind: {
          baseColor: "zinc",
        },
      }, {
        style: "default",
        url: "https://ui.shadcn.com/r"
      })
    ).toMatchSnapshot()
  })

  test("should resolve index", async () => {
    expect(
      await registryResolveItemsTree(["index", "label"], {
        style: "default",
        tailwind: {
          baseColor: "zinc",
        },
      }, {
        style: "default",
        url: "https://ui.shadcn.com/r"
      })
    ).toMatchSnapshot()
  })
})
