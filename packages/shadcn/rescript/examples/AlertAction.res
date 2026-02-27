@react.component
let make = () =>
  <Alert className="max-w-md">
    <Alert.Title> {"Dark mode is now available"->React.string} </Alert.Title>
    <Alert.Description>
      {"Enable it under your profile settings to get started."->React.string}
    </Alert.Description>
    <Alert.Action>
      <Button size=Button.Size.Xs variant=Button.Variant.Default> {"Enable"->React.string} </Button>
    </Alert.Action>
  </Alert>
