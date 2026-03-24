import {
  Checkbox,
  CheckboxControl,
  CheckboxGroup as CheckboxGroupPrimitive,
  CheckboxHiddenInput,
  CheckboxIndicator,
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
              <CheckboxControl>
                <CheckboxIndicator />
              </CheckboxControl>
              <CheckboxHiddenInput />
            </Checkbox>
            <FieldLabel
              htmlFor="finder-pref-hard-disks"
              className="font-normal"
            >
              Hard disks
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox value="external-disks" id="finder-pref-external-disks">
              <CheckboxControl>
                <CheckboxIndicator />
              </CheckboxControl>
              <CheckboxHiddenInput />
            </Checkbox>
            <FieldLabel
              htmlFor="finder-pref-external-disks"
              className="font-normal"
            >
              External disks
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox value="cds-dvds" id="finder-pref-cds-dvds">
              <CheckboxControl>
                <CheckboxIndicator />
              </CheckboxControl>
              <CheckboxHiddenInput />
            </Checkbox>
            <FieldLabel
              htmlFor="finder-pref-cds-dvds"
              className="font-normal"
            >
              CDs, DVDs, and iPods
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              value="connected-servers"
              id="finder-pref-connected-servers"
            >
              <CheckboxControl>
                <CheckboxIndicator />
              </CheckboxControl>
              <CheckboxHiddenInput />
            </Checkbox>
            <FieldLabel
              htmlFor="finder-pref-connected-servers"
              className="font-normal"
            >
              Connected servers
            </FieldLabel>
          </Field>
        </FieldGroup>
      </CheckboxGroupPrimitive>
    </FieldSet>
  )
}
