@react.component
let make = () =>
  <div className="flex gap-2">
    <Checkbox id="terms">{React.null}</Checkbox>
    <Label htmlFor="terms">{"Accept terms and conditions"->React.string}</Label>
  </div>
