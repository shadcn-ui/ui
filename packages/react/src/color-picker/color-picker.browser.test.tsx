import * as React from "react"
import { userEvent } from "@vitest/browser/context"
import { flushSync } from "react-dom"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test, vi } from "vitest"

import { ColorPicker } from "."

;(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = false

let root: Root | null = null
let container: HTMLDivElement | null = null

afterEach(() => {
  root?.unmount()
  container?.remove()
  root = null
  container = null
  vi.restoreAllMocks()
})

test("maps a click on the area using real layout", async () => {
  await render(<Picker defaultValue="#804040" />)

  await userEvent.click(area(), { position: { x: 50, y: 25 } })
  await settle()

  expect(areaText()).toBe("Saturation 25%, Brightness 75%")
  expect(document.activeElement).toBe(areaInput("x"))
})

test("keeps dragging outside the area through pointer capture", async () => {
  const onValueChange = vi.fn()

  await render(
    <>
      <Picker defaultValue="#804040" onValueChange={onValueChange} />
      <div data-testid="outside" style={{ height: 300, width: 500 }} />
    </>
  )

  await userEvent.dragAndDrop(areaThumb(), outside(), {
    targetPosition: { x: 450, y: 250 },
  })
  await settle()

  expect(areaText()).toBe("Saturation 100%, Brightness 0%")
  expect(area().hasAttribute("data-dragging")).toBe(false)
  expect(onValueChange).toHaveBeenLastCalledWith("#000000")
})

test("reads RTL from the page when no dir is passed", async () => {
  await render(
    <div dir="rtl">
      <Picker defaultValue="#804040" />
    </div>
  )

  expect(area().style.backgroundImage).toContain("to left")

  await userEvent.click(area(), { position: { x: 50, y: 25 } })
  await settle()

  expect(areaText()).toBe("Saturation 75%, Brightness 75%")
})

test("moves focus between the area inputs and keeps one tab stop", async () => {
  await render(<Picker defaultValue="#804040" />)

  areaInput("x").focus()
  await userEvent.keyboard("{ArrowUp}")
  await settle()

  // One step, so the native range input did not also handle the key.
  expect(areaText()).toBe("Saturation 50%, Brightness 51%")
  expect(document.activeElement).toBe(areaInput("y"))

  await userEvent.keyboard("{ArrowRight}")
  await settle()

  expect(areaText()).toBe("Saturation 51%, Brightness 51%")
  expect(document.activeElement).toBe(areaInput("x"))

  await userEvent.tab()

  expect(document.activeElement).toBe(sliderInput())
})

test("maps a click on the hue track", async () => {
  await render(<Picker defaultValue="#ff0000" />)

  await userEvent.click(slider(), { position: { x: 90, y: 6 } })
  await settle()

  expect(sliderInput().getAttribute("aria-valuetext")).toBe("90°")
  expect(document.activeElement).toBe(sliderInput())
})

test("commits typed text on Enter", async () => {
  const onValueChange = vi.fn()

  await render(<Picker defaultValue="#ff0000" onValueChange={onValueChange} />)

  await userEvent.fill(textInput(), "#00ff00")
  await userEvent.keyboard("{Enter}")
  await settle()

  expect(onValueChange).toHaveBeenLastCalledWith("#00ff00")
  expect(sliderInput().getAttribute("aria-valuetext")).toBe("120°")
})

const THUMB_STYLE = { height: 12, width: 12 }

function Picker(props: React.ComponentProps<typeof ColorPicker.Root>) {
  return (
    <ColorPicker.Root {...props}>
      <ColorPicker.Area data-testid="area" style={{ height: 100, width: 200 }}>
        <ColorPicker.AreaThumb data-testid="area-thumb" style={THUMB_STYLE} />
      </ColorPicker.Area>
      <ColorPicker.Slider
        channel="hue"
        data-testid="hue"
        style={{ height: 12, width: 360 }}
      >
        <ColorPicker.SliderThumb style={THUMB_STYLE} />
      </ColorPicker.Slider>
      <ColorPicker.Input data-testid="input" />
    </ColorPicker.Root>
  )
}

async function render(children: React.ReactNode) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)

  flushSync(() => {
    root?.render(children)
  })

  await settle()
}

function settle(frames = 2) {
  return new Promise<void>((resolve) => {
    let remaining = frames

    function nextFrame() {
      if (remaining-- <= 0) {
        resolve()
        return
      }

      requestAnimationFrame(nextFrame)
    }

    nextFrame()
  })
}

function requiredElement<T extends Element = HTMLElement>(selector: string) {
  const element = container?.querySelector<T>(selector)

  if (!element) {
    throw new Error(`Missing test element: ${selector}`)
  }

  return element
}

function area() {
  return requiredElement<HTMLDivElement>('[data-testid="area"]')
}

function areaThumb() {
  return requiredElement<HTMLDivElement>('[data-testid="area-thumb"]')
}

function areaInput(axis: "x" | "y") {
  return requiredElement<HTMLInputElement>(
    `[data-testid="area-thumb"] input:nth-of-type(${axis === "x" ? 1 : 2})`
  )
}

function areaText() {
  return areaInput("x").getAttribute("aria-valuetext")
}

function slider() {
  return requiredElement<HTMLDivElement>('[data-testid="hue"]')
}

function sliderInput() {
  return requiredElement<HTMLInputElement>('[data-testid="hue"] input')
}

function textInput() {
  return requiredElement<HTMLInputElement>('[data-testid="input"]')
}

function outside() {
  return requiredElement<HTMLDivElement>('[data-testid="outside"]')
}
