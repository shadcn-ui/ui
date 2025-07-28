import { describe, expect, it } from "vitest"

import { parseRegistryComponent } from "./parser"

describe("parseRegistryComponent", () => {
  it("should parse registry components", () => {
    expect(parseRegistryComponent("@v0/button")).toEqual({
      registry: "@v0",
      component: "button",
    })

    expect(parseRegistryComponent("@acme/data-table")).toEqual({
      registry: "@acme",
      component: "data-table",
    })

    expect(parseRegistryComponent("@company/nested/component")).toEqual({
      registry: "@company",
      component: "nested/component",
    })
  })

  it("should return null registry for non-registry components", () => {
    expect(parseRegistryComponent("button")).toEqual({
      registry: null,
      component: "button",
    })

    expect(parseRegistryComponent("components/button")).toEqual({
      registry: null,
      component: "components/button",
    })

    expect(parseRegistryComponent("v0/button")).toEqual({
      registry: null,
      component: "v0/button",
    })
  })
})
