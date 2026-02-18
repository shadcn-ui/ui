@react.component
let make = () =>
  <RadioGroup defaultValue="comfortable" className="w-fit">
    <div className="flex items-center gap-3">
      <RadioGroup.Item value="default" id="r1"> {React.null} </RadioGroup.Item>
      <Label htmlFor="r1"> {"Default"->React.string} </Label>
    </div>
    <div className="flex items-center gap-3">
      <RadioGroup.Item value="comfortable" id="r2"> {React.null} </RadioGroup.Item>
      <Label htmlFor="r2"> {"Comfortable"->React.string} </Label>
    </div>
    <div className="flex items-center gap-3">
      <RadioGroup.Item value="compact" id="r3"> {React.null} </RadioGroup.Item>
      <Label htmlFor="r3"> {"Compact"->React.string} </Label>
    </div>
  </RadioGroup>
