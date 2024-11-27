import { expect, test } from "vitest"

import { resolveTree } from "../../src/utils/registry"

test("resolve tree", async () => {
  const index = [
    {
      name: "button",
      dependencies: ["@radix-ui/react-slot"],
      type: "components:ui",
      files: ["button.tsx"],
    },
    {
      name: "dialog",
      dependencies: ["@radix-ui/react-dialog"],
      registryDependencies: ["button"],
      type: "components:ui",
      files: ["dialog.tsx"],
    },
    {
      name: "input",
      registryDependencies: ["button"],
      type: "components:ui",
      files: ["input.tsx"],
    },
    {
      name: "alert-dialog",
      dependencies: ["@radix-ui/react-alert-dialog"],
      registryDependencies: ["button", "dialog"],
      type: "components:ui",
      files: ["alert-dialog.tsx"],
    },
    {
      name: "example-card",
      type: "components:component",
      files: ["example-card.tsx"],
      registryDependencies: ["button", "dialog", "input"],
    },
  ]

  expect(
    (await resolveTree(index, ["button"])).map((entry) => entry.name).sort()
  ).toEqual(["button"])

  expect(
    (await resolveTree(index, ["dialog"])).map((entry) => entry.name).sort()
  ).toEqual(["button", "dialog"])

  expect(
    (await resolveTree(index, ["alert-dialog", "dialog"]))
      .map((entry) => entry.name)
      .sort()
  ).toEqual(["alert-dialog", "button", "dialog"])

  expect(
    (await resolveTree(index, ["example-card"]))
      .map((entry) => entry.name)
      .sort()
  ).toEqual(["button", "dialog", "example-card", "input"])

  expect(
    (await resolveTree(index, ["foo"])).map((entry) => entry.name).sort()
  ).toEqual([])

  expect(
    (await resolveTree(index, ["button", "foo"]))
      .map((entry) => entry.name)
      .sort()
  ).toEqual(["button"])
})
