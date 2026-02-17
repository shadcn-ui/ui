@react.component
let make = () =>
  <div className="flex items-center space-x-2">
    <Switch id="airplane-mode">{React.null}</Switch>
    <Label htmlFor="airplane-mode">{"Airplane Mode"->React.string}</Label>
  </div>
