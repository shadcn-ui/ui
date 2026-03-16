import { describe, expect, test } from "vitest"

import {
  getInitAliasDefaults,
  shouldRunTemplatePostInit,
} from "../../src/commands/init"

describe("getInitAliasDefaults", () => {
  test("derives standard aliases from components", () => {
    expect(getInitAliasDefaults("@/components")).toEqual({
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
      utils: "@/lib/utils",
    })
  })

  test("derives package import aliases from #components", () => {
    expect(getInitAliasDefaults("#components")).toEqual({
      ui: "#components/ui",
      lib: "#lib",
      hooks: "#hooks",
      utils: "#lib/utils",
    })
  })

  test("derives sibling aliases for nested custom aliases", () => {
    expect(getInitAliasDefaults("#custom/components")).toEqual({
      ui: "#custom/components/ui",
      lib: "#custom/lib",
      hooks: "#custom/hooks",
      utils: "#custom/lib/utils",
    })
  })

  test("preserves existing aliases when components alias is unchanged", () => {
    expect(
      getInitAliasDefaults("#components", {
        components: "#components",
        ui: "#components/ui",
        lib: "#lib",
        hooks: "#hooks",
        utils: "#lib/utils",
      })
    ).toEqual({
      ui: "#components/ui",
      lib: "#lib",
      hooks: "#hooks",
      utils: "#lib/utils",
    })
  })
})

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
