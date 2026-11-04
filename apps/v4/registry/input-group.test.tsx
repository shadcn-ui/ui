import { createRequire } from "node:module"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

const require = createRequire(
  new URL("../../../packages/react/package.json", import.meta.url)
)
const { JSDOM } = require("jsdom")

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  pretendToBeVisual: true,
  url: "http://localhost/",
})

for (const [key, value] of Object.entries({
  window: dom.window,
  document: dom.window.document,
  HTMLElement: dom.window.HTMLElement,
  Element: dom.window.Element,
  Node: dom.window.Node,
  DocumentFragment: dom.window.DocumentFragment,
  navigator: dom.window.navigator,
  getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
  MutationObserver: dom.window.MutationObserver,
  IS_REACT_ACT_ENVIRONMENT: true,
})) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    writable: true,
    value,
  })
}

const React = await import("react")
const { createRoot } = await import("react-dom/client")
const { act } = React
type Root = ReturnType<typeof createRoot>
const { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea } =
  await import("@/registry/bases/radix/ui/input-group")

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(async () => {
  await act(async () => {
    root.unmount()
  })
  container.remove()
})

async function render(node: React.ReactNode) {
  await act(async () => {
    root.render(node)
  })
}

function addon() {
  const element = container.querySelector<HTMLElement>(
    "[data-slot='input-group-addon']"
  )
  if (!element) {
    throw new Error("Missing InputGroupAddon")
  }
  return element
}

describe("InputGroupAddon", () => {
  it("focuses the input from a label hit target and stays out of tab order", async () => {
    await render(
      <InputGroup>
        <InputGroupInput aria-label="Email" />
        <InputGroupAddon>
          <span>https://</span>
        </InputGroupAddon>
      </InputGroup>
    )

    const input = container.querySelector("input")
    const focus = container.querySelector<HTMLLabelElement>(
      "[data-slot='input-group-addon-focus']"
    )

    expect(input).not.toBeNull()
    expect(input?.id).toBeTruthy()
    expect(focus?.htmlFor).toBe(input?.id)
    expect(focus?.getAttribute("aria-hidden")).toBe("true")
    expect(focus?.textContent).toBe("")
    expect(addon().getAttribute("role")).toBe("group")
    expect(addon().tabIndex).toBe(-1)
    expect(addon().className).toContain("pointer-events-none")
    expect(addon().hasAttribute("onclick")).toBe(false)
  })

  it("associates a textarea and preserves an author-supplied id", async () => {
    await render(
      <InputGroup>
        <InputGroupTextarea id="note" aria-label="Note" />
        <InputGroupAddon align="block-end">
          <span>0/200</span>
        </InputGroupAddon>
      </InputGroup>
    )

    const focus = container.querySelector("label")
    expect(container.querySelector("textarea")?.id).toBe("note")
    expect(focus?.htmlFor).toBe("note")
  })

  it("keeps the association after a rerender", async () => {
    function Example({ suffix }: { suffix: string }) {
      return (
        <InputGroup>
          <InputGroupInput aria-label="Amount" />
          <InputGroupAddon>
            <span>{suffix}</span>
          </InputGroupAddon>
        </InputGroup>
      )
    }

    await render(<Example suffix="$" />)
    const id = container.querySelector("input")?.id
    await render(<Example suffix="USD" />)

    expect(container.querySelector("input")?.id).toBe(id)
    expect(container.querySelector("label")?.htmlFor).toBe(id)
  })

  it("does not add a tab stop or focus label when the addon has its own click handler", async () => {
    const onClick = () => {}

    await render(
      <InputGroup>
        <InputGroupInput aria-label="Search" />
        <InputGroupAddon onClick={onClick}>
          <span>icon</span>
        </InputGroupAddon>
      </InputGroup>
    )

    expect(
      container.querySelector("[data-slot='input-group-addon-focus']")
    ).toBeNull()
    expect(addon().tabIndex).toBe(-1)
    expect(addon().className).not.toContain("pointer-events-none")
  })

  it("leaves buttons inside the addon as their own controls", async () => {
    let clicks = 0

    await render(
      <InputGroup>
        <InputGroupInput aria-label="Query" />
        <InputGroupAddon>
          <button type="button" onClick={() => clicks++}>
            Go
          </button>
        </InputGroupAddon>
      </InputGroup>
    )

    container.querySelector("button")?.click()
    expect(clicks).toBe(1)
    expect(container.querySelector("button")?.tabIndex).toBe(0)
    expect(addon().tabIndex).toBe(-1)
  })

  it("points the focus label at a plain input that is not InputGroupInput", async () => {
    await render(
      <InputGroup>
        <input aria-label="Command" />
        <InputGroupAddon>
          <span>search</span>
        </InputGroupAddon>
      </InputGroup>
    )

    const input = container.querySelector("input")
    expect(input?.id).toBeTruthy()
    expect(container.querySelector("label")?.htmlFor).toBe(input?.id)
  })
})
