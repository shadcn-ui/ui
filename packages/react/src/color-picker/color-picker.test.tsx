// @vitest-environment jsdom

import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ColorPicker } from "."

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

describe("ColorPicker", () => {
  it("renders the value as given and exposes its parts", async () => {
    await render(<Picker defaultValue="oklch(0.985 0.001 106.423)" />)

    expect(rootElement().getAttribute("role")).toBe("group")
    expect(textInput().value).toBe("oklch(0.985 0.001 106.423)")
    expect(textInput().dir).toBe("ltr")
    expect(swatch().getAttribute("role")).toBe("img")
    expect(swatch().getAttribute("aria-label")).toBe(
      "oklch(0.985 0.001 106.423)"
    )
    expect(areaInput("x").getAttribute("aria-roledescription")).toBe(
      "2D slider"
    )
    expect(areaInput("x").getAttribute("aria-label")).toBe("Color")
    expect(areaInput("y").getAttribute("aria-orientation")).toBe("vertical")
    expect(areaInput("y").tabIndex).toBe(-1)
    expect(sliderInput("hue").getAttribute("aria-label")).toBe("Hue")
    expect(sliderInput("alpha").getAttribute("aria-label")).toBe("Alpha")
    expect(slider("hue").dataset.channel).toBe("hue")
  })

  it("emits in the format of the value unless format is set", async () => {
    const onValueChange = vi.fn()

    await render(
      <Picker defaultValue="oklch(0.6 0.1 200)" onValueChange={onValueChange} />
    )
    await keyDown(areaInput("x"), "ArrowUp")

    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.stringMatching(/^oklch\(/)
    )

    await render(<Picker key="hex" defaultValue="#ff0000" format="oklch" />)

    expect(textInput().value).toBe("oklch(0.628 0.258 29.234)")
  })

  describe("area", () => {
    it("steps saturation and brightness with the keyboard", async () => {
      const onValueChange = vi.fn()

      // hsv(0, 50%, 50%)
      await render(
        <Picker defaultValue="#804040" onValueChange={onValueChange} />
      )

      expect(areaText()).toBe("Saturation 50%, Brightness 50%")

      await keyDown(areaInput("x"), "ArrowRight")
      expect(areaText()).toBe("Saturation 51%, Brightness 50%")

      await keyDown(areaInput("x"), "ArrowRight", { shiftKey: true })
      expect(areaText()).toBe("Saturation 61%, Brightness 50%")

      await keyDown(areaInput("x"), "Home")
      expect(areaText()).toBe("Saturation 51%, Brightness 50%")

      await keyDown(areaInput("x"), "ArrowUp")
      expect(areaText()).toBe("Saturation 51%, Brightness 51%")
      expect(document.activeElement).toBe(areaInput("y"))

      await keyDown(areaInput("y"), "PageDown")
      expect(areaText()).toBe("Saturation 51%, Brightness 41%")

      await keyDown(areaInput("y"), "ArrowLeft")
      expect(areaText()).toBe("Saturation 50%, Brightness 41%")
      expect(document.activeElement).toBe(areaInput("x"))

      expect(onValueChange).toHaveBeenCalledTimes(6)
      expect(onValueChange).toHaveBeenLastCalledWith(textInput().value)
    })

    it("mirrors the x axis in RTL", async () => {
      await render(<Picker defaultValue="#804040" dir="rtl" />)

      await keyDown(areaInput("x"), "ArrowRight")
      expect(areaText()).toBe("Saturation 49%, Brightness 50%")

      await keyDown(areaInput("x"), "End")
      expect(areaText()).toBe("Saturation 39%, Brightness 50%")

      expect(area().style.backgroundImage).toContain("to left")
      expect(areaThumb().style.left).toBe("61%")
    })

    it("clamps at the edges without emitting", async () => {
      const onValueChange = vi.fn()

      await render(
        <Picker defaultValue="#ffffff" onValueChange={onValueChange} />
      )
      await keyDown(areaInput("x"), "ArrowLeft")
      await keyDown(areaInput("x"), "ArrowUp")

      expect(onValueChange).not.toHaveBeenCalled()
    })

    it("accepts assistive technology changes on the hidden inputs", async () => {
      await render(<Picker defaultValue="#804040" />)
      await setRangeValue(areaInput("x"), 75)

      expect(areaText()).toBe("Saturation 75%, Brightness 50%")
    })

    it("maps a pointer press to saturation and brightness", async () => {
      await render(<Picker defaultValue="#804040" />)
      stubRect(area(), { height: 100, width: 200 })

      await dispatch(area(), pointerEvent("pointerdown", { x: 50, y: 25 }))

      expect(areaText()).toBe("Saturation 25%, Brightness 75%")
      expect(area().hasAttribute("data-dragging")).toBe(true)
      expect(document.activeElement).toBe(areaInput("x"))

      await dispatch(area(), pointerEvent("pointermove", { x: 400, y: 200 }))
      expect(areaText()).toBe("Saturation 100%, Brightness 0%")

      await dispatch(area(), pointerEvent("pointerup", { x: 400, y: 200 }))
      expect(area().hasAttribute("data-dragging")).toBe(false)

      await dispatch(area(), pointerEvent("pointermove", { x: 0, y: 0 }))
      expect(areaText()).toBe("Saturation 100%, Brightness 0%")
    })

    it("maps a pointer press from the right in RTL", async () => {
      await render(<Picker defaultValue="#804040" dir="rtl" />)
      stubRect(area(), { height: 100, width: 200 })

      await dispatch(area(), pointerEvent("pointerdown", { x: 50, y: 25 }))

      expect(areaText()).toBe("Saturation 75%, Brightness 75%")
    })
  })

  describe("slider", () => {
    it("steps hue and jumps to the ends", async () => {
      const onValueChange = vi.fn()

      await render(
        <Picker defaultValue="#ff0000" onValueChange={onValueChange} />
      )

      await keyDown(sliderInput("hue"), "ArrowRight")
      expect(sliderInput("hue").getAttribute("aria-valuetext")).toBe("1°")
      expect(onValueChange).toHaveBeenLastCalledWith("#ff0400")

      await keyDown(sliderInput("hue"), "End")
      expect(sliderInput("hue").getAttribute("aria-valuetext")).toBe("360°")
      expect(onValueChange).toHaveBeenLastCalledWith("#ff0000")

      await keyDown(sliderInput("hue"), "PageDown")
      expect(sliderInput("hue").getAttribute("aria-valuetext")).toBe("350°")

      await keyDown(sliderInput("hue"), "Home")
      expect(sliderInput("hue").getAttribute("aria-valuetext")).toBe("0°")
    })

    it("mirrors horizontal keys in RTL", async () => {
      // hsv(180, 100%, 100%)
      await render(<Picker defaultValue="#00ffff" dir="rtl" />)

      await keyDown(sliderInput("hue"), "ArrowRight")
      expect(sliderInput("hue").getAttribute("aria-valuetext")).toBe("179°")

      await keyDown(sliderInput("hue"), "ArrowUp")
      expect(sliderInput("hue").getAttribute("aria-valuetext")).toBe("180°")

      expect(slider("hue").style.backgroundImage).toContain("to left")
    })

    it("changes alpha and emits it in the value", async () => {
      const onValueChange = vi.fn()

      await render(
        <Picker defaultValue="#ff0000" onValueChange={onValueChange} />
      )

      expect(swatch().hasAttribute("data-alpha")).toBe(false)

      await keyDown(sliderInput("alpha"), "ArrowLeft")

      expect(sliderInput("alpha").getAttribute("aria-valuetext")).toBe("99%")
      expect(onValueChange).toHaveBeenLastCalledWith("#ff0000fc")
      expect(swatch().hasAttribute("data-alpha")).toBe(true)
    })

    it("maps a pointer press along the track", async () => {
      await render(<Picker defaultValue="#ff0000" />)
      stubRect(slider("hue"), { height: 12, width: 360 })

      await dispatch(
        slider("hue"),
        pointerEvent("pointerdown", { x: 90, y: 6 })
      )

      expect(sliderInput("hue").getAttribute("aria-valuetext")).toBe("90°")
      expect(document.activeElement).toBe(sliderInput("hue"))
    })
  })

  describe("input", () => {
    it("commits valid text on Enter in the picker's format", async () => {
      const onValueChange = vi.fn()

      await render(
        <Picker
          defaultValue="#ff0000"
          format="oklch"
          onValueChange={onValueChange}
        />
      )
      await typeText(textInput(), "#ffffff")

      expect(onValueChange).not.toHaveBeenCalled()

      await keyDown(textInput(), "Enter")

      expect(onValueChange).toHaveBeenLastCalledWith("oklch(1 0 0)")
      expect(textInput().value).toBe("oklch(1 0 0)")
    })

    it("reverts text that does not parse", async () => {
      const onValueChange = vi.fn()

      await render(
        <Picker defaultValue="#3b82f6" onValueChange={onValueChange} />
      )
      await typeText(textInput(), "not a color")
      await act(async () => {
        textInput().focus()
        textInput().blur()
      })

      expect(textInput().value).toBe("#3b82f6")
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it("discards the draft on Escape", async () => {
      await render(<Picker defaultValue="#3b82f6" />)
      await typeText(textInput(), "#000")
      await keyDown(textInput(), "Escape")

      expect(textInput().value).toBe("#3b82f6")
    })

    it("lets Enter submit the form when there is no draft", async () => {
      await render(<Picker defaultValue="#3b82f6" />)

      const event = await keyDown(textInput(), "Enter")

      expect(event.defaultPrevented).toBe(false)
    })
  })

  describe("controlled", () => {
    it("snaps back when the parent rejects a change", async () => {
      const onValueChange = vi.fn()

      await render(<Picker value="#804040" onValueChange={onValueChange} />)
      await keyDown(areaInput("x"), "ArrowRight")

      expect(onValueChange).toHaveBeenCalledTimes(1)
      expect(areaText()).toBe("Saturation 50%, Brightness 50%")
      expect(textInput().value).toBe("#804040")
    })

    it("keeps the hue when the value turns black or gray", async () => {
      await render(<ControlledPicker initialValue="#0080ff" />)

      expect(sliderInput("hue").getAttribute("aria-valuetext")).toBe("210°")

      await click(button("black"))
      expect(textInput().value).toBe("#000000")
      expect(sliderInput("hue").getAttribute("aria-valuetext")).toBe("210°")
      expect(areaText()).toBe("Saturation 100%, Brightness 0%")

      await click(button("gray"))
      expect(sliderInput("hue").getAttribute("aria-valuetext")).toBe("210°")
      expect(areaText()).toBe("Saturation 0%, Brightness 50%")
    })

    it("follows the parent's value", async () => {
      await render(<ControlledPicker initialValue="#0080ff" />)
      // Hue 0 at full saturation and brightness is red.
      await keyDown(sliderInput("hue"), "Home")

      expect(textInput().value).toBe("#ff0000")
      expect(swatch().getAttribute("aria-label")).toBe("#ff0000")
    })
  })

  describe("field integration", () => {
    it("passes aria-invalid to the controls, not the group", async () => {
      await render(<Picker aria-invalid defaultValue="#3b82f6" />)

      expect(rootElement().hasAttribute("data-invalid")).toBe(true)
      expect(rootElement().hasAttribute("aria-invalid")).toBe(false)
      expect(textInput().getAttribute("aria-invalid")).toBe("true")
      expect(areaInput("x").getAttribute("aria-invalid")).toBe("true")
      expect(sliderInput("hue").getAttribute("aria-invalid")).toBe("true")
    })

    it("disables every part", async () => {
      const onValueChange = vi.fn()

      await render(
        <Picker
          defaultValue="#804040"
          disabled
          name="color"
          onValueChange={onValueChange}
        />
      )
      stubRect(area(), { height: 100, width: 200 })

      expect(rootElement().hasAttribute("data-disabled")).toBe(true)
      expect(rootElement().getAttribute("aria-disabled")).toBe("true")
      expect(area().hasAttribute("data-disabled")).toBe(true)
      expect(textInput().disabled).toBe(true)
      expect(areaInput("x").disabled).toBe(true)
      expect(sliderInput("alpha").disabled).toBe(true)
      expect(hiddenInput().disabled).toBe(true)

      await keyDown(areaInput("x"), "ArrowRight")
      await dispatch(area(), pointerEvent("pointerdown", { x: 10, y: 10 }))

      expect(onValueChange).not.toHaveBeenCalled()
      expect(areaText()).toBe("Saturation 50%, Brightness 50%")
    })

    it("submits the value with a form", async () => {
      await render(
        <form data-testid="form">
          <Picker defaultValue="oklch(0.6 0.1 200)" name="accent" />
        </form>
      )

      expect(new FormData(form()).get("accent")).toBe("oklch(0.6 0.1 200)")

      await keyDown(sliderInput("alpha"), "Home")

      expect(new FormData(form()).get("accent")).toMatch(/ \/ 0%\)$/)
    })

    it("uses a label from aria-labelledby", async () => {
      await render(
        <ColorPicker.Root defaultValue="#3b82f6">
          <span id="area-label">Brand</span>
          <ColorPicker.Area aria-labelledby="area-label" data-testid="area">
            <ColorPicker.AreaThumb data-testid="area-thumb" />
          </ColorPicker.Area>
        </ColorPicker.Root>
      )

      expect(areaInput("x").getAttribute("aria-labelledby")).toBe("area-label")
      expect(areaInput("x").hasAttribute("aria-label")).toBe(false)
    })
  })

  describe("copy", () => {
    afterEach(() => {
      vi.useRealTimers()
      Reflect.deleteProperty(navigator, "clipboard")
    })

    it("copies the value in the picker's format and announces it", async () => {
      const writeText = mockClipboard(() => Promise.resolve())

      await render(<Picker defaultValue="#ffffff" format="oklch" />)

      expect(copyButton().getAttribute("aria-label")).toBe("Copy color")

      await click(copyButton())

      expect(writeText).toHaveBeenCalledWith("oklch(1 0 0)")
      expect(copyButton().hasAttribute("data-copied")).toBe(true)
      expect(copyButton().getAttribute("aria-label")).toBe("Copied")
      expect(copyButton().querySelector("[aria-live]")?.textContent).toBe(
        "Copied"
      )
    })

    it("resets after two seconds", async () => {
      mockClipboard(() => Promise.resolve())
      vi.useFakeTimers()

      await render(<Picker defaultValue="#3b82f6" />)
      await click(copyButton())

      expect(copyButton().hasAttribute("data-copied")).toBe(true)

      await act(async () => {
        vi.advanceTimersByTime(2000)
      })

      expect(copyButton().hasAttribute("data-copied")).toBe(false)
      expect(copyButton().querySelector("[aria-live]")?.textContent).toBe("")
    })

    it("stays quiet when the clipboard write fails", async () => {
      mockClipboard(() => Promise.reject(new Error("Denied")))

      await render(<Picker defaultValue="#3b82f6" />)
      await click(copyButton())

      expect(copyButton().hasAttribute("data-copied")).toBe(false)
    })

    it("is disabled with the picker", async () => {
      await render(<Picker defaultValue="#3b82f6" disabled />)

      expect(copyButton().disabled).toBe(true)
    })
  })

  describe("eye dropper", () => {
    afterEach(() => {
      delete (window as Window & { EyeDropper?: unknown }).EyeDropper
    })

    it("renders nothing where the EyeDropper API is missing", async () => {
      await render(<Picker defaultValue="#3b82f6" />)

      expect(container.querySelector('[data-testid="eye-dropper"]')).toBeNull()
    })

    it("picks a color and keeps the current alpha", async () => {
      const open = mockEyeDropper(() => Promise.resolve({ sRGBHex: "#ff0000" }))
      const onValueChange = vi.fn()

      await render(
        <Picker defaultValue="#3b82f680" onValueChange={onValueChange} />
      )

      expect(eyeDropper().getAttribute("aria-label")).toBe(
        "Pick a color from the screen"
      )
      expect(eyeDropper().type).toBe("button")

      await click(eyeDropper())

      expect(open).toHaveBeenCalledTimes(1)
      expect(open.mock.calls[0]?.[0]?.signal).toBeInstanceOf(AbortSignal)
      expect(onValueChange).toHaveBeenLastCalledWith("#ff000080")
      expect(eyeDropper().hasAttribute("data-picking")).toBe(false)
    })

    it("leaves the color alone when the pick is cancelled", async () => {
      mockEyeDropper(() =>
        Promise.reject(new DOMException("Cancelled", "AbortError"))
      )
      const onValueChange = vi.fn()

      await render(
        <Picker defaultValue="#3b82f6" onValueChange={onValueChange} />
      )
      await click(eyeDropper())

      expect(onValueChange).not.toHaveBeenCalled()
      expect(textInput().value).toBe("#3b82f6")
    })

    it("ignores a second click while picking", async () => {
      let resolve: (value: { sRGBHex: string }) => void = () => {}
      const open = mockEyeDropper(() => new Promise((next) => (resolve = next)))

      await render(<Picker defaultValue="#3b82f6" />)
      await click(eyeDropper())

      expect(eyeDropper().hasAttribute("data-picking")).toBe(true)

      await click(eyeDropper())
      expect(open).toHaveBeenCalledTimes(1)

      await act(async () => resolve({ sRGBHex: "#00ff00" }))
      expect(textInput().value).toBe("#00ff00")
    })

    it("is disabled with the picker", async () => {
      const open = mockEyeDropper(() => Promise.resolve({ sRGBHex: "#ff0000" }))

      await render(<Picker defaultValue="#3b82f6" disabled />)

      expect(eyeDropper().disabled).toBe(true)
      expect(eyeDropper().hasAttribute("data-disabled")).toBe(true)

      await click(eyeDropper())
      expect(open).not.toHaveBeenCalled()
    })
  })

  it("renders through the render prop", async () => {
    await render(
      <ColorPicker.Root defaultValue="#3b82f6" render={<section />}>
        <ColorPicker.Swatch render={<span data-testid="swatch" />} />
      </ColorPicker.Root>
    )

    expect(container.querySelector("section")?.getAttribute("role")).toBe(
      "group"
    )
    expect(swatch().tagName).toBe("SPAN")
  })

  it("requires a Root", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})

    await expect(render(<ColorPicker.Swatch />)).rejects.toThrow(
      "ColorPicker.Swatch must be used within a ColorPicker.Root component."
    )
  })
})

function Picker(props: React.ComponentProps<typeof ColorPicker.Root>) {
  return (
    <ColorPicker.Root data-testid="root" {...props}>
      <ColorPicker.Area data-testid="area">
        <ColorPicker.AreaThumb data-testid="area-thumb" />
      </ColorPicker.Area>
      <ColorPicker.Slider channel="hue" data-testid="hue">
        <ColorPicker.SliderThumb />
      </ColorPicker.Slider>
      <ColorPicker.Slider channel="alpha" data-testid="alpha">
        <ColorPicker.SliderThumb />
      </ColorPicker.Slider>
      <ColorPicker.Swatch data-testid="swatch" />
      <ColorPicker.Input data-testid="input" />
      <ColorPicker.EyeDropper data-testid="eye-dropper" />
      <ColorPicker.Copy data-testid="copy" />
    </ColorPicker.Root>
  )
}

function mockClipboard(implementation: (text: string) => Promise<void>) {
  const writeText = vi.fn(implementation)

  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  })

  return writeText
}

type EyeDropperOpen = (options?: {
  signal?: AbortSignal
}) => Promise<{ sRGBHex: string }>

function mockEyeDropper(implementation: EyeDropperOpen) {
  const open = vi.fn(implementation)

  ;(window as Window & { EyeDropper?: unknown }).EyeDropper = class {
    open = open
  }

  return open
}

function ControlledPicker({ initialValue }: { initialValue: string }) {
  const [value, setValue] = React.useState(initialValue)

  return (
    <>
      <button data-testid="black" onClick={() => setValue("#000000")} />
      <button data-testid="gray" onClick={() => setValue("#808080")} />
      <Picker value={value} onValueChange={setValue} />
    </>
  )
}

async function render(element: React.ReactElement) {
  await act(async () => {
    root.render(element)
  })
}

async function dispatch(target: EventTarget, event: Event) {
  await act(async () => {
    target.dispatchEvent(event)
  })

  return event
}

function keyDown(
  target: HTMLElement,
  key: string,
  init: KeyboardEventInit = {}
) {
  return dispatch(
    target,
    new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key,
      ...init,
    })
  )
}

async function click(target: HTMLElement) {
  await act(async () => {
    target.click()
  })
}

// React tracks input values, so set them through the native setter.
function setNativeValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  )?.set

  setter?.call(input, value)
}

async function typeText(input: HTMLInputElement, value: string) {
  await act(async () => {
    setNativeValue(input, value)
    input.dispatchEvent(new Event("input", { bubbles: true }))
  })
}

async function setRangeValue(input: HTMLInputElement, value: number) {
  await act(async () => {
    setNativeValue(input, String(value))
    input.dispatchEvent(new Event("input", { bubbles: true }))
  })
}

function pointerEvent(type: string, { x, y }: { x: number; y: number }) {
  const EventConstructor =
    typeof PointerEvent === "function" ? PointerEvent : MouseEvent

  return new EventConstructor(type, {
    bubbles: true,
    button: 0,
    cancelable: true,
    clientX: x,
    clientY: y,
  })
}

// jsdom has no layout, so give the element a fixed box at the origin.
function stubRect(
  element: HTMLElement,
  { height, width }: { height: number; width: number }
) {
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    bottom: height,
    height,
    left: 0,
    right: width,
    toJSON: () => ({}),
    top: 0,
    width,
    x: 0,
    y: 0,
  })
}

function query<T extends Element>(selector: string) {
  const element = container.querySelector<T>(selector)

  if (!element) {
    throw new Error(`Missing ${selector}`)
  }

  return element
}

function rootElement() {
  return query<HTMLDivElement>('[data-testid="root"]')
}

function area() {
  return query<HTMLDivElement>('[data-testid="area"]')
}

function areaThumb() {
  return query<HTMLDivElement>('[data-testid="area-thumb"]')
}

function areaInput(axis: "x" | "y") {
  return query<HTMLInputElement>(
    `[data-testid="area-thumb"] input:nth-of-type(${axis === "x" ? 1 : 2})`
  )
}

function areaText() {
  return areaInput("x").getAttribute("aria-valuetext")
}

function slider(channel: "hue" | "alpha") {
  return query<HTMLDivElement>(`[data-testid="${channel}"]`)
}

function sliderInput(channel: "hue" | "alpha") {
  return query<HTMLInputElement>(`[data-testid="${channel}"] input`)
}

function swatch() {
  return query<HTMLElement>('[data-testid="swatch"]')
}

function textInput() {
  return query<HTMLInputElement>('[data-testid="input"]')
}

function hiddenInput() {
  return query<HTMLInputElement>('input[type="hidden"]')
}

function copyButton() {
  return query<HTMLButtonElement>('[data-testid="copy"]')
}

function eyeDropper() {
  return query<HTMLButtonElement>('[data-testid="eye-dropper"]')
}

function form() {
  return query<HTMLFormElement>('[data-testid="form"]')
}

function button(testId: string) {
  return query<HTMLButtonElement>(`[data-testid="${testId}"]`)
}
