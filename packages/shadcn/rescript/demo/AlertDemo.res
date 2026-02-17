@react.component
let make = () =>
  <div className="grid w-full max-w-md items-start gap-4">
    <Alert>
      <Icons.CheckCircle2 />
      <Alert.Title>{"Payment successful"->React.string}</Alert.Title>
      <Alert.Description>
        {"Your payment of $29.99 has been processed. A receipt has been sent to your email address."
        ->React.string}
      </Alert.Description>
    </Alert>
    <Alert>
      <Icons.Info />
      <Alert.Title>{"New feature available"->React.string}</Alert.Title>
      <Alert.Description>
        {"We've added dark mode support. You can enable it in your account settings."->React.string}
      </Alert.Description>
    </Alert>
  </div>
