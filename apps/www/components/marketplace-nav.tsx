"use client"

import { usePathname } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"

import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"

import { Icons } from "./icons"
import { ToggleGroup, ToggleGroupItem } from "@/registry/new-york/ui/toggle-group"

interface MarketplaceNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MarketplaceNav({ className, ...props }: MarketplaceNavProps) {
  const pathname = usePathname()

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
        <ToggleGroup  className="space-x-1" type="multiple">
          <ToggleGroupItem variant={"outline"} className="w-10" value="react">
            <Icons.react className="w-8"/>
          </ToggleGroupItem>
          <ToggleGroupItem variant={"outline"} className="w-10" value="remix">
            <Icons.remix className="w-8"/>
          </ToggleGroupItem>
          <ToggleGroupItem variant={"outline"} className="w-10" value="nextjs">
            <Icons.nextjs className="w-8"/>
          </ToggleGroupItem>
          <ToggleGroupItem variant={"outline"} className="w-10" value="astro">
            <Icons.astro className="w-8"/>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}

interface MarketplaceCodeLinkProps {
  pathname: string | null
}
