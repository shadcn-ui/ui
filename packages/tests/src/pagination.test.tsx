import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationLink,
} from "../pagination"

describe("Pagination Component", () => {
  test("renders Pagination with icons and text controlled by showText prop", () => {
    render(
      <Pagination>
        <PaginationPrevious showText={true}>Prev</PaginationPrevious>
        <PaginationNext showText={false}>Next</PaginationNext>
        <PaginationEllipsis />
      </Pagination>
    )

    // Check Previous button text and icon
    expect(screen.getByLabelText(/go to previous page/i)).toBeInTheDocument()
    expect(screen.getByText("Prev")).toBeInTheDocument()
    expect(screen.getByLabelText(/go to previous page/i).querySelector("svg")).toBeInTheDocument()

    // Check Next button icon only (no text)
    expect(screen.getByLabelText(/go to next page/i)).toBeInTheDocument()
    expect(screen.queryByText("Next")).not.toBeInTheDocument()
    expect(screen.getByLabelText(/go to next page/i).querySelector("svg")).toBeInTheDocument()

    // Check Ellipsis icon
    expect(screen.getByLabelText(/more pages/i)).toBeInTheDocument()
  })

  test("PaginationLink renders as a button and supports isActive prop", () => {
    render(
      <>
        <PaginationLink isActive={true}>Active</PaginationLink>
        <PaginationLink>Inactive</PaginationLink>
      </>
    )

    const activeButton = screen.getByRole("button", { name: "Active" })
    const inactiveButton = screen.getByRole("button", { name: "Inactive" })

    expect(activeButton).toHaveAttribute("aria-current", "page")
    expect(inactiveButton).not.toHaveAttribute("aria-current")
  })

  test("PaginationPrevious and PaginationNext support custom children for i18n", () => {
    render(
      <>
        <PaginationPrevious showText={true}>
          <span>Anterior</span>
        </PaginationPrevious>
        <PaginationNext showText={true}>
          <span>Siguiente</span>
        </PaginationNext>
      </>
    )

    expect(screen.getByText("Anterior")).toBeInTheDocument()
    expect(screen.getByText("Siguiente")).toBeInTheDocument()
  })
})
