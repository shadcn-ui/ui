import { describe, expect, it } from "vitest"

import { createFileTreeForRegistryItemFiles } from "@/lib/registry"

describe("createFileTreeForRegistryItemFiles", () => {
  it("should create a nested file tree structure", async () => {
    const files = [
      { path: "page.tsx" },
      { path: "components/foo.tsx" },
      { path: "components/baz.tsx" },
      { path: "components/boo/quip.tsx" },
    ]

    const expectedOutput = [
      { name: "page.tsx", path: "page.tsx" },
      {
        name: "components",
        children: [
          { name: "foo.tsx", path: "components/foo.tsx" },
          { name: "baz.tsx", path: "components/baz.tsx" },
          {
            name: "boo",
            children: [{ name: "quip.tsx", path: "components/boo/quip.tsx" }],
          },
        ],
      },
    ]

    const result = await createFileTreeForRegistryItemFiles(files)
    expect(result).toEqual(expectedOutput)
  })

  it("should return an empty array for empty input", async () => {
    const result = await createFileTreeForRegistryItemFiles([])
    expect(result).toEqual([])
  })
})
