@react.component
let make = () =>
  <Field dataDisabled=true>
    <Field.Label htmlFor="textarea-disabled"> {"Message"->React.string} </Field.Label>
    <Textarea id="textarea-disabled" placeholder="Type your message here." disabled=true>
      {React.null}
    </Textarea>
  </Field>
