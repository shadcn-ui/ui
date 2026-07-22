import { Config } from "@/src/utils/get-config"
import { transformCssVars } from "@/src/utils/updaters/update-css-vars"
import { describe, expect, it } from "vitest"

import { getBaseColorMigration } from "./migrate-base-color"

const SOURCE = {
  light: {
    background: "oklch(1 0 0)",
    ring: "oklch(0.7 0.01 286)",
    primary: "oklch(0.2 0 0)",
    border: "oklch(0.9 0.01 286)",
  },
  dark: {
    background: "oklch(0.14 0 0)",
    ring: "oklch(0.55 0.02 286)",
  },
}

const TARGET = {
  light: {
    background: "oklch(1 0 0)",
    ring: "oklch(0.708 0 0)",
    primary: "oklch(0.205 0 0)",
    border: "oklch(0.922 0 0)",
  },
  dark: {
    background: "oklch(0.14 0 0)",
    ring: "oklch(0.556 0 0)",
  },
}

describe("getBaseColorMigration", () => {
  it("replaces tokens that still hold the source base color value", () => {
    const css = `@import "tailwindcss";

:root {
  --background: oklch(1 0 0);
  --ring: oklch(0.7 0.01 286);
  --primary: oklch(0.2 0 0);
  --border: oklch(0.9 0.01 286);
}

.dark {
  --background: oklch(0.14 0 0);
  --ring: oklch(0.55 0.02 286);
}`

    const { cssVars, skipped } = getBaseColorMigration(
      css,
      SOURCE,
      TARGET,
      "v4"
    )

    expect(cssVars.light).toEqual({
      ring: "oklch(0.708 0 0)",
      primary: "oklch(0.205 0 0)",
      border: "oklch(0.922 0 0)",
    })
    expect(cssVars.dark).toEqual({ ring: "oklch(0.556 0 0)" })
    expect(skipped).toEqual([])
  })

  it("keeps and reports tokens that no longer match the source", () => {
    const css = `:root {
  --ring: oklch(0.7 0.01 286);
  --primary: oklch(0.55 0.22 260);
}`

    const { cssVars, skipped } = getBaseColorMigration(
      css,
      SOURCE,
      TARGET,
      "v4"
    )

    expect(cssVars.light.ring).toBe("oklch(0.708 0 0)")
    expect(cssVars.light.primary).toBeUndefined()
    expect(skipped).toContainEqual({
      token: "--primary",
      reason: "does not match the source base color",
    })
  })

  it("does not touch or report tokens that are equal across base colors", () => {
    const css = `:root {
  --background: oklch(1 0 0);
  --ring: oklch(0.7 0.01 286);
}`

    const { cssVars, skipped } = getBaseColorMigration(
      css,
      SOURCE,
      TARGET,
      "v4"
    )

    expect(cssVars.light.background).toBeUndefined()
    expect(skipped.map((entry) => entry.token)).not.toContain("--background")
  })

  it("reports tokens that are missing from the CSS", () => {
    const css = `:root {
  --ring: oklch(0.7 0.01 286);
}`

    const { skipped } = getBaseColorMigration(css, SOURCE, TARGET, "v4")

    expect(skipped).toContainEqual({
      token: "--border",
      reason: "not found in your CSS",
    })
  })

  it("wraps local hsl channels before comparing in v4", () => {
    const source = { light: { border: "0 0% 90%" } }
    const target = { light: { border: "0 0% 92%" } }
    const css = `:root {
  --border: hsl(0 0% 90%);
}`

    const { cssVars, skipped } = getBaseColorMigration(
      css,
      source,
      target,
      "v4"
    )

    expect(cssVars.light.border).toBe("0 0% 92%")
    expect(skipped).toEqual([])
  })
})

describe("getBaseColorMigration + transformCssVars", () => {
  it("writes the computed subset into the theme CSS for v4", async () => {
    const source = {
      light: {
        ring: "oklch(0.7 0.01 286)",
        sidebar: "oklch(0.98 0.01 286)",
      },
      dark: { ring: "oklch(0.55 0.02 286)" },
    }
    const target = {
      light: {
        ring: "oklch(0.708 0 0)",
        sidebar: "oklch(0.985 0 0)",
      },
      dark: { ring: "oklch(0.556 0 0)" },
    }
    const css = `@import "tailwindcss";

:root {
  --ring: oklch(0.7 0.01 286);
  --sidebar: oklch(0.98 0.01 286);
  --primary: oklch(0.55 0.22 260);
}

.dark {
  --ring: oklch(0.55 0.02 286);
}`

    const { cssVars } = getBaseColorMigration(css, source, target, "v4")
    const output = await transformCssVars(css, cssVars, {} as Config, {
      tailwindVersion: "v4",
      overwriteCssVars: true,
    })

    // Stock tokens are rewritten to the target base color in both modes.
    expect(output).toContain("--ring: oklch(0.708 0 0)")
    expect(output).toContain("--sidebar: oklch(0.985 0 0)")
    expect(output).toContain("--ring: oklch(0.556 0 0)")
    // Tokens outside the computed subset are left untouched.
    expect(output).toContain("--primary: oklch(0.55 0.22 260)")
    // The @theme inline color mappings are (re)generated.
    expect(output).toContain("@theme inline")
  })
})
