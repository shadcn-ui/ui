import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/default/ui/pagination"

export default function PaginationDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationPrevious href="#" />
        <PaginationLink href="#">1</PaginationLink>
        <PaginationLink href="#" isActive>2</PaginationLink>
        <PaginationLink href="#">3</PaginationLink>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationNext href="#" />
      </PaginationContent>
    </Pagination>
  )
}
