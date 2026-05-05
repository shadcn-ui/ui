import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import { Button } from "../Button/Button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./AlertDialog"

function basicAlertDialog(props: {
  defaultOpen?: boolean
  size?: "sm" | "md" | "lg"
  onAction?: () => void
  onCancel?: () => void
}) {
  return (
    <AlertDialog defaultOpen={props.defaultOpen}>
      <AlertDialogTrigger asChild>
        <Button>Delete account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size={props.size}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this account?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All associated data will be removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Canonical Lead order: Cancel first, primary action last. */}
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={props.onCancel}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="primary" onClick={props.onAction}>
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

describe("AlertDialog", () => {
  it("does not render content when closed", () => {
    render(basicAlertDialog({}))
    expect(screen.queryByRole("alertdialog")).toBeNull()
  })

  it("opens with role='alertdialog' when the trigger is clicked", () => {
    render(basicAlertDialog({}))
    fireEvent.click(screen.getByRole("button", { name: "Delete account" }))
    const dialog = screen.getByRole("alertdialog", {
      name: "Delete this account?",
    })
    expect(dialog).toBeInTheDocument()
    // Critical contract: this is alertdialog, not dialog.
    expect(dialog.getAttribute("role")).toBe("alertdialog")
  })

  it("wires title and description via aria-labelledby and aria-describedby", () => {
    render(basicAlertDialog({ defaultOpen: true }))
    const dialog = screen.getByRole("alertdialog")
    const labelledBy = dialog.getAttribute("aria-labelledby")
    const describedBy = dialog.getAttribute("aria-describedby")
    expect(labelledBy).toBeTruthy()
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(labelledBy!)).toHaveTextContent(
      "Delete this account?"
    )
    expect(document.getElementById(describedBy!)).toHaveTextContent(
      "This action cannot be undone. All associated data will be removed."
    )
  })

  it("renders Cancel and Action buttons in caller-declared order", () => {
    render(basicAlertDialog({ defaultOpen: true }))
    const buttons = screen
      .getAllByRole("button")
      .filter((b) => b.textContent === "Cancel" || b.textContent === "Delete")
    expect(buttons.map((b) => b.textContent)).toEqual(["Cancel", "Delete"])
  })

  it("invokes the action's onClick when AlertDialogAction is clicked", () => {
    const onAction = vi.fn()
    render(basicAlertDialog({ defaultOpen: true, onAction }))
    fireEvent.click(screen.getByRole("button", { name: "Delete" }))
    expect(onAction).toHaveBeenCalledTimes(1)
  })

  it("closes when AlertDialogAction is activated", () => {
    render(basicAlertDialog({ defaultOpen: true }))
    expect(screen.getByRole("alertdialog")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Delete" }))
    expect(screen.queryByRole("alertdialog")).toBeNull()
  })

  it("invokes the cancel's onClick when AlertDialogCancel is clicked", () => {
    const onCancel = vi.fn()
    render(basicAlertDialog({ defaultOpen: true, onCancel }))
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it("closes when AlertDialogCancel is activated", () => {
    render(basicAlertDialog({ defaultOpen: true }))
    expect(screen.getByRole("alertdialog")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(screen.queryByRole("alertdialog")).toBeNull()
  })

  it("propagates size to data-size attribute on content (md default)", () => {
    render(basicAlertDialog({ defaultOpen: true }))
    const dialog = screen.getByRole("alertdialog")
    expect(dialog.getAttribute("data-size")).toBe("md")
  })

  it("propagates size='sm' to data-size attribute on content", () => {
    render(basicAlertDialog({ defaultOpen: true, size: "sm" }))
    const dialog = screen.getByRole("alertdialog")
    expect(dialog.getAttribute("data-size")).toBe("sm")
  })

  it("renders the AlertDialogFooter as a child of the content", () => {
    render(basicAlertDialog({ defaultOpen: true, size: "sm" }))
    const dialog = screen.getByRole("alertdialog")
    const footer = dialog.querySelector(".lead-DialogFooter")
    expect(footer).not.toBeNull()
    // sm-size auto-stacking is a CSS rule (descendant selector). The
    // DOM contract here is: the footer is inside the content, and the
    // content carries data-size="sm". The rendered flex-direction is a
    // CSS observation, not a DOM observation — jsdom does not compute
    // layout, so we assert the DOM precondition that drives it.
    expect(footer?.parentElement).toBe(dialog)
  })

  it("supports controlled open state", () => {
    function Controlled() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button onClick={() => setOpen(true)}>External open</button>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm</AlertDialogTitle>
                <AlertDialogDescription>Description.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button>Cancel</Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button>OK</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )
    }
    render(<Controlled />)
    expect(screen.queryByRole("alertdialog")).toBeNull()
    fireEvent.click(screen.getByRole("button", { name: "External open" }))
    expect(screen.getByRole("alertdialog")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "OK" }))
    expect(screen.queryByRole("alertdialog")).toBeNull()
  })
})
