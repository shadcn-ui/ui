@react.component
let make = () =>
  <Field>
    <Field.Label htmlFor="textarea-message"> {"Message"->React.string} </Field.Label>
    <Field.Description> {"Enter your message below."->React.string} </Field.Description>
    <Textarea id="textarea-message" placeholder="Type your message here."> {React.null} </Textarea>
  </Field>
