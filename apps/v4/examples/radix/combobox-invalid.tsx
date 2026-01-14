import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/examples/radix/ui/combobox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/examples/radix/ui/field"
import { Select } from "@/examples/radix/ui/select"

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const

export function ComboboxInvalid() {
  return (
    <div className="flex flex-col gap-4">
      <Combobox items={frameworks}>
        <ComboboxInput placeholder="Select a framework" aria-invalid="true" />
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
      <Field data-invalid>
        <FieldLabel htmlFor="combobox-framework-invalid">Framework</FieldLabel>
        <Combobox items={frameworks}>
          <ComboboxInput
            id="combobox-framework-invalid"
            placeholder="Select a framework"
            aria-invalid
          />
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
        <FieldDescription>Please select a valid framework.</FieldDescription>
        <FieldError errors={[{ message: "This field is required." }]} />
      </Field>
    </div>
  )
}
