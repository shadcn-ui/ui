import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import { Checkbox } from "./Checkbox"

describe("Checkbox", () => {
  it("renders an unchecked checkbox by default", () => {
    render(<Checkbox aria-label="agree" />)
    const cb = screen.getByRole("checkbox", { name: "agree" })
    expect(cb).toHaveAttribute("data-size", "md")
    expect(cb).toHaveAttribute("data-invalid", "false")
    expect(cb).toHaveAttribute("data-state", "unchecked")
    expect(cb).not.toBeDisabled()
  })

  it.each(["sm", "md", "lg"] as const)("renders %s size", (size) => {
    render(<Checkbox aria-label="x" size={size} />)
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-size", size)
  })

  it("toggles state when clicked (uncontrolled)", () => {
    render(<Checkbox aria-label="agree" />)
    const cb = screen.getByRole("checkbox")
    expect(cb).toHaveAttribute("data-state", "unchecked")
    fireEvent.click(cb)
    expect(cb).toHaveAttribute("data-state", "checked")
  })

  it("respects defaultChecked", () => {
    render(<Checkbox aria-label="x" defaultChecked />)
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "data-state",
      "checked"
    )
  })

  it("supports controlled checked + onCheckedChange", () => {
    function Wrapper() {
      const [checked, setChecked] = useState<boolean | "indeterminate">(false)
      return (
        <Checkbox
          aria-label="x"
          checked={checked}
          onCheckedChange={setChecked}
        />
      )
    }
    render(<Wrapper />)
    const cb = screen.getByRole("checkbox")
    expect(cb).toHaveAttribute("data-state", "unchecked")
    fireEvent.click(cb)
    expect(cb).toHaveAttribute("data-state", "checked")
  })

  it("renders the indeterminate indicator when checked='indeterminate'", () => {
    render(<Checkbox aria-label="x" checked="indeterminate" />)
    const cb = screen.getByRole("checkbox")
    expect(cb).toHaveAttribute("data-state", "indeterminate")
  })

  it("disables the checkbox and exposes data-disabled", () => {
    const onCheckedChange = vi.fn()
    render(
      <Checkbox
        aria-label="x"
        disabled
        onCheckedChange={onCheckedChange}
      />
    )
    const cb = screen.getByRole("checkbox")
    expect(cb).toBeDisabled()
    expect(cb).toHaveAttribute("data-disabled")
    fireEvent.click(cb)
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it("sets aria-invalid + data-invalid when invalid", () => {
    render(<Checkbox aria-label="x" invalid />)
    const cb = screen.getByRole("checkbox")
    expect(cb).toHaveAttribute("data-invalid", "true")
    expect(cb).toHaveAttribute("aria-invalid", "true")
  })

  it("forwards ref to the underlying button", () => {
    const ref = { current: null as HTMLButtonElement | null }
    render(<Checkbox aria-label="x" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("merges custom className with the base class", () => {
    render(<Checkbox aria-label="x" className="custom" />)
    const cb = screen.getByRole("checkbox")
    expect(cb.className).toContain("lead-Checkbox")
    expect(cb.className).toContain("custom")
  })

  it("does not let user-supplied data-* attributes override internal state", () => {
    render(
      <Checkbox
        aria-label="x"
        size="md"
        invalid
        data-size="hacked"
        data-invalid="false"
      />
    )
    const cb = screen.getByRole("checkbox")
    expect(cb).toHaveAttribute("data-size", "md")
    expect(cb).toHaveAttribute("data-invalid", "true")
  })

  it("passes through normal attributes like data-testid", () => {
    render(<Checkbox aria-label="x" data-testid="agree" />)
    expect(screen.getByTestId("agree")).toBeInTheDocument()
  })
})
