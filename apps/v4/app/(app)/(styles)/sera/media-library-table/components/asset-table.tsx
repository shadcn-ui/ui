"use client"

import * as React from "react"
import {
  FileTextIcon,
  ImageIcon,
  MoreVerticalIcon,
  SearchIcon,
  VideoIcon,
} from "lucide-react"

import { Badge } from "@/styles/base-sera/ui/badge"
import { Button } from "@/styles/base-sera/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/styles/base-sera/ui/card"
import { Checkbox } from "@/styles/base-sera/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/styles/base-sera/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/styles/base-sera/ui/input-group"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/styles/base-sera/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/styles/base-sera/ui/table"

import { ASSETS, type AssetType } from "../../media-library/data"

function AssetTypeIcon({
  type,
  className,
}: {
  type: AssetType
  className?: string
}) {
  if (type === "MP4") {
    return <VideoIcon className={className} />
  }

  if (type === "PDF") {
    return <FileTextIcon className={className} />
  }

  return <ImageIcon className={className} />
}

export function AssetTable() {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(
    new Set(["1"])
  )

  const toggleSelection = React.useCallback((id: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <InputGroup className="w-full">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search files, tags, or metadata..." />
        </InputGroup>
      </CardHeader>
      <CardContent className="px-0 py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 pl-6" aria-label="Select" />
              <TableHead className="w-20" aria-label="Preview" />
              <TableHead>Filename</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dimensions</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-10 pr-6" aria-label="Actions" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {ASSETS.map((asset) => {
              const isSelected = selectedIds.has(asset.id)

              return (
                <TableRow
                  key={asset.id}
                  data-state={isSelected ? "selected" : undefined}
                  className="cursor-pointer"
                  onClick={() => toggleSelection(asset.id)}
                >
                  <TableCell className="pl-6">
                    <Checkbox
                      checked={isSelected}
                      aria-label={`Select ${asset.name}`}
                      onClick={(event) => event.stopPropagation()}
                      onCheckedChange={() => toggleSelection(asset.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="relative flex aspect-4/3 w-16 items-center justify-center bg-muted/60 ring-1 ring-border/70 ring-inset">
                      {asset.duration ? (
                        <span className="absolute right-1 bottom-1 bg-foreground/90 px-1 text-[0.5rem] font-semibold tracking-wider text-background">
                          {asset.duration}
                        </span>
                      ) : null}
                      <AssetTypeIcon
                        type={asset.type}
                        className="size-4 text-muted-foreground/60"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-foreground">
                    {asset.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border px-2 py-0.5 text-[0.625rem]"
                    >
                      {asset.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{asset.dimensions}</TableCell>
                  <TableCell className="text-sm">{asset.size}</TableCell>
                  <TableCell>{asset.uploadedBy}</TableCell>
                  <TableCell className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {asset.date}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon-xs" />}
                        aria-label={`Open actions for ${asset.name}`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <MoreVerticalIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Preview</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-center py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" text="" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" text="" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  )
}
