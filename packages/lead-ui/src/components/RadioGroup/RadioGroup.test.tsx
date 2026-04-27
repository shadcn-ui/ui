import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import { RadioGroup, RadioGroupItem } from "./RadioGroup"

function group() {
  return (
    <RadioGroup aria-label="plan">
      <RadioGroupItem value="free" aria-label="free" />
      <RadioGroupItem value="pro" aria-label="pro" />
      <RadioGroupItem value="enterprise" aria-label="enterprise" />
    </RadioGroup>
  )
}

describe("RadioGroup", () => {
  it("renders a radiogroup with three radios", () => {
    render(group())
    expect(screen.getByRole("radiogroup")).toBeInTheDocument()
    expect(screen.getAllByRole("radio")).toHaveLength(3)
  })

  it("propagates size to items via context", () => {
    render(
      <RadioGroup aria-label="x" size="lg">
        <RadioGroupItem value="a" aria-label="a" />
        <RadioGroupItem value="b" aria-label="b" />
      </RadioGroup>
    )
    expect(screen.getByRole("radiogroup")).toHaveAttribute("data-size", "lg")
    expect(screen.getByLabelText("a")).toHaveAttribute("data-size", "lg")
    expect(screen.getByLabelText("b")).toHaveAttribute("data-size", "lg")
  })

  it("lets an item override its own size", () => {
    render(
      <RadioGroup aria-label="x" size="md">
        <RadioGroupItem value="a" size="sm" aria-label="a" />
        <RadioGroupItem value="b" aria-label="b" />
      </RadioGroup>
    )
    expect(screen.getByLabelText("a")).toHaveAttribute("data-size", "sm")
    expect(screen.getByLabelText("b")).toHaveAttribute("data-size", "md")
  })

  it("selects an item when clicked (uncontrolled)", () => {
    render(group())
    const free = screen.getByLabelText("free")
    expect(free).toHaveAttribute("data-state", "unchecked")
    fireEvent.click(free)
    expect(free).toHaveAttribute("data-state", "checked")
  })

  it("respects defaultValue", () => {
    render(
      <RadioGroup aria-label="x" defaultValue="b">
        <RadioGroupItem value="a" aria-label="a" />
        <RadioGroupItem value="b" aria-label="b" />
      </RadioGroup>
    )
    expect(screen.getByLabelText("a")).toHaveAttribute(
      "data-state",
      "unchecked"
    )
    expect(screen.getByLabelText("b")).toHaveAttribute("data-state", "checked")
  })

  it("supports controlled value + onValueChange", () => {
    function Wrapper() {
      const [v, setV] = useState("a")
      return (
        <RadioGroup aria-label="x" value={v} onValueChange={setV}>
          <RadioGroupItem value="a" aria-label="a" />
          <RadioGroupItem value="b" aria-label="b" />
        </RadioGroup>
      )
    }
    render(<Wrapper />)
    const a = screen.getByLabelText("a")
    const b = screen.getByLabelText("b")
    expect(a).toHaveAttribute("data-state", "checked")
    fireEvent.click(b)
    expect(a).toHaveAttribute("data-state", "unchecked")
    expect(b).toHaveAttribute("data-state", "checked")
  })

  it("disables the whole group when disabled", () => {
    const onValueChange = vi.fn()
    render(
      <RadioGroup
        aria-label="x"
        disabled
        onValueChange={onValueChange}
      >
        <RadioGroupItem value="a" aria-label="a" />
      </RadioGroup>
    )
    const a = screen.getByLabelText("a")
    expect(a).toBeDisabled()
    expect(a).toHaveAttribute("data-disabled")
    fireEvent.click(a)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("disables a single item when item.disabled is true", () => {
    render(
      <RadioGroup aria-label="x">
        <RadioGroupItem value="a" aria-label="a" />
        <RadioGroupItem value="b" disabled aria-label="b" />
      </RadioGroup>
    )
    expect(screen.getByLabelText("a")).not.toBeDisabled()
    expect(screen.getByLabelText("b")).toBeDisabled()
  })

  it("forwards refs", () => {
    const groupRef = { current: null as HTMLDivElement | null }
    const itemRef = { current: null as HTMLButtonElement | null }
    render(
      <RadioGroup aria-label="x" ref={groupRef}>
        <RadioGroupItem value="a" aria-label="a" ref={itemRef} />
      </RadioGroup>
    )
    expect(groupRef.current).toBeInstanceOf(HTMLDivElement)
    expect(itemRef.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("merges custom classNames with base classes", () => {
    render(
      <RadioGroup aria-label="x" className="g-custom">
        <RadioGroupItem value="a" aria-label="a" className="i-custom" />
      </RadioGroup>
    )
    const grp = screen.getByRole("radiogroup")
    expect(grp.className).toContain("lead-RadioGroup")
    expect(grp.className).toContain("g-custom")
    const item = screen.getByLabelText("a")
    expect(item.className).toContain("lead-RadioGroupItem")
    expect(item.className).toContain("i-custom")
  })

  it("does not let user-supplied data-size override internal state", () => {
    render(
      <RadioGroup aria-label="x" size="md" data-size="hacked">
        <RadioGroupItem value="a" aria-label="a" data-size="hacked" />
      </RadioGroup>
    )
    expect(screen.getByRole("radiogroup")).toHaveAttribute("data-size", "md")
    expect(screen.getByLabelText("a")).toHaveAttribute("data-size", "md")
  })
})
