import * as React from "react"
import { Search } from "lucide-react"

import registries from "@/registry/directory.json"
import { Field } from "@/registry/new-york-v4/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/new-york-v4/ui/input-group"

type SearchDirectoryProps = {
  setRegistries: React.Dispatch<React.SetStateAction<typeof registries>>
}

export const SearchDirectory = ({ setRegistries }: SearchDirectoryProps) => {
  const onQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    const queriedRegiesties = registries.filter((registry) =>
      registry.name
        .toLowerCase()
        .replaceAll("@", "")
        .includes(value.toLowerCase())
    )

    setRegistries(queriedRegiesties)
  }

  return (
    <Field>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search directory by name..."
          onChange={onQueryChange}
        />
      </InputGroup>
    </Field>
  )
}
