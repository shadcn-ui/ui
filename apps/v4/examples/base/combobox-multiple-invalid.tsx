import * as React from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/examples/base/ui/combobox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/examples/base/ui/field"
import { Select } from "@/examples/base/ui/select"

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

export function ComboboxMultipleInvalid() {
  const anchor1 = useComboboxAnchor()
  const anchor2 = useComboboxAnchor()

  return (
    <div className="flex flex-col gap-4">
      <Combobox
        multiple
        autoHighlight
        items={frameworks}
        defaultValue={[frameworks[0], frameworks[1]]}
      >
        <ComboboxChips ref={anchor1}>
          <ComboboxValue>
            {(values) => (
              <React.Fragment>
                {values.map((value: string) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput aria-invalid="true" />
              </React.Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor1}>
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
        <FieldLabel htmlFor="combobox-multiple-invalid">Frameworks</FieldLabel>
        <Combobox
          multiple
          autoHighlight
          items={frameworks}
          defaultValue={[frameworks[0], frameworks[1], frameworks[2]]}
        >
          <ComboboxChips ref={anchor2}>
            <ComboboxValue>
              {(values) => (
                <React.Fragment>
                  {values.map((value: string) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput
                    id="combobox-multiple-invalid"
                    aria-invalid
                  />
                </React.Fragment>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor2}>
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
        <FieldDescription>
          Please select at least one framework.
        </FieldDescription>
        <FieldError errors={[{ message: "This field is required." }]} />
      </Field>
    </div>
  )
}
