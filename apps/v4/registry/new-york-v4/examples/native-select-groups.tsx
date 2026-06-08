import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/registry/new-york-v4/ui/native-select"

export default function NativeSelectGroups() {
  return (
    <NativeSelect>
      <NativeSelectOption value="">Select department</NativeSelectOption>
      <NativeSelectOptGroup label="Engineering">
        <NativeSelectOption value="frontend">Frontend</NativeSelectOption>
        <NativeSelectOption value="backend">Backend</NativeSelectOption>
        <NativeSelectOption value="devops">DevOps</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Sales">
        <NativeSelectOption value="sales-rep">Sales Rep</NativeSelectOption>
        <NativeSelectOption value="account-manager">
          Account Manager
        </NativeSelectOption>
        <NativeSelectOption value="sales-director">
          Sales Director
        </NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Operations">
        <NativeSelectOption value="support">
          Customer Support
        </NativeSelectOption>
        <NativeSelectOption value="product-manager">
          Product Manager
        </NativeSelectOption>
        <NativeSelectOption value="ops-manager">
          Operations Manager
        </NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  )
}
