import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import { Button } from "../Button/Button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "./Popover"

function basicPopover(props: { defaultOpen?: boolean } = {}) {
  return (
    <Popover defaultOpen={props.defaultOpen}>
      <PopoverTrigger asChild>
        <Button>Open</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>Body content</p>
        <PopoverClose asChild>
          <Button variant="ghost">Close</Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}

describe("Popover", () => {
  it("does not render content when closed", () => {
    render(basicPopover())
    expect(screen.queryByText("Body content")).toBeNull()
  })

  it("opens when the trigger is clicked", () => {
    render(basicPopover())
    fireEvent.click(screen.getByRole("button", { name: "Open" }))
    expect(screen.getByText("Body content")).toBeInTheDocument()
  })

  it("renders open by default with defaultOpen", () => {
    render(basicPopover({ defaultOpen: true }))
    expect(screen.getByText("Body content")).toBeInTheDocument()
  })

  it("closes when PopoverClose is clicked", () => {
    render(basicPopover({ defaultOpen: true }))
    expect(screen.getByText("Body content")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Close" }))
    expect(screen.queryByText("Body content")).toBeNull()
  })

  it("supports controlled open + onOpenChange", () => {
    function Wrapper() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            external
          </button>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverContent>
              <p>Controlled body</p>
              <PopoverClose asChild>
                <Button>Close</Button>
              </PopoverClose>
            </PopoverContent>
          </Popover>
        </>
      )
    }
    render(<Wrapper />)
    expect(screen.queryByText("Controlled body")).toBeNull()
    fireEvent.click(screen.getByText("external"))
    expect(screen.getByText("Controlled body")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Close" }))
    expect(screen.queryByText("Controlled body")).toBeNull()
  })

  it("calls onOpenChange when the trigger toggles", () => {
    const onOpenChange = vi.fn()
    render(
      <Popover onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent>x</PopoverContent>
      </Popover>
    )
    fireEvent.click(screen.getByRole("button", { name: "Open" }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it("passes side and align through to Radix without throwing", () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent side="right" align="start">
          right-aligned body
        </PopoverContent>
      </Popover>
    )
    expect(screen.getByText("right-aligned body")).toBeInTheDocument()
  })

  it("merges custom className on PopoverContent", () => {
    render(
      <Popover defaultOpen>
        <PopoverContent className="custom">x</PopoverContent>
      </Popover>
    )
    const tip = document.querySelector(".lead-Popover__content")
    expect(tip).not.toBeNull()
    expect(tip!.className).toContain("lead-Popover__content")
    expect(tip!.className).toContain("custom")
  })

  it("renders an arrow by default and omits it when withArrow=false", () => {
    const { rerender } = render(
      <Popover defaultOpen>
        <PopoverContent>x</PopoverContent>
      </Popover>
    )
    expect(document.querySelector(".lead-Popover__arrow")).not.toBeNull()
    rerender(
      <Popover defaultOpen>
        <PopoverContent withArrow={false}>x</PopoverContent>
      </Popover>
    )
    expect(document.querySelector(".lead-Popover__arrow")).toBeNull()
  })

  it("forwards ref on PopoverTrigger", () => {
    const ref = { current: null as HTMLButtonElement | null }
    render(
      <Popover>
        <PopoverTrigger ref={ref}>plain</PopoverTrigger>
        <PopoverContent>x</PopoverContent>
      </Popover>
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
