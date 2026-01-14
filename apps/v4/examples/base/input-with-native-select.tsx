import { Input } from "@/examples/base/ui/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/examples/base/ui/native-select"
import { Select } from "@/examples/base/ui/select"

export function InputWithNativeSelect() {
  return (
    <div className="flex w-full gap-2">
      <Input type="tel" placeholder="(555) 123-4567" className="flex-1" />
      <NativeSelect defaultValue="+1">
        <NativeSelectOption value="+1">+1</NativeSelectOption>
        <NativeSelectOption value="+44">+44</NativeSelectOption>
        <NativeSelectOption value="+46">+46</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
