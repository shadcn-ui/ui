import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import { Button } from "../Button/Button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog"

function basicDialog(props: { defaultOpen?: boolean } = {}) {
  return (
    <Dialog defaultOpen={props.defaultOpen}>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your account details below.
          </DialogDescription>
        </DialogHeader>
        <p>body</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

describe("Dialog", () => {
  it("does not render content when closed", () => {
    render(basicDialog())
    expect(
      screen.queryByRole("dialog", { name: "Edit profile" })
    ).toBeNull()
    expect(screen.queryByText("Update your account details below.")).toBeNull()
  })

  it("opens when the trigger is clicked", () => {
    render(basicDialog())
    fireEvent.click(screen.getByRole("button", { name: "Open" }))
    expect(
      screen.getByRole("dialog", { name: "Edit profile" })
    ).toBeInTheDocument()
    expect(
      screen.getByText("Update your account details below.")
    ).toBeInTheDocument()
  })

  it("renders open by default with defaultOpen", () => {
    render(basicDialog({ defaultOpen: true }))
    expect(
      screen.getByRole("dialog", { name: "Edit profile" })
    ).toBeInTheDocument()
  })

  it("closes when DialogClose is clicked", () => {
    render(basicDialog({ defaultOpen: true }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("supports controlled open + onOpenChange", () => {
    function Wrapper() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            external
          </button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogTitle>Controlled</DialogTitle>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </>
      )
    }
    render(<Wrapper />)
    expect(screen.queryByRole("dialog")).toBeNull()
    fireEvent.click(screen.getByText("external"))
    expect(
      screen.getByRole("dialog", { name: "Controlled" })
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Close" }))
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("calls onOpenChange when the trigger toggles", () => {
    const onOpenChange = vi.fn()
    render(
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>x</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    fireEvent.click(screen.getByRole("button", { name: "Open" }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it.each(["sm", "md", "lg"] as const)(
    "DialogContent supports %s size",
    (size) => {
      render(
        <Dialog defaultOpen>
          <DialogContent size={size}>
            <DialogTitle>x</DialogTitle>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByRole("dialog")).toHaveAttribute("data-size", size)
    }
  )

  it("does not let user-supplied data-size override internal state", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent size="md" data-size="hacked">
          <DialogTitle>x</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole("dialog")).toHaveAttribute("data-size", "md")
  })

  it("DialogTitle wires aria-labelledby on the dialog", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Hello</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Hello")
  })

  it("DialogDescription wires aria-describedby on the dialog", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>x</DialogTitle>
          <DialogDescription>Long form description.</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole("dialog")).toHaveAccessibleDescription(
      "Long form description."
    )
  })

  it("DialogHeader / DialogFooter render with their base classes and forward refs", () => {
    const headerRef = { current: null as HTMLDivElement | null }
    const footerRef = { current: null as HTMLDivElement | null }
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader ref={headerRef} data-testid="h">
            <DialogTitle>x</DialogTitle>
          </DialogHeader>
          <DialogFooter ref={footerRef} data-testid="f" align="between" />
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByTestId("h").className).toContain("lead-DialogHeader")
    expect(screen.getByTestId("f").className).toContain("lead-DialogFooter")
    expect(screen.getByTestId("f")).toHaveAttribute("data-align", "between")
    expect(headerRef.current).toBeInstanceOf(HTMLDivElement)
    expect(footerRef.current).toBeInstanceOf(HTMLDivElement)
  })

  it("DialogFooter does not let user-supplied data-align override internal state", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>x</DialogTitle>
          <DialogFooter
            align="end"
            data-align="hacked"
            data-testid="f"
          />
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByTestId("f")).toHaveAttribute("data-align", "end")
  })

  it("merges custom className on DialogContent", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent className="custom">
          <DialogTitle>x</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    const d = screen.getByRole("dialog")
    expect(d.className).toContain("lead-Dialog__content")
    expect(d.className).toContain("custom")
  })
})
