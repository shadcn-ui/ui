import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import {
  onboardingDefaultValues,
  onboardingSchema,
  steps,
} from "./new-york-v4/blocks/onboarding-01/components/onboarding-schema"

const completedForm = {
  ...onboardingDefaultValues,
  fullName: "Ada Lovelace",
  email: "ada@example.com",
  workspaceName: "Acme Inc.",
  workspaceSlug: "acme",
}

describe("onboarding-01 block schema", () => {
  const schemaFields = Object.keys(onboardingSchema.shape).sort()
  const stepFields = steps.flatMap((step) => [...step.fields])

  it("assigns every schema field to a step", () => {
    // A field missing from every step would never be validated by the
    // per-step trigger, letting the user walk past an invalid input.
    expect([...stepFields].sort()).toEqual(schemaFields)
  })

  it("never claims the same field in two steps", () => {
    expect(new Set(stepFields).size).toBe(stepFields.length)
  })

  it("ships a default value for every schema field", () => {
    expect(Object.keys(onboardingDefaultValues).sort()).toEqual(schemaFields)
  })

  it("accepts a completed form", () => {
    expect(onboardingSchema.safeParse(completedForm).success).toBe(true)
  })

  it("rejects a workspace slug with unsupported characters", () => {
    const result = onboardingSchema.safeParse({
      ...completedForm,
      workspaceSlug: "Acme Inc",
    })

    expect(result.success).toBe(false)
  })

  it("rejects an invalid email address", () => {
    const result = onboardingSchema.safeParse({
      ...completedForm,
      email: "ada@",
    })

    expect(result.success).toBe(false)
  })
})

describe("onboarding-01 base parity", () => {
  const registryDir = dirname(fileURLToPath(import.meta.url))
  const schemaPath = (base: string) =>
    resolve(
      registryDir,
      base,
      "blocks/onboarding-01/components/onboarding-schema.ts"
    )

  const reference = readFileSync(schemaPath("new-york-v4"), "utf-8")

  // `registry/bases/README.md` requires shared surfaces to stay in sync across
  // every base. The schema carries no base-specific imports, so the copies
  // must match byte for byte.
  it.each(["bases/base", "bases/aria", "bases/radix"])(
    "%s ships the same onboarding schema",
    (base) => {
      expect(readFileSync(schemaPath(base), "utf-8")).toEqual(reference)
    }
  )
})
