import { Checkbox } from "@/examples/base/ui/checkbox"
import { Field, FieldLabel } from "@/examples/base/ui/field"

export function CheckboxGroup() {
  return (
    <Field>
      <FieldLabel>Show these items on the desktop:</FieldLabel>
      <Field orientation="horizontal">
        <Checkbox id="finder-pref-9k2-hard-disks-ljj" />
        <FieldLabel
          htmlFor="finder-pref-9k2-hard-disks-ljj"
          className="font-normal"
        >
          Hard disks
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="finder-pref-9k2-external-disks-1yg" />
        <FieldLabel
          htmlFor="finder-pref-9k2-external-disks-1yg"
          className="font-normal"
        >
          External disks
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="finder-pref-9k2-cds-dvds-fzt" />
        <FieldLabel
          htmlFor="finder-pref-9k2-cds-dvds-fzt"
          className="font-normal"
        >
          CDs, DVDs, and iPods
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="finder-pref-9k2-connected-servers-6l2" />
        <FieldLabel
          htmlFor="finder-pref-9k2-connected-servers-6l2"
          className="font-normal"
        >
          Connected servers
        </FieldLabel>
      </Field>
    </Field>
  )
}
