@react.component
let make = () =>
  <Field.Set>
    <Field.Legend dataVariant=Field.Variant.Label>
      {"Show these items on the desktop:"->React.string}
    </Field.Legend>
    <Field.Description>
      {"Select the items you want to show on the desktop."->React.string}
    </Field.Description>
    <Field.Group className="gap-3">
      <Field orientation=BaseUi.Types.Orientation.Horizontal>
        <Checkbox
          id="finder-pref-9k2-hard-disks-ljj-checkbox"
          name="finder-pref-9k2-hard-disks-ljj-checkbox"
          defaultChecked=true
        />
        <Field.Label htmlFor="finder-pref-9k2-hard-disks-ljj-checkbox" className="font-normal">
          {"Hard disks"->React.string}
        </Field.Label>
      </Field>
      <Field orientation=BaseUi.Types.Orientation.Horizontal>
        <Checkbox
          id="finder-pref-9k2-external-disks-1yg-checkbox"
          name="finder-pref-9k2-external-disks-1yg-checkbox"
          defaultChecked=true
        />
        <Field.Label
          htmlFor="finder-pref-9k2-external-disks-1yg-checkbox"
          className="font-normal"
        >
          {"External disks"->React.string}
        </Field.Label>
      </Field>
      <Field orientation=BaseUi.Types.Orientation.Horizontal>
        <Checkbox
          id="finder-pref-9k2-cds-dvds-fzt-checkbox"
          name="finder-pref-9k2-cds-dvds-fzt-checkbox"
        />
        <Field.Label htmlFor="finder-pref-9k2-cds-dvds-fzt-checkbox" className="font-normal">
          {"CDs, DVDs, and iPods"->React.string}
        </Field.Label>
      </Field>
      <Field orientation=BaseUi.Types.Orientation.Horizontal>
        <Checkbox
          id="finder-pref-9k2-connected-servers-6l2-checkbox"
          name="finder-pref-9k2-connected-servers-6l2-checkbox"
        />
        <Field.Label
          htmlFor="finder-pref-9k2-connected-servers-6l2-checkbox"
          className="font-normal"
        >
          {"Connected servers"->React.string}
        </Field.Label>
      </Field>
    </Field.Group>
  </Field.Set>
