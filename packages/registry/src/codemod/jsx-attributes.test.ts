import { describe, expect, it } from "vitest"

import {
  getJsxAttributes,
  removeJsxAttributes,
  setJsxAttributeInitializer,
} from "./jsx-attributes"
import { getText, parseModule } from "./parse"

// The expected code is ts-morph's, for the same calls on the same code.

function getAttribute(code: string, name: string) {
  return getJsxAttributes(parseModule(code)).find(
    ({ attribute }) => getText(code, attribute.name) === name
  )!
}

// The indexes in getJsxAttributes() of the attributes named names.
function getIndexes(code: string, names: string[]) {
  return getJsxAttributes(parseModule(code)).flatMap(({ attribute }, index) =>
    names.includes(getText(code, attribute.name)) ? [index] : []
  )
}

describe("getJsxAttributes", () => {
  it("lists the attributes in source order, without spreads", () => {
    const code = `<a x="1" {...p} y={<b z w="2" />}><c v /></a>`
    expect(
      getJsxAttributes(parseModule(code)).map(({ attribute }) =>
        getText(code, attribute)
      )
    ).toEqual([`x="1"`, `y={<b z w="2" />}`, "z", `w="2"`, "v"])
  })
})

describe("removeJsxAttributes", () => {
  it.each([
    [`<a id="x" className="c" />`, `<a id="x" />`],
    [`<a className="c" id="x" />`, `<a id="x" />`],
    [`<a\n  id="x"\n  className="c"\n/>`, `<a\n  id="x"\n/>`],
    [`<a\n  className="c"\n  id="x"\n/>`, `<a\n  id="x"\n/>`],
    // A comment between it and the attribute before it goes too.
    [`<a id="x" /* c */ className="c" />`, `<a id="x" />`],
    [`<a\n  id="x"\n  // c\n  className="c"\n/>`, `<a\n  id="x"\n/>`],
    // The trailing comment of the attribute before it stays.
    [`<a\n  id="x" // c\n  className="c"\n/>`, `<a\n  id="x" // c\n/>`],
    // The first attribute goes from its start.
    [`<a /* c */ className="c" />`, `<a /* c */ />`],
    [`<a {...p} className="c" />`, `<a {...p} />`],
    [`<A<T> className="c" />`, `<A<T> />`],
    [`<a\r\n  id="x"\r\n  className="c"\r\n/>`, `<a\r\n  id="x"\r\n/>`],
  ])("removes className from %j", (code, expected) => {
    expect(removeJsxAttributes(code, getIndexes(code, ["className"]))).toBe(
      expected
    )
  })

  it.each([
    // The second attribute is the first one when it is removed, so it keeps
    // the comment before it.
    [`<a className="c" /* c */ classNames="d" />`, `<a /* c */ />`],
    [`<a id="x" className="c" /* c */ classNames="d" />`, `<a id="x" />`],
    [
      `x = <a className="c" />\ny = <b className="d" />`,
      `x = <a />\ny = <b />`,
    ],
  ])("removes them one after the other in %j", (code, expected) => {
    expect(
      removeJsxAttributes(code, getIndexes(code, ["className", "classNames"]))
    ).toBe(expected)
  })
})

describe("setJsxAttributeInitializer", () => {
  it("indents the lines after the first to the attribute", () => {
    const code = `function A() {\n  return (\n    <div>\n      <a className="x" />\n    </div>\n  )\n}\n`
    expect(
      setJsxAttributeInitializer(
        code,
        getAttribute(code, "className").attribute,
        `{cn(\n  "a",\n  b\n)}`
      )
    ).toBe(
      `function A() {\n  return (\n    <div>\n      <a className={cn(\n${" ".repeat(22)}"a",\n${" ".repeat(22)}b\n${" ".repeat(20)})} />\n    </div>\n  )\n}\n`
    )
  })

  it("replaces the initializer", () => {
    const code = `const a = <a className={x} />`
    expect(
      setJsxAttributeInitializer(
        code,
        getAttribute(code, "className").attribute,
        `"y"`
      )
    ).toBe(`const a = <a className="y" />`)
  })
})
