import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./Select"

/**
 * Notes on Select testing under jsdom:
 *
 * Like Tooltip, Radix's Select.Content uses Floating UI + portals +
 * ResizeObserver / IntersectionObserver. jsdom only stubs these APIs
 * via vitest.setup.ts, so resolved positioning is meaningless and
 * popper-position assertions would be brittle. We test:
 *
 *   - Trigger surface (size, invalid, disabled, placeholder, aria).
 *   - Uncontrolled state via defaultValue (rendered SelectValue text).
 *   - Controlled value rendering when wrapped in a stateful parent.
 *   - Structural rendering of SelectLabel, SelectGroup, SelectSeparator
 *     when the listbox is open via Radix open prop.
 *   - SelectItem ref forwarding and className passthrough.
 *
 * We do NOT test:
 *   - Item selection via click — Radix Select intercepts clicks via
 *     pointerdown/pointerup which jsdom does not faithfully simulate
 *     for the popper-anchored listbox.
 *   - Keyboard navigation between items (same reason).
 *   - Resolved popper coordinates / sideOffset.
 *   Visual coverage lives in Storybook (Components/Select).
 */

function basicSelect(props: {
  defaultValue?: string
  value?: string
  onValueChange?: (v: string) => void
  open?: boolean
  disabled?: boolean
  invalid?: boolean
  size?: "sm" | "md" | "lg"
} = {}) {
  return (
    <Select
      defaultValue={props.defaultValue}
      value={props.value}
      onValueChange={props.onValueChange}
      open={props.open}
      disabled={props.disabled}
    >
      <SelectTrigger
        aria-label="plan"
        size={props.size}
        invalid={props.invalid}
      >
        <SelectValue placeholder="Pick a plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">Free</SelectItem>
        <SelectItem value="pro">Pro</SelectItem>
        <SelectItem value="enterprise" disabled>
          Enterprise
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

describe("Select", () => {
  it("renders the trigger with default size + non-invalid + placeholder", () => {
    render(basicSelect())
    const trigger = screen.getByRole("combobox", { name: "plan" })
    expect(trigger).toHaveAttribute("data-size", "md")
    expect(trigger).toHaveAttribute("data-invalid", "false")
    expect(trigger).not.toHaveAttribute("aria-invalid")
    expect(trigger).toHaveTextContent("Pick a plan")
  })

  it.each(["sm", "md", "lg"] as const)("supports %s size on trigger", (s) => {
    render(basicSelect({ size: s }))
    expect(screen.getByRole("combobox")).toHaveAttribute("data-size", s)
  })

  it("sets aria-invalid + data-invalid when invalid", () => {
    render(basicSelect({ invalid: true }))
    const trigger = screen.getByRole("combobox")
    expect(trigger).toHaveAttribute("data-invalid", "true")
    expect(trigger).toHaveAttribute("aria-invalid", "true")
  })

  it("disables the trigger when the select is disabled", () => {
    render(basicSelect({ disabled: true }))
    const trigger = screen.getByRole("combobox")
    expect(trigger).toBeDisabled()
    expect(trigger).toHaveAttribute("data-disabled")
  })

  it("renders the selected value text via defaultValue (uncontrolled)", () => {
    render(basicSelect({ defaultValue: "pro" }))
    expect(screen.getByRole("combobox")).toHaveTextContent("Pro")
  })

  it("supports controlled value + onValueChange wiring", () => {
    function Wrapper() {
      const [value, setValue] = useState("free")
      return (
        <>
          <button type="button" onClick={() => setValue("pro")}>
            external
          </button>
          {basicSelect({ value, onValueChange: setValue })}
        </>
      )
    }
    render(<Wrapper />)
    expect(screen.getByRole("combobox")).toHaveTextContent("Free")
    fireEvent.click(screen.getByText("external"))
    expect(screen.getByRole("combobox")).toHaveTextContent("Pro")
  })

  it("does not let user-supplied data-* attributes override internal state on the trigger", () => {
    render(
      <Select>
        <SelectTrigger
          aria-label="x"
          size="md"
          invalid
          data-size="hacked"
          data-invalid="false"
        >
          <SelectValue placeholder="x" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    )
    const trigger = screen.getByRole("combobox")
    expect(trigger).toHaveAttribute("data-size", "md")
    expect(trigger).toHaveAttribute("data-invalid", "true")
  })

  it("renders SelectLabel, SelectSeparator, and items inside an open listbox", () => {
    render(
      <Select open>
        <SelectTrigger aria-label="x">
          <SelectValue placeholder="x" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Plans</SelectLabel>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Other</SelectLabel>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
    expect(screen.getByText("Plans")).toBeInTheDocument()
    expect(screen.getByText("Other")).toBeInTheDocument()
    expect(screen.getAllByRole("option")).toHaveLength(3)
    expect(
      document.querySelector(".lead-SelectSeparator")
    ).not.toBeNull()
  })

  it("marks a disabled SelectItem with data-disabled", () => {
    render(basicSelect({ open: true }))
    const enterprise = screen.getByText("Enterprise").closest("[role='option']")
    expect(enterprise).toHaveAttribute("data-disabled")
  })

  it("does not call onValueChange when the select is disabled and a defaultValue is set", () => {
    const onValueChange = vi.fn()
    render(
      basicSelect({
        disabled: true,
        defaultValue: "free",
        onValueChange,
      })
    )
    fireEvent.click(screen.getByRole("combobox"))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("forwards ref + className on SelectItem", () => {
    const ref = { current: null as HTMLDivElement | null }
    render(
      <Select open>
        <SelectTrigger aria-label="x">
          <SelectValue placeholder="x" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem ref={ref} value="a" className="custom">
            A
          </SelectItem>
        </SelectContent>
      </Select>
    )
    const opt = screen.getByText("A").closest("[role='option']") as HTMLElement
    expect(opt.className).toContain("lead-SelectItem")
    expect(opt.className).toContain("custom")
    expect(ref.current).toBeInstanceOf(HTMLElement)
  })

  it("merges custom className on SelectTrigger and SelectContent", () => {
    render(
      <Select open>
        <SelectTrigger aria-label="x" className="trig-custom">
          <SelectValue placeholder="x" />
        </SelectTrigger>
        <SelectContent className="content-custom">
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    )
    // With open=true, Radix Select sets aria-hidden on the trigger because
    // focus is trapped in the popover; getByRole("combobox") excludes
    // hidden nodes. Query by aria-label instead.
    const trigger = screen.getByLabelText("x")
    expect(trigger.className).toContain("trig-custom")
    const content = document.querySelector(".lead-SelectContent")
    expect(content).not.toBeNull()
    expect(content!.className).toContain("content-custom")
  })

  it("forwards ref on SelectTrigger", () => {
    const ref = { current: null as HTMLButtonElement | null }
    render(
      <Select>
        <SelectTrigger ref={ref} aria-label="x">
          <SelectValue placeholder="x" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
