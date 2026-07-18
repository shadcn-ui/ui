"use client"

import { Label } from "@/registry/bases/base/ui/label"
import { SidebarInput } from "@/registry/bases/base/ui/sidebar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <div className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarInput
          id="search"
          placeholder="Type to search..."
          className="h-8 pl-7"
        />
        <IconPlaceholder
          lucide="SearchIcon"
          tabler="IconSearch"
          hugeicons="SearchIcon"
          phosphor="MagnifyingGlassIcon"
          remixicon="RiSearchLine"
          className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none"
        />
      </div>
    </form>
  )
}
