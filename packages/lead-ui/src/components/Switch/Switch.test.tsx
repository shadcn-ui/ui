import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import { Switch } from "./Switch"

describe("Switch", () => {
  it("renders an unchecked switch by default", () => {
    render(<Switch aria-label="notifications" />)
    const sw = screen.getByRole("switch", { name: "notifications" })
    expect(sw).toHaveAttribute("data-size", "md")
    expect(sw).toHaveAttribute("data-state", "unchecked")
  })

  it.each(["sm", "md", "lg"] as const)("renders %s size", (size) => {
    render(<Switch aria-label="x" size={size} />)
    expect(screen.getByRole("switch")).toHaveAttribute("data-size", size)
  })

  it("toggles state when clicked (uncontrolled)", () => {
    render(<Switch aria-label="x" />)
    const sw = screen.getByRole("switch")
    fireEvent.click(sw)
    expect(sw).toHaveAttribute("data-state", "checked")
    fireEvent.click(sw)
    expect(sw).toHaveAttribute("data-state", "unchecked")
  })

  it("respects defaultChecked", () => {
    render(<Switch aria-label="x" defaultChecked />)
    expect(screen.getByRole("switch")).toHaveAttribute(
      "data-state",
      "checked"
    )
  })

  it("supports controlled checked + onCheckedChange", () => {
    function Wrapper() {
      const [on, setOn] = useState(false)
      return <Switch aria-label="x" checked={on} onCheckedChange={setOn} />
    }
    render(<Wrapper />)
    const sw = screen.getByRole("switch")
    expect(sw).toHaveAttribute("data-state", "unchecked")
    fireEvent.click(sw)
    expect(sw).toHaveAttribute("data-state", "checked")
  })

  it("disables the switch and exposes data-disabled", () => {
    const onCheckedChange = vi.fn()
    render(
      <Switch aria-label="x" disabled onCheckedChange={onCheckedChange} />
    )
    const sw = screen.getByRole("switch")
    expect(sw).toBeDisabled()
    expect(sw).toHaveAttribute("data-disabled")
    fireEvent.click(sw)
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it("forwards ref to the underlying button", () => {
    const ref = { current: null as HTMLButtonElement | null }
    render(<Switch aria-label="x" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("merges custom className with the base class", () => {
    render(<Switch aria-label="x" className="custom" />)
    const sw = screen.getByRole("switch")
    expect(sw.className).toContain("lead-Switch")
    expect(sw.className).toContain("custom")
  })

  it("does not let user-supplied data-size override internal state", () => {
    render(<Switch aria-label="x" size="md" data-size="hacked" />)
    expect(screen.getByRole("switch")).toHaveAttribute("data-size", "md")
  })

  it("passes through normal attributes like data-testid", () => {
    render(<Switch aria-label="x" data-testid="notif" />)
    expect(screen.getByTestId("notif")).toBeInTheDocument()
  })
})
