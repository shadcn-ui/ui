"use client"

import {
  CheckIcon,
  FileTextIcon,
  ImageIcon,
  SearchIcon,
  VideoIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/styles/base-sera/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/styles/base-sera/ui/card"
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

import { ASSETS, type Asset, type AssetType } from "../data"

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

export function AssetGrid({
  selectedId,
  onSelect,
}: {
  selectedId: string
  onSelect: (id: string) => void
}) {
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
      <CardContent>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {ASSETS.map((asset) => (
            <AssetGridItem
              key={asset.id}
              asset={asset}
              selected={asset.id === selectedId}
              onSelect={() => onSelect(asset.id)}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
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
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  )
}

function AssetGridItem({
  asset,
  selected,
  onSelect,
}: {
  asset: Asset
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="group flex flex-col gap-2.5 text-left outline-none focus-visible:[&>div:first-child]:ring-2 focus-visible:[&>div:first-child]:ring-ring"
    >
      <div
        className={cn(
          "relative flex aspect-4/3 items-center justify-center bg-muted/60 ring-1 ring-border/70 transition-shadow ring-inset group-hover:ring-foreground/40",
          selected && "ring-2 ring-foreground group-hover:ring-foreground"
        )}
      >
        {selected ? (
          <div className="absolute top-2 left-2 flex size-5 items-center justify-center bg-foreground text-background">
            <CheckIcon className="size-3" />
          </div>
        ) : null}
        <Badge
          variant="outline"
          className="absolute top-2 right-2 border bg-background px-2 py-1 text-[0.625rem]"
        >
          {asset.type}
        </Badge>
        {asset.duration ? (
          <Badge className="absolute bottom-2 left-2 bg-foreground px-2 py-1 text-background">
            {asset.duration}
          </Badge>
        ) : null}
        <AssetTypeIcon
          type={asset.type}
          className="size-7 text-muted-foreground/60"
        />
      </div>
      <div className="flex flex-col gap-0.5 px-0.5">
        <p className="line-clamp-1 text-sm font-medium">{asset.name}</p>
        <p className="text-[0.625rem] font-semibold tracking-wider text-muted-foreground uppercase">
          {asset.date} · {asset.size}
        </p>
      </div>
    </button>
  )
}
