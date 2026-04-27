import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Button } from "../Button/Button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip"

/**
 * Notes on Tooltip testing under jsdom:
 *
 * Radix's TooltipContent uses `@radix-ui/react-presence` and Floating UI's
 * positioning, both of which read layout APIs (getBoundingClientRect,
 * IntersectionObserver, ResizeObserver) that jsdom does not implement
 * meaningfully. As a result, hover-driven open behavior is *not*
 * deterministic in jsdom — it can hang on transition states or fail to
 * place the content in the DOM.
 *
 * What we test here:
 *   - Structural / rendering contracts (trigger renders, default state).
 *   - Controlled open + portaled content rendering when open=true.
 *   - className / data attribute pass-through on the content.
 *
 * What we do NOT test here (covered visually in Storybook):
 *   - delayDuration timing.
 *   - Positioning (`side`, `align`, `sideOffset`) — the placement is set
 *     correctly via Radix props but the resolved coordinates aren't
 *     observable in jsdom.
 *   - Arrow rendering coordinates.
 */

describe("Tooltip", () => {
  it("renders the trigger when closed and does not render content", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Help</Button>
          </TooltipTrigger>
          <TooltipContent>Useful hint</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    expect(screen.getByRole("button", { name: "Help" })).toBeInTheDocument()
    expect(document.querySelector(".lead-Tooltip__content")).toBeNull()
  })

  it("renders content when open is true (controlled)", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button>Help</Button>
          </TooltipTrigger>
          <TooltipContent>Useful hint</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    const tip = document.querySelector(".lead-Tooltip__content")
    expect(tip).not.toBeNull()
    expect(tip!.textContent).toContain("Useful hint")
  })

  it("supports defaultOpen", () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger asChild>
            <Button>Help</Button>
          </TooltipTrigger>
          <TooltipContent>Default open hint</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    const tip = document.querySelector(".lead-Tooltip__content")
    expect(tip).not.toBeNull()
    expect(tip!.textContent).toContain("Default open hint")
  })

  it("passes className through to the rendered tooltip content", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button>Help</Button>
          </TooltipTrigger>
          <TooltipContent className="custom">Hint</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    // Radix Tooltip renders both a visual content element and a screen-reader
    // helper with role='tooltip'. Query the visual one via its base class.
    const tip = document.querySelector(".lead-Tooltip__content")
    expect(tip).not.toBeNull()
    expect(tip!.className).toContain("lead-Tooltip__content")
    expect(tip!.className).toContain("custom")
  })

  it("renders an arrow by default and omits it when withArrow=false", () => {
    const { rerender } = render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button>Help</Button>
          </TooltipTrigger>
          <TooltipContent>Hint</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    expect(
      document.querySelector(".lead-Tooltip__arrow")
    ).not.toBeNull()

    rerender(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button>Help</Button>
          </TooltipTrigger>
          <TooltipContent withArrow={false}>Hint</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    expect(document.querySelector(".lead-Tooltip__arrow")).toBeNull()
  })

  it("forwards ref on TooltipTrigger to the underlying focusable element", () => {
    const ref = { current: null as HTMLButtonElement | null }
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger ref={ref}>
            <span>plain</span>
          </TooltipTrigger>
          <TooltipContent>x</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("does not throw when the trigger is focused programmatically", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Help</Button>
          </TooltipTrigger>
          <TooltipContent>Hint</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    const trigger = screen.getByRole("button", { name: "Help" })
    expect(() => fireEvent.focus(trigger)).not.toThrow()
  })
})
