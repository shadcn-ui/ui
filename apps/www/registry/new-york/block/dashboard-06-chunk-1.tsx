import Image from "next/image"
import { MoreHorizontal } from "lucide-react"

import { Badge } from "@/registry/new-york/ui/badge"
import { Button } from "@/registry/new-york/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu"
import { TableCell, TableRow } from "@/registry/new-york/ui/table"

export default function Component() {
  return (
    <TableRow x-chunk="dashboard-06-chunk-1">
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src="/placeholder.svg"
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium">AeroGlow Desk Lamp</TableCell>
      <TableCell>
        <Badge variant="outline">Active</Badge>
      </TableCell>
      <TableCell>$39.99</TableCell>
      <TableCell className="hidden md:table-cell">50</TableCell>
      <TableCell className="hidden md:table-cell">
        2023-11-29 08:15 AM
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
