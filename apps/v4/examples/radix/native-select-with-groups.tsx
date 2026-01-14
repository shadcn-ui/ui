import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/examples/radix/ui/native-select"

export function NativeSelectWithGroups() {
  return (
    <NativeSelect>
      <NativeSelectOption value="">Select a food</NativeSelectOption>
      <NativeSelectOptGroup label="Fruits">
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
        <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Vegetables">
        <NativeSelectOption value="carrot">Carrot</NativeSelectOption>
        <NativeSelectOption value="broccoli">Broccoli</NativeSelectOption>
        <NativeSelectOption value="spinach">Spinach</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  )
}
