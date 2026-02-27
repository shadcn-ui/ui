@react.component
let make = () =>
  <Field.Group className="mx-auto w-56">
    <Field orientation=BaseUi.Types.Orientation.Horizontal>
      <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
      <Field.Label htmlFor="terms-checkbox-basic">
        {"Accept terms and conditions"->React.string}
      </Field.Label>
    </Field>
  </Field.Group>
