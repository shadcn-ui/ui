import {
  Checkbox,
  CheckboxGroup as CheckboxGroupPrimitive,
} from "@/examples/ark/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/examples/ark/ui/field"

export function CheckboxGroup() {
  return (
    <FieldSet>
      <FieldLegend variant="label">
        Show these items on the desktop:
      </FieldLegend>
      <FieldDescription>
        Select the items you want to show on the desktop.
      </FieldDescription>
      <CheckboxGroupPrimitive
        defaultValue={["hard-disks", "external-disks"]}
        name="finder-pref"
      >
        <FieldGroup className="gap-3">
          <Field orientation="horizontal">
            <Checkbox value="hard-disks" id="finder-pref-hard-disks">
              Hard disks
            </Checkbox>
          </Field>
          <Field orientation="horizontal">
            <Checkbox value="external-disks" id="finder-pref-external-disks">
              External disks
            </Checkbox>
          </Field>
          <Field orientation="horizontal">
            <Checkbox value="cds-dvds" id="finder-pref-cds-dvds">
              CDs, DVDs, and iPods
            </Checkbox>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              value="connected-servers"
              id="finder-pref-connected-servers"
            >
              Connected servers
            </Checkbox>
          </Field>
        </FieldGroup>
      </CheckboxGroupPrimitive>
    </FieldSet>
  )
}
