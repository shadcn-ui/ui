// @vitest-environment jsdom

import * as React from "react"
import { act } from "react"
import { hydrateRoot, type Root } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ColorPicker } from "."

let container: HTMLDivElement
let root: Root | null

beforeEach(() => {
  ;(
    globalThis as typeof globalThis & {
      IS_REACT_ACT_ENVIRONMENT?: boolean
    }
  ).IS_REACT_ACT_ENVIRONMENT = true

  container = document.createElement("div")
  document.body.appendChild(container)
  root = null
})

afterEach(async () => {
  await act(async () => {
    root?.unmount()
  })
  container.remove()
  vi.restoreAllMocks()
})

describe("ColorPicker SSR", () => {
  it("renders the complete state on the server", () => {
    const html = renderToString(
      <Picker defaultValue="oklch(0.6 0.1 200 / 50%)" dir="rtl" name="accent" />
    )
    const document = new DOMParser().parseFromString(html, "text/html")
    const query = (selector: string) => document.querySelector(selector)

    expect(query('[role="group"]')?.getAttribute("dir")).toBe("rtl")
    expect(query('input[type="hidden"]')?.getAttribute("value")).toBe(
      "oklch(0.6 0.1 200 / 50%)"
    )
    expect(query('[data-testid="input"]')?.getAttribute("value")).toBe(
      "oklch(0.6 0.1 200 / 50%)"
    )
    expect(
      query('[data-testid="area-thumb"] input')?.getAttribute("aria-valuetext")
    ).toMatch(/^Saturation \d+%, Brightness \d+%$/)
    expect(
      query('[data-testid="alpha"] input')?.getAttribute("aria-valuetext")
    ).toBe("50%")
    expect(query('[data-testid="area"]')?.getAttribute("style")).toContain(
      "to left"
    )
    expect(query('[data-testid="swatch"]')?.hasAttribute("data-alpha")).toBe(
      true
    )
  })

  it("hydrates without mismatches and stays interactive", async () => {
    const consoleError = vi.spyOn(console, "error")
    const onValueChange = vi.fn()
    const element = (
      <Picker defaultValue="#804040" onValueChange={onValueChange} />
    )

    container.innerHTML = renderToString(element)

    await act(async () => {
      root = hydrateRoot(container, element)
    })

    expect(consoleError).not.toHaveBeenCalled()

    const xInput = container.querySelector<HTMLInputElement>(
      '[data-testid="area-thumb"] input'
    )

    await act(async () => {
      xInput?.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          cancelable: true,
          key: "ArrowRight",
        })
      )
    })

    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(xInput?.getAttribute("aria-valuetext")).toBe(
      "Saturation 51%, Brightness 50%"
    )
  })

  it("adds the eye dropper after hydration without a mismatch", async () => {
    const consoleError = vi.spyOn(console, "error")
    const element = (
      <ColorPicker.Root defaultValue="#3b82f6">
        <ColorPicker.EyeDropper data-testid="eye-dropper" />
      </ColorPicker.Root>
    )

    ;(window as Window & { EyeDropper?: unknown }).EyeDropper = class {
      open() {
        return Promise.resolve({ sRGBHex: "#000000" })
      }
    }

    try {
      const html = renderToString(element)

      expect(html).not.toContain("eye-dropper")

      container.innerHTML = html

      await act(async () => {
        root = hydrateRoot(container, element)
      })

      expect(consoleError).not.toHaveBeenCalled()
      expect(
        container.querySelector('[data-testid="eye-dropper"]')
      ).not.toBeNull()
    } finally {
      delete (window as Window & { EyeDropper?: unknown }).EyeDropper
    }
  })

  it("renders disabled and invalid state on the server", () => {
    const html = renderToString(
      <Picker aria-invalid defaultValue="#3b82f6" disabled />
    )

    expect(html).toContain('data-disabled=""')
    expect(html).toContain('data-invalid=""')
    expect(html).toContain('aria-invalid="true"')
    expect(html).not.toMatch(/role="group"[^>]*aria-invalid/)
  })
})

function Picker(props: React.ComponentProps<typeof ColorPicker.Root>) {
  return (
    <ColorPicker.Root {...props}>
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
    </ColorPicker.Root>
  )
}
