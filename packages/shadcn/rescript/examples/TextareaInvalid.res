@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@react.component
let make = () =>
  <Field dataInvalid=true>
    <Field.Label htmlFor="textarea-invalid"> {"Message"->React.string} </Field.Label>
    <textarea
      id="textarea-invalid"
      placeholder="Type your message here."
      dataSlot="textarea"
      ariaInvalid=#"true"
      className="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm"
    >
      {React.null}
    </textarea>
    <Field.Description> {"Please enter a valid message."->React.string} </Field.Description>
  </Field>
