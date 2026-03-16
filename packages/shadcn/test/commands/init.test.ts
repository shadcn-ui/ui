import { describe, expect, test } from "vitest"

import { shouldRunTemplatePostInit } from "../../src/commands/init"

describe("shouldRunTemplatePostInit", () => {
  test("does not run post-init for existing projects with an explicit template", () => {
    expect(
      shouldRunTemplatePostInit(
        { postInit: async () => {} },
        false
      )
    ).toBe(false)
  })

  test("runs post-init for newly scaffolded template projects", () => {
    expect(
      shouldRunTemplatePostInit(
        { postInit: async () => {} },
        true
      )
    ).toBe(true)
  })

  test("does not run post-init when there is no template", () => {
    expect(shouldRunTemplatePostInit(undefined, true)).toBe(false)
  })
})
