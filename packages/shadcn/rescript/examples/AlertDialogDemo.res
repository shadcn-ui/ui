@react.component
let make = () =>
  <AlertDialog>
    <AlertDialog.Trigger render={<Button variant=Button.Variant.Outline />}>
      {"Show Dialog"->React.string}
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title> {"Are you absolutely sure?"->React.string} </AlertDialog.Title>
        <AlertDialog.Description>
          {"This action cannot be undone. This will permanently delete your account from our servers."->React.string}
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel> {"Cancel"->React.string} </AlertDialog.Cancel>
        <AlertDialog.Action> {"Continue"->React.string} </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog>
