import {
  NativeSelect,
  NativeSelectOption,
} from "@/examples/radix/ui/native-select"

export function NativeSelectSizes() {
  return (
    <div className="flex flex-col gap-4">
      <NativeSelect size="sm">
        <NativeSelectOption value="">Select a fruit</NativeSelectOption>
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
        <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
      </NativeSelect>
      <NativeSelect size="default">
        <NativeSelectOption value="">Select a fruit</NativeSelectOption>
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
        <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
