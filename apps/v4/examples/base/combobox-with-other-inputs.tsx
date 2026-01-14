import { Button } from "@/examples/base/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/examples/base/ui/combobox"
import { Input } from "@/examples/base/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/examples/base/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/base/ui/select"
import { ChevronDownIcon } from "lucide-react"

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const

const items = [
  {
    label: "Select a framework",
    value: null,
  },
  {
    label: "React",
    value: "react",
  },
  {
    label: "Vue",
    value: "vue",
  },
  {
    label: "Angular",
    value: "angular",
  },
  {
    label: "Svelte",
    value: "svelte",
  },
  {
    label: "Solid",
    value: "solid",
  },
  {
    label: "Preact",
    value: "preact",
  },
  {
    label: "Next.js",
    value: "next.js",
  },
]

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
      <Select items={items}>
        <SelectTrigger className="w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
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
