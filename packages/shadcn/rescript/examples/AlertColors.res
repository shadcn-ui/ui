@react.component
let make = () =>
  <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
    <Icons.AlertTriangle />
    <Alert.Title> {"Your subscription will expire in 3 days."->React.string} </Alert.Title>
    <Alert.Description>
      {"Renew now to avoid service interruption or upgrade to a paid plan to continue using the service."->React.string}
    </Alert.Description>
  </Alert>
