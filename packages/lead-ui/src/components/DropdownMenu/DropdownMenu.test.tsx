import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import { Button } from "../Button/Button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu"

/**
 * jsdom limitations:
 *
 * Like Tooltip, Select, and Popover, Radix DropdownMenu uses Floating UI
 * + portal + presence APIs that jsdom only stubs. Two specific gaps:
 *
 *   1. Click-on-trigger does not open the menu under jsdom — Radix uses
 *      pointerdown/pointerup interception, not click events, for the
 *      trigger. Tests that need an open menu use `defaultOpen` or the
 *      controlled `open` prop instead. Visual coverage of trigger-driven
 *      open behavior lives in Storybook.
 *
 *   2. Selecting an item in a DropdownMenu auto-closes the menu (Radix
 *      default). For radio-group state changes, we assert the
 *      `onValueChange` callback fires rather than re-querying the DOM
 *      after the menu has unmounted.
 *
 * Submenu open/close behavior (DropdownMenuSub*) and resolved popper
 * coordinates are not tested here for the same reason.
 */

function basicMenu(props: {
  defaultOpen?: boolean
  onItemClick?: () => void
  disabledItem?: boolean
} = {}) {
  return (
    <DropdownMenu defaultOpen={props.defaultOpen}>
      <DropdownMenuTrigger asChild>
        <Button>Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={props.onItemClick}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem disabled={props.disabledItem}>
            Billing
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

describe("DropdownMenu", () => {
  it("does not render content when closed", () => {
    render(basicMenu())
    expect(screen.queryByText("Profile")).toBeNull()
  })

  it("renders the menu and items when defaultOpen is true", () => {
    render(basicMenu({ defaultOpen: true }))
    expect(screen.getByRole("menu")).toBeInTheDocument()
    expect(screen.getByText("Profile")).toBeInTheDocument()
    expect(screen.getByText("Billing")).toBeInTheDocument()
    expect(screen.getByText("Sign out")).toBeInTheDocument()
    expect(screen.getAllByRole("menuitem")).toHaveLength(3)
  })

  it("fires onSelect when an item is clicked", () => {
    const onItemClick = vi.fn()
    render(basicMenu({ defaultOpen: true, onItemClick }))
    fireEvent.click(screen.getByText("Profile"))
    expect(onItemClick).toHaveBeenCalledTimes(1)
  })

  it("marks a disabled item with data-disabled and does not fire onSelect", () => {
    const onItemClick = vi.fn()
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuContent>
          <DropdownMenuItem disabled onSelect={onItemClick}>
            Disabled
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    const item = screen.getByText("Disabled")
    expect(item).toHaveAttribute("data-disabled")
    fireEvent.click(item)
    expect(onItemClick).not.toHaveBeenCalled()
  })

  it("renders DropdownMenuLabel and DropdownMenuSeparator structurally", () => {
    render(basicMenu({ defaultOpen: true }))
    expect(screen.getByText("Account").className).toContain(
      "lead-DropdownMenuLabel"
    )
    expect(
      document.querySelector(".lead-DropdownMenuSeparator")
    ).not.toBeNull()
  })

  it("renders a checkbox item with the indicator only when checked", () => {
    function Wrapper() {
      const [checked, setChecked] = useState(false)
      return (
        <DropdownMenu defaultOpen>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={checked}
              onCheckedChange={setChecked}
            >
              Show comments
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
    render(<Wrapper />)
    const item = screen.getByText("Show comments")
    expect(item).toHaveAttribute("data-state", "unchecked")
    expect(item.querySelector(".lead-DropdownMenu__indicator")).toBeNull()
    fireEvent.click(item)
    expect(item).toHaveAttribute("data-state", "checked")
    expect(
      item.querySelector(".lead-DropdownMenu__indicator")
    ).not.toBeNull()
  })

  it("renders a radio group with one checked item", () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="a">
            <DropdownMenuRadioItem value="a">Option A</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="b">Option B</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText("Option A")).toHaveAttribute(
      "data-state",
      "checked"
    )
    expect(screen.getByText("Option B")).toHaveAttribute(
      "data-state",
      "unchecked"
    )
    expect(
      screen.getByText("Option A").querySelector(".lead-DropdownMenu__indicator")
    ).not.toBeNull()
    expect(
      screen.getByText("Option B").querySelector(".lead-DropdownMenu__indicator")
    ).toBeNull()
  })

  it("fires onValueChange when a radio item is selected", () => {
    // Note: selecting a DropdownMenu item auto-closes the menu (Radix
    // default), so we assert the callback fired rather than re-querying
    // the now-unmounted items.
    const onValueChange = vi.fn()
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="a" onValueChange={onValueChange}>
            <DropdownMenuRadioItem value="a">A</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="b">B</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    fireEvent.click(screen.getByText("B"))
    expect(onValueChange).toHaveBeenCalledWith("b")
  })

  it("merges custom className on Content and Item", () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuContent className="content-custom">
          <DropdownMenuItem className="item-custom">x</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    const content = document.querySelector(".lead-DropdownMenu__content")
    expect(content!.className).toContain("content-custom")
    const item = screen.getByText("x")
    expect(item.className).toContain("lead-DropdownMenuItem")
    expect(item.className).toContain("item-custom")
  })

  it("forwards ref on DropdownMenuItem", () => {
    const ref = { current: null as HTMLDivElement | null }
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuContent>
          <DropdownMenuItem ref={ref}>x</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
  })

  it("supports controlled open + onOpenChange", () => {
    function Wrapper() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            external
          </button>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuContent>
              <DropdownMenuItem>x</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )
    }
    render(<Wrapper />)
    expect(screen.queryByText("x")).toBeNull()
    fireEvent.click(screen.getByText("external"))
    expect(screen.getByText("x")).toBeInTheDocument()
  })
})
