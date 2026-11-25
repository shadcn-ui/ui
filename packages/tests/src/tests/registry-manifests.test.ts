import { expect, it } from "vitest"

it("declares the dependencies imported by shipped UI files", async () => {
  const registryUrl = process.env.REGISTRY_URL || "http://localhost:4000/r"
  const expected = {
    "base-nova/badge": ["@base-ui/react", "class-variance-authority", "cn"],
    "radix-nova/button": ["class-variance-authority", "cn", "radix-ui"],
    "aria-nova/button": [
      "class-variance-authority",
      "cn",
      "react-aria-components",
    ],
    "new-york-v4/empty": ["class-variance-authority", "cn"],
    "new-york/badge": ["class-variance-authority"],
    "new-york/empty": ["class-variance-authority"],
    "default/badge": ["class-variance-authority"],
    "default/empty": ["class-variance-authority"],
  }

  const actual = await Promise.all(
    Object.keys(expected).map(async (item) => {
      const response = await fetch(`${registryUrl}/styles/${item}.json`)
      expect(response.ok, item).toBe(true)
      const { dependencies } = (await response.json()) as {
        dependencies?: string[]
      }
      return [item, (dependencies ?? []).sort()] as const
    })
  )

  expect(Object.fromEntries(actual)).toEqual(expected)
})
