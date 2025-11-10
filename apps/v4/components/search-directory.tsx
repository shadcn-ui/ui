import * as React from "react"
import { Search, X } from "lucide-react"

import { useSearchRegistry } from "@/hooks/use-search-registry"
import { Field } from "@/registry/new-york-v4/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/new-york-v4/ui/input-group"

export const SearchDirectory = () => {
  const { query, setQuery } = useSearchRegistry()

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value === "" ? null : value)
  }

  return (
    <Field>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search directory by name..."
          value={query ?? ""}
          onChange={onQueryChange}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Clear"
            title="Clear"
            size="icon-xs"
            onClick={() => setQuery(null)}
          >
            {query?.length > 0 && <X />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
