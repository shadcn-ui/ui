@react.component
let make = () =>
  <Alert className="max-w-md">
    <Icons.CheckCircle2 />
    <Alert.Title> {"Account updated successfully"->React.string} </Alert.Title>
    <Alert.Description>
      {"Your profile information has been saved. Changes will be reflected immediately."->React.string}
    </Alert.Description>
  </Alert>
