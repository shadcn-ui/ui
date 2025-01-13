import { expect, test } from "vitest"

import { resolveTree } from "../../src/registry/api"
import { Registry } from "../../src/registry/schema"

test("resolve tree", async () => {
  const index = [
    {
      name: "button",
      dependencies: ["@radix-ui/react-slot"],
      type: "registry:ui",
      files: [{ type: "registry:ui", path: "button.tsx" }],
    },
    {
      name: "dialog",
      dependencies: ["@radix-ui/react-dialog"],
      registryDependencies: ["button"],
      type: "registry:ui",
      files: [{ type: "registry:ui", path: "dialog.tsx" }],
    },
    {
      name: "input",
      registryDependencies: ["button"],
      type: "registry:ui",
      files: [{ type: "registry:ui", path: "input.tsx" }],
    },
    {
      name: "alert-dialog",
      dependencies: ["@radix-ui/react-alert-dialog"],
      registryDependencies: ["button", "dialog"],
      type: "registry:ui",
      files: [{ type: "registry:ui", path: "alert-dialog.tsx" }],
    },
    {
      name: "example-card",
      type: "registry:component",
      files: [{ type: "registry:component", path: "example-card.tsx" }],
      registryDependencies: ["button", "dialog", "input"],
    },
  ] satisfies Registry

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
