import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/registry/new-york-v4/ui/native-select"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"

export function NativeSelectDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="text-muted-foreground text-sm font-medium">
          Basic Select
        </div>
        <div className="flex flex-col gap-4">
          <NativeSelect>
            <NativeSelectOption value="">Select a fruit</NativeSelectOption>
            <NativeSelectOption value="apple">Apple</NativeSelectOption>
            <NativeSelectOption value="banana">Banana</NativeSelectOption>
            <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
            <NativeSelectOption value="grapes" disabled>
              Grapes
            </NativeSelectOption>
            <NativeSelectOption value="pineapple">Pineapple</NativeSelectOption>
          </NativeSelect>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes" disabled>
                Grapes
              </SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="text-muted-foreground text-sm font-medium">
          With Groups
        </div>
        <div className="flex flex-col gap-4">
          <NativeSelect>
            <NativeSelectOption value="">Select a food</NativeSelectOption>
            <NativeSelectOptGroup label="Fruits">
              <NativeSelectOption value="apple">Apple</NativeSelectOption>
              <NativeSelectOption value="banana">Banana</NativeSelectOption>
              <NativeSelectOption value="blueberry">
                Blueberry
              </NativeSelectOption>
            </NativeSelectOptGroup>
            <NativeSelectOptGroup label="Vegetables">
              <NativeSelectOption value="carrot">Carrot</NativeSelectOption>
              <NativeSelectOption value="broccoli">Broccoli</NativeSelectOption>
              <NativeSelectOption value="spinach">Spinach</NativeSelectOption>
            </NativeSelectOptGroup>
          </NativeSelect>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a food" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Vegetables</SelectLabel>
                <SelectItem value="carrot">Carrot</SelectItem>
                <SelectItem value="broccoli">Broccoli</SelectItem>
                <SelectItem value="spinach">Spinach</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="text-muted-foreground text-sm font-medium">
          Disabled State
        </div>
        <div className="flex flex-col gap-4">
          <NativeSelect disabled>
            <NativeSelectOption value="">Disabled</NativeSelectOption>
            <NativeSelectOption value="apple">Apple</NativeSelectOption>
            <NativeSelectOption value="banana">Banana</NativeSelectOption>
          </NativeSelect>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Disabled" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="text-muted-foreground text-sm font-medium">
          Error State
        </div>
        <div className="flex flex-col gap-4">
          <NativeSelect aria-invalid="true">
            <NativeSelectOption value="">Error state</NativeSelectOption>
            <NativeSelectOption value="apple">Apple</NativeSelectOption>
            <NativeSelectOption value="banana">Banana</NativeSelectOption>
          </NativeSelect>
          <Select>
            <SelectTrigger aria-invalid="true">
              <SelectValue placeholder="Error state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
