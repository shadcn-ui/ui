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
    setQuery(value)
  }

  return (
    <Field>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search"
          value={query}
          onChange={onQueryChange}
        />
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
