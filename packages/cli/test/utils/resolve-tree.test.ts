import { expect, test } from "vitest"

import { Component } from "../../src/utils/get-components"
import { resolveTree } from "../../src/utils/resolve-tree"

test("resolve tree", async () => {
  const components: Component[] = [
    {
      name: "button",
      dependencies: ["@radix-ui/react-slot"],
      files: [
        {
          name: "button.tsx",
          content: `export const Button = () => {}`,
          dir: "components/ui",
        },
      ],
    },
    {
      name: "dialog",
      dependencies: ["@radix-ui/react-dialog"],
      componentDependencies: ["button"],
      files: [
        {
          name: "dialog.tsx",
          content: `export const Dialog = () => {}`,
          dir: "components/ui",
        },
      ],
    },
    {
      name: "alert-dialog",
      dependencies: ["@radix-ui/react-alert-dialog"],
      componentDependencies: ["button", "dialog"],
      files: [
        {
          name: "alert-dialog.tsx",
          content: `export const AlertDialog = () => {}`,
          dir: "components/ui",
        },
      ],
    },
  ]

  expect(
    (await resolveTree(components, ["button"]))
      .map((component) => component.name)
      .sort()
  ).toEqual(["button"])

  expect(
    (await resolveTree(components, ["dialog"]))
      .map((component) => component.name)
      .sort()
  ).toEqual(["button", "dialog"])

  expect(
    (await resolveTree(components, ["alert-dialog"]))
      .map((component) => component.name)
      .sort()
  ).toEqual(["alert-dialog", "button", "dialog"])
})
