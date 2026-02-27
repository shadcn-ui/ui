@react.component
let make = () =>
  <Field.Group className="mx-auto w-56">
    <Field orientation=BaseUi.Types.Orientation.Horizontal dataDisabled={true}>
      <Checkbox
        id="toggle-checkbox-disabled"
        name="toggle-checkbox-disabled"
        disabled={true}
      />
      <Field.Label htmlFor="toggle-checkbox-disabled">
        {"Enable notifications"->React.string}
      </Field.Label>
    </Field>
  </Field.Group>
