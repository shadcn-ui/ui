import * as React from "react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/registry/default/ui/command"

const cats = ["Siamese", "British Shorthair", "Maine Coon", "Persian", "Ragdoll", "Sphynx"]
const dogs = ["German Shepherd", "Bulldog", "Labrador Retriever", "Golden Retriever", "French Bulldog", "Siberian Husky"]

const mockApiSearch = (searchQuery: string): string[] => {
  const lookingForCats = searchQuery.includes("cat")
  const lookingForDogs = searchQuery.includes("dog")
  if (lookingForCats && lookingForDogs) {
    return [...cats, ...dogs]
  } else if (lookingForCats) {
    return cats
  } else if (lookingForDogs) {
    return dogs
  } else {
    return []
  }
}

export default function CommandCustomFiltering() {
  const [commandInput, setCommandInput] = React.useState<string>("")
  const [results, setResults] = React.useState<string[]>([])
  React.useEffect(() => {
    setResults(mockApiSearch(commandInput))
  }, [commandInput])

  return (
    <Command className="rounded-lg border shadow-md" shouldFilter={false}>
      <CommandInput placeholder="Type 'cat' or 'dog'..." value={commandInput} onValueChange={setCommandInput} />
      <CommandList>
        <CommandEmpty>{ commandInput === "" ? "Start typing to load results": "No results found." }</CommandEmpty>
        <CommandGroup>
          {
            results.map((result: string) => <CommandItem key={result} value={result}>
              { result }
            </CommandItem>)
          }
        </CommandGroup>
      </CommandList>
    </Command>
  )
}