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
          <SelectItem value="Cat">Cat</SelectItem>
          <SelectItem value="Dog">Dog</SelectItem>
          <SelectItem value="Rabbit">Rabbit</SelectItem>
          <SelectItem value="Bird">Bird</SelectItem>
          <SelectItem value="Horse">Horse</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
