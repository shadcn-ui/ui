"use client"

import { Search, X } from "lucide-react"

import { Field } from "@/styles/base-nova/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/styles/base-nova/ui/input-group"

export function SearchDirectory({
  query,
  registriesCount,
  setQuery,
}: {
  query: string
  registriesCount: number
  setQuery: (value: string | null) => void
}) {
  return (
    <Field>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          className="h-full"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <span className="text-muted-foreground tabular-nums sm:text-xs">
            {registriesCount}{" "}
            {registriesCount === 1 ? "registry" : "registries"}
          </span>
        </InputGroupAddon>
        <InputGroupAddon
          align="inline-end"
          data-disabled={!query.length}
          className="data-[disabled=true]:hidden"
        >
          <InputGroupButton
            aria-label="Clear"
            title="Clear"
            size="icon-xs"
            onClick={() => setQuery(null)}
          >
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
