import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select"

export default function SelectControlled() {
  const [animal, setAnimal] = React.useState<string | undefined>()

  return (
    <Select value={animal} onValueChange={setAnimal}>
      <SelectTrigger className="w-[180px]">
        <SelectValue aria-label={animal} placeholder="Select an animal">
          {animal}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Animals</SelectLabel>
          <SelectItem value="cat">Cat</SelectItem>
          <SelectItem value="dog">Dog</SelectItem>
          <SelectItem value="rabbit">Rabbit</SelectItem>
          <SelectItem value="bird">Bird</SelectItem>
          <SelectItem value="horse">Horse</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
