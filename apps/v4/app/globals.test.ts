import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { parse, type Rule } from "postcss"
import { describe, expect, it } from "vitest"

const globalsPath = fileURLToPath(new URL("./globals.css", import.meta.url))

function findSupportsCondition(rule: Rule) {
  if (rule.parent?.type === "atrule" && rule.parent.name === "supports") {
    return rule.parent.params
  }

  return null
}

describe("global styles", () => {
  it("limits relative body positioning to iOS Safari", () => {
    const stylesheet = parse(readFileSync(globalsPath, "utf8"))
    const relativeBodyConditions: Array<string | null> = []

    stylesheet.walkRules("body", (rule) => {
      rule.walkDecls("position", (declaration) => {
        if (declaration.value === "relative") {
          relativeBodyConditions.push(findSupportsCondition(rule))
        }
      })
    })

    expect(relativeBodyConditions).toEqual(["(-webkit-touch-callout: none)"])
  })
})
