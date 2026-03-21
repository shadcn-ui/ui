import {
  Checkbox,
  CheckboxControl,
  CheckboxGroup as CheckboxGroupPrimitive,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/examples/ark/ui/checkbox"
import {
  FieldDescription,
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
        className="flex flex-col gap-3"
      >
        <Checkbox value="hard-disks">
          <CheckboxControl>
            <CheckboxIndicator />
          </CheckboxControl>
          <CheckboxLabel className="font-normal">Hard disks</CheckboxLabel>
          <CheckboxHiddenInput />
        </Checkbox>
        <Checkbox value="external-disks">
          <CheckboxControl>
            <CheckboxIndicator />
          </CheckboxControl>
          <CheckboxLabel className="font-normal">External disks</CheckboxLabel>
          <CheckboxHiddenInput />
        </Checkbox>
        <Checkbox value="cds-dvds">
          <CheckboxControl>
            <CheckboxIndicator />
          </CheckboxControl>
          <CheckboxLabel className="font-normal">
            CDs, DVDs, and iPods
          </CheckboxLabel>
          <CheckboxHiddenInput />
        </Checkbox>
        <Checkbox value="connected-servers">
          <CheckboxControl>
            <CheckboxIndicator />
          </CheckboxControl>
          <CheckboxLabel className="font-normal">
            Connected servers
          </CheckboxLabel>
          <CheckboxHiddenInput />
        </Checkbox>
      </CheckboxGroupPrimitive>
    </FieldSet>
  )
}
