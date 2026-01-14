import {
  NativeSelect,
  NativeSelectOption,
} from "@/examples/base/ui/native-select"

export function NativeSelectBasic() {
  return (
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
  )
}
