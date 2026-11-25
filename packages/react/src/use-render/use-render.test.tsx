// @vitest-environment jsdom

import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  composeRefs,
  mergeProps,
  useRender,
  type UseRenderComponentProps,
} from "."

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  ;(
    globalThis as typeof globalThis & {
      IS_REACT_ACT_ENVIRONMENT?: boolean
    }
  ).IS_REACT_ACT_ENVIRONMENT = true

  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(async () => {
  await act(async () => {
    root.unmount()
  })
  container.remove()
  vi.restoreAllMocks()
})

describe("mergeProps", () => {
  it("lets later sources override earlier props", () => {
    expect(
      mergeProps<"div">({ id: "first", title: "Title" }, { id: "second" })
    ).toEqual({ id: "second", title: "Title" })
  })

  it("ignores undefined sources and undefined values", () => {
    expect(
      mergeProps<"div">(
        undefined,
        { id: "first", title: "Title" },
        { id: undefined },
        undefined
      )
    ).toEqual({ id: "first", title: "Title" })
  })

  it("joins class names in source order and drops empty ones", () => {
    expect(
      mergeProps<"div">(
        { className: "first" },
        { className: "" },
        { className: "second" }
      ).className
    ).toBe("first second")
  })

  it("merges styles, with later keys winning", () => {
    expect(
      mergeProps<"div">(
        { style: { color: "red", margin: 0 } },
        { style: { color: "blue" } }
      ).style
    ).toEqual({ color: "blue", margin: 0 })
  })

  it("runs the later event handler first, then the earlier one", () => {
    const calls: string[] = []
    const merged = mergeProps<"button">(
      { onClick: () => calls.push("first") },
      { onClick: () => calls.push("second") }
    )

    merged.onClick?.(createEvent())

    expect(calls).toEqual(["second", "first"])
  })

  it("skips the earlier handler when the later one prevents default", () => {
    const first = vi.fn()
    const merged = mergeProps<"button">(
      { onClick: first },
      { onClick: (event) => event.preventDefault() }
    )
    const event = createEvent()

    merged.onClick?.(event)

    expect(event.defaultPrevented).toBe(true)
    expect(first).not.toHaveBeenCalled()
  })

  it("keeps a single event handler as is", () => {
    const onClick = vi.fn()

    expect(
      mergeProps<"button">({ onClick }, { onClick: undefined }).onClick
    ).toBe(onClick)
  })

  it("replaces function props that are not event handlers", () => {
    const first = vi.fn()
    const second = vi.fn()
    const merged = mergeProps<"div">({ getLabel: first }, { getLabel: second })

    expect((merged as Record<string, unknown>).getLabel).toBe(second)
  })

  it("composes refs from every source", () => {
    const objectRef = React.createRef<HTMLDivElement>()
    const callbackRef = vi.fn()
    const node = document.createElement("div")
    const merged = mergeProps<"div">({ ref: objectRef }, { ref: callbackRef })

    expect(typeof merged.ref).toBe("function")
    ;(merged.ref as React.RefCallback<HTMLDivElement>)(node)

    expect(objectRef.current).toBe(node)
    expect(callbackRef).toHaveBeenCalledWith(node)
  })
})

describe("composeRefs", () => {
  it("returns undefined when there are no refs", () => {
    expect(composeRefs()).toBeUndefined()
    expect(composeRefs(undefined, null)).toBeUndefined()
  })

  it("sets object refs and calls callback refs in order", () => {
    const calls: string[] = []
    const objectRef = React.createRef<string>()
    const composed = composeRefs<string>(
      (value) => {
        calls.push(`first:${value}`)
      },
      objectRef,
      undefined,
      (value) => {
        calls.push(`second:${value}`)
      }
    )

    composed?.("node")

    expect(objectRef.current).toBe("node")
    expect(calls).toEqual(["first:node", "second:node"])
  })
})

describe("useRender", () => {
  it("renders the default tag with merged props and ref", async () => {
    const ref = React.createRef<HTMLButtonElement>()

    await render(
      <Part className="custom" data-testid="part" ref={ref}>
        Save
      </Part>
    )

    const element = part()
    expect(element.tagName).toBe("BUTTON")
    expect(element.className).toBe("part custom")
    expect(element.getAttribute("type")).toBe("button")
    expect(element.textContent).toBe("Save")
    expect(ref.current).toBe(element)
  })

  it("maps state to data attributes", async () => {
    await render(
      <Part
        data-testid="part"
        state={{
          disabled: true,
          label: null,
          open: false,
          orientation: "horizontal",
          slot: "part-trigger",
          stepIndex: 2,
        }}
      />
    )

    const element = part()
    expect(element.getAttribute("data-disabled")).toBe("")
    expect(element.hasAttribute("data-open")).toBe(false)
    expect(element.hasAttribute("data-label")).toBe(false)
    expect(element.getAttribute("data-orientation")).toBe("horizontal")
    expect(element.getAttribute("data-slot")).toBe("part-trigger")
    expect(element.getAttribute("data-step-index")).toBe("2")
  })

  it("uses stateAttributesMapping instead of the default attribute", async () => {
    await render(
      <Part
        data-testid="part"
        state={{ checked: false, open: true }}
        stateAttributesMapping={{
          checked: (checked) => ({
            "data-checked": checked ? "" : undefined,
            "data-unchecked": checked ? undefined : "",
          }),
        }}
      />
    )

    const element = part()
    expect(element.hasAttribute("data-checked")).toBe(false)
    expect(element.getAttribute("data-unchecked")).toBe("")
    expect(element.getAttribute("data-open")).toBe("")
  })

  it("lets props override state attributes", async () => {
    await render(
      <Part
        data-orientation="vertical"
        data-testid="part"
        state={{ orientation: "horizontal" }}
      />
    )

    expect(part().getAttribute("data-orientation")).toBe("vertical")
  })

  it("renders the render element with the merged props", async () => {
    await render(
      <Part
        className="custom"
        data-testid="part"
        render={<a className="link" href="/docs" />}
        state={{ open: true }}
      >
        Docs
      </Part>
    )

    const element = part()
    expect(element.tagName).toBe("A")
    expect(element.getAttribute("href")).toBe("/docs")
    expect(element.className).toBe("part custom link")
    expect(element.getAttribute("data-open")).toBe("")
    expect(element.textContent).toBe("Docs")
  })

  it("passes the node to the part ref and the render element ref", async () => {
    const partRef = React.createRef<HTMLButtonElement>()
    const renderRef = vi.fn()

    await render(
      <Part
        data-testid="part"
        ref={partRef}
        render={<button ref={renderRef} />}
      />
    )

    const element = part()
    expect(partRef.current).toBe(element)
    expect(renderRef).toHaveBeenCalledWith(element)
  })

  it("runs the render element's click handler before the part's", async () => {
    const calls: string[] = []

    await render(
      <Part
        data-testid="part"
        onPartClick={() => calls.push("part")}
        render={<button onClick={() => calls.push("render")} />}
      />
    )

    await click(part())

    expect(calls).toEqual(["render", "part"])
  })

  it("skips the part's click handler when the render element prevents default", async () => {
    const onPartClick = vi.fn()

    await render(
      <Part
        data-testid="part"
        onPartClick={onPartClick}
        render={<button onClick={(event) => event.preventDefault()} />}
      />
    )

    await click(part())

    expect(onPartClick).not.toHaveBeenCalled()
  })

  it("calls a render function with the merged props and the state", async () => {
    const renderFunction = vi.fn(
      (props: Record<string, unknown>, state: PartState) => (
        <span
          {...(props as React.ComponentProps<"span">)}
          data-rendered={state.open ? "open" : "closed"}
        />
      )
    )

    await render(
      <Part
        className="custom"
        data-testid="part"
        render={renderFunction}
        state={{ open: true }}
      >
        Label
      </Part>
    )

    const element = part()
    expect(element.tagName).toBe("SPAN")
    expect(element.className).toBe("part custom")
    expect(element.getAttribute("data-open")).toBe("")
    expect(element.getAttribute("data-rendered")).toBe("open")
    expect(element.textContent).toBe("Label")
    expect(renderFunction).toHaveBeenLastCalledWith(
      expect.objectContaining({ className: "part custom", type: "button" }),
      { open: true }
    )
  })
})

type PartState = Record<string, unknown>

type PartProps = UseRenderComponentProps<"button", PartState> & {
  onPartClick?: () => void
  state?: PartState
  stateAttributesMapping?: {
    [key: string]: (value: unknown) => Record<string, string | undefined>
  }
}

function Part({
  onPartClick,
  render,
  state,
  stateAttributesMapping,
  ...props
}: PartProps) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      { className: "part", onClick: onPartClick, type: "button" },
      props
    ),
    render,
    state,
    stateAttributesMapping,
  })
}

function createEvent() {
  const event = {
    defaultPrevented: false,
    preventDefault() {
      event.defaultPrevented = true
    },
  }

  return event as unknown as React.MouseEvent<HTMLButtonElement>
}

async function render(element: React.ReactNode) {
  await act(async () => {
    root.render(element)
  })
}

async function click(element: HTMLElement) {
  await act(async () => {
    element.click()
  })
}

function part() {
  const element = container.querySelector<HTMLElement>('[data-testid="part"]')

  if (!element) {
    throw new Error("Part was not rendered.")
  }

  return element
}
