@react.component
let make = () =>
  <Field.Group className="mx-auto w-72">
    <Field orientation=BaseUi.Types.Orientation.Horizontal>
      <Checkbox
        id="terms-checkbox-desc"
        name="terms-checkbox-desc"
        defaultChecked=BaseUi.Types.CheckedState.Checked(true)
      />
      <Field.Content>
        <Field.Label htmlFor="terms-checkbox-desc">
          {"Accept terms and conditions"->React.string}
        </Field.Label>
        <Field.Description>
          {"By clicking this checkbox, you agree to the terms and conditions."->React.string}
        </Field.Description>
      </Field.Content>
    </Field>
  </Field.Group>
