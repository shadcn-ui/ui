import { Button } from "@/examples/radix/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/examples/radix/ui/combobox"
import { Input } from "@/examples/radix/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/examples/radix/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/radix/ui/select"
import { ChevronDownIcon } from "lucide-react"

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const

export function ComboboxWithOtherInputs() {
  return (
    <>
      <Combobox items={frameworks}>
        <ComboboxInput placeholder="Select a framework" className="w-52" />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Select>
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Select a framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {frameworks.map((framework) => (
              <SelectItem key={framework} value={framework}>
                {framework}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        className="text-muted-foreground w-52 justify-between font-normal"
      >
        Select a framework
        <ChevronDownIcon />
      </Button>
      <Input placeholder="Select a framework" className="w-52" />
      <InputGroup className="w-52">
        <InputGroupInput placeholder="Select a framework" />
        <InputGroupAddon align="inline-end">
          <ChevronDownIcon />
        </InputGroupAddon>
      </InputGroup>
    </>
  )
}
