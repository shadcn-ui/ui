import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/examples/radix/ui/combobox"
import { Item } from "@/examples/radix/ui/item"

const largeListItems = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`)

export function ComboboxLargeList() {
  return (
    <Combobox items={largeListItems}>
      <ComboboxInput placeholder="Search from 100 items" />
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
  )
}
