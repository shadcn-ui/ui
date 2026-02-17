@@directive("'use client'")

@react.component
let make = () =>
  <Field.Group className="max-w-sm">
    <Field orientation=BaseUi.Types.Orientation.Horizontal>
      <Checkbox id="terms-checkbox" name="terms-checkbox">{React.null}</Checkbox>
      <Label htmlFor="terms-checkbox">{"Accept terms and conditions"->React.string}</Label>
    </Field>
    <Field orientation=BaseUi.Types.Orientation.Horizontal>
      <Checkbox id="terms-checkbox-2" name="terms-checkbox-2" defaultChecked=true>
        {React.null}
      </Checkbox>
      <Field.Content>
        <Field.Label htmlFor="terms-checkbox-2">{"Accept terms and conditions"->React.string}</Field.Label>
        <Field.Description>
          {"By clicking this checkbox, you agree to the terms."->React.string}
        </Field.Description>
      </Field.Content>
    </Field>
    <Field orientation=BaseUi.Types.Orientation.Horizontal dataDisabled=true>
      <Checkbox id="toggle-checkbox" name="toggle-checkbox" disabled=true>{React.null}</Checkbox>
      <Field.Label htmlFor="toggle-checkbox">{"Enable notifications"->React.string}</Field.Label>
    </Field>
    <Field.Label>
      <Field orientation=BaseUi.Types.Orientation.Horizontal>
        <Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2">{React.null}</Checkbox>
        <Field.Content>
          <Field.Title>{"Enable notifications"->React.string}</Field.Title>
          <Field.Description>
            {"You can enable or disable notifications at any time."->React.string}
          </Field.Description>
        </Field.Content>
      </Field>
    </Field.Label>
  </Field.Group>
