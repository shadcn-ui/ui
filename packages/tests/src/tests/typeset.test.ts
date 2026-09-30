import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

// Typeset's append-stability contract: appending content must never restyle
// content already on screen. Enforced statically — banned forward-looking
// selectors and one-direction margins are what make the guarantee hold. The
// contract covers the core file and every companion stylesheet.
const read = (file: string) =>
  readFileSync(
    path.resolve(__dirname, `../../../../apps/v4/app/(app)/(typeset)/${file}`),
    "utf-8"
  )

// Comments may mention banned selectors while explaining why they are banned.
const strip = (raw: string) => raw.replace(/\/\*[\s\S]*?\*\//g, "")

const css = strip(read("typeset.css"))

const FILES: Record<string, string> = {
  "typeset.css": css,
}

// Selectors whose match set changes when a sibling or child is appended.
const FORWARD_LOOKING = [
  ":last-child",
  ":last-of-type",
  ":nth-last-child",
  ":nth-last-of-type",
  ":only-child",
  ":only-of-type",
  ":has(",
  ":empty",
]

describe.each(Object.entries(FILES))(
  "%s append-stability contract",
  (file, contents) => {
    it.each(FORWARD_LOOKING)("never uses %s", (selector) => {
      expect(contents).not.toContain(selector)
    })

    it("only spaces forward: no margin-bottom, margin-block-end always 0", () => {
      expect(contents).not.toContain("margin-bottom")
      const ends = [...contents.matchAll(/margin-block-end: ([^;]+);/g)].map(
        (match) => match[1]
      )
      for (const value of ends) {
        expect(value).toBe("0")
      }
    })

    it("does not use the margin shorthand (hides a block-end value)", () => {
      expect(contents).not.toMatch(/[^-]margin:/)
    })

    it("guards every element rule with the not-typeset escape", () => {
      // Element rules nest inside one guarded umbrella via &:where(); any
      // flat .typeset descendant rule outside it carries the guard itself.
      expect(contents).toMatch(
        /\.typeset\s+\*:not\(\s*:where\(\s*\.not-typeset,\s*\[data-not-typeset\],\s*\.not-typeset \*,\s*\[data-not-typeset\] \*\s*\)\s*\)\s*\{/
      )
      const nested = [...contents.matchAll(/&:where\(/g)]
      expect(nested.length).toBeGreaterThan(file === "typeset.css" ? 50 : 1)
      const selectors = [...contents.matchAll(/\.typeset[^{}]*?\{/g)]
        .map((match) => match[0])
        .filter((selector) => !/\.typeset \{$/.test(selector))
        // Opt-in utility classes (.typeset-scroll, etc.) don't need the guard.
        .filter((selector) => !selector.includes(".typeset-"))
      expect(selectors.length).toBeGreaterThan(1)
      for (const selector of selectors) {
        expect(selector).toContain(".not-typeset")
        expect(selector).toContain("[data-not-typeset]")
      }
    })
  }
)

describe("typeset.css invariants", () => {
  it("keeps the config knobs", () => {
    for (const knob of [
      "--typeset-font-body: ",
      "--typeset-font-heading: ",
      "--typeset-font-mono: ",
      "--typeset-size: ",
      "--typeset-leading: ",
      "--typeset-flow: ",
    ]) {
      expect(css).toContain(knob)
    }
  })

  it("separates table rows on cells, not on row position", () => {
    expect(css).not.toMatch(/tr:(first|last)/)
    expect(css).toMatch(/tbody[\s\S]{0,400}border-block-start/)
  })
})
