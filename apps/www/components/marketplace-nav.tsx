"use client"

import { BookmarkFilledIcon, StarFilledIcon } from "@radix-ui/react-icons"
import { SlidersHorizontal } from "lucide-react"

import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/new-york/ui/toggle-group"

import { Icons } from "./icons"

interface MarketplaceNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MarketplaceNav({ className, ...props }: MarketplaceNavProps) {
  return (
    <div className="flex justify-between">
      <div className="flex max-w-lg items-center space-x-2">
        <Input type="search" placeholder="Search Components" />
        <Button type="submit">Search</Button>
        <Button variant="outline" className="w-16" size="icon">
          <SlidersHorizontal />
        </Button>
      </div>
      <div>
        <ToggleGroup className="space-x-1" type="multiple">
          <ToggleGroupItem
            variant={"outline"}
            className="w-10"
            value="bookmark"
          >
            <BookmarkFilledIcon />
          </ToggleGroupItem>
          <ToggleGroupItem variant={"outline"} className="w-10" value="star">
            <StarFilledIcon />
          </ToggleGroupItem>
          <ToggleGroupItem variant={"outline"} className="w-10" value="radix">
            <Icons.radix />
          </ToggleGroupItem>
          <ToggleGroupItem variant={"outline"} className="w-10" value="shadcn">
            <Icons.logo className="scale-150" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}