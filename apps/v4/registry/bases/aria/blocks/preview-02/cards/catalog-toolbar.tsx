"use client"

import { Button } from "@/registry/bases/aria/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/bases/aria/ui/input-group"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/aria/ui/toggle-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function CatalogToolbar() {
  return (
    <div className="flex items-center gap-3">
      <InputGroup className="flex-1">
        <InputGroupAddon>
          <IconPlaceholder
            lucide="SearchIcon"
            tabler="IconSearch"
            hugeicons="Search01Icon"
            phosphor="MagnifyingGlassIcon"
            remixicon="RiSearchLine"
          />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search releases or catalog..." />
      </InputGroup>
      <Button>
        <IconPlaceholder
          lucide="PlusIcon"
          tabler="IconPlus"
          hugeicons="Add01Icon"
          phosphor="PlusIcon"
          remixicon="RiAddLine"
        />
        Upload New Release
      </Button>
      <ToggleGroup defaultSelectedKeys={["releases"]} variant="outline">
        <ToggleGroupItem id="all-tracks">All Tracks</ToggleGroupItem>
        <ToggleGroupItem id="releases">Releases</ToggleGroupItem>
        <ToggleGroupItem id="top-earners">Top Earners</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
