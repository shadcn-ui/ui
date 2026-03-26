import {
  Pagination,
  PaginationContext,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/examples/ark/ui/pagination"

export default function PaginationDemo() {
  return (
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
  )
}
