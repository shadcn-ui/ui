@react.component
let make = () =>
  <Field.Group className="mx-auto w-56">
    <Field orientation=BaseUi.Types.Orientation.Horizontal dataInvalid={true}>
      <Checkbox
        id="terms-checkbox-invalid"
        name="terms-checkbox-invalid"
        ariaInvalid={true}
      />
      <Field.Label htmlFor="terms-checkbox-invalid">
        {"Accept terms and conditions"->React.string}
      </Field.Label>
    </Field>
  </Field.Group>
