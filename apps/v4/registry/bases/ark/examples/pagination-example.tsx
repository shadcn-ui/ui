"use client"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/ark/components/example"
import { Field, FieldLabel } from "@/registry/bases/ark/ui/field"
import {
  Pagination,
  PaginationContext,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/bases/ark/ui/pagination"
import {
  createListCollection,
  Select,
  SelectContent,
  SelectControl,
  SelectIndicator,
  SelectItem,
  SelectItemGroup,
  SelectItemIndicator,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/ark/ui/select"

export default function PaginationExample() {
  return (
    <ExampleWrapper>
      <PaginationBasic />
      <PaginationSimple />
      <PaginationIconsOnly />
    </ExampleWrapper>
  )
}

function PaginationBasic() {
  return (
    <Example title="Basic">
      <Pagination count={100} pageSize={10} siblingCount={1}>
        <PaginationPrevious />
        <PaginationContext>
          {(api) =>
            api.pages.map((page, index) =>
              page.type === "page" ? (
                <PaginationItem key={index} {...page}>
                  {page.value}
                </PaginationItem>
              ) : (
                <PaginationEllipsis key={index} index={index}>
                  &#8230;
                </PaginationEllipsis>
              )
            )
          }
        </PaginationContext>
        <PaginationNext />
      </Pagination>
    </Example>
  )
}

function PaginationSimple() {
  return (
    <Example title="Simple">
      <Pagination count={50} pageSize={10} siblingCount={1}>
        <PaginationPrevious />
        <PaginationContext>
          {(api) =>
            api.pages.map((page, index) =>
              page.type === "page" ? (
                <PaginationItem key={index} {...page}>
                  {page.value}
                </PaginationItem>
              ) : (
                <PaginationEllipsis key={index} index={index}>
                  &#8230;
                </PaginationEllipsis>
              )
            )
          }
        </PaginationContext>
        <PaginationNext />
      </Pagination>
    </Example>
  )
}

const rowsPerPageItems = createListCollection({
  items: [
    { label: "10", value: "10" },
    { label: "25", value: "25" },
    { label: "50", value: "50" },
    { label: "100", value: "100" },
  ],
})

function PaginationIconsOnly() {
  return (
    <Example title="With Select">
      <div className="flex items-center justify-between gap-4">
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
          <Select collection={rowsPerPageItems} defaultValue={["25"]}>
            <SelectControl className="w-20">
              <SelectTrigger id="select-rows-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectIndicator />
            </SelectControl>
            <SelectContent align="start">
              <SelectItemGroup>
                {rowsPerPageItems.items.map((item) => (
                  <SelectItem key={item.value} item={item}>
                    <SelectItemText>{item.label}</SelectItemText>
                    <SelectItemIndicator />
                  </SelectItemComponent>
                ))}
              </SelectItemGroup>
            </SelectContent>
          </Select>
        </Field>
        <Pagination count={100} pageSize={25} className="mx-0 w-auto">
          <PaginationPrevious />
          <PaginationNext />
        </Pagination>
      </div>
    </Example>
  )
}
