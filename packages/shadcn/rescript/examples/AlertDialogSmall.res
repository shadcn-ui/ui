@react.component
let make = () =>
  <AlertDialog>
    <AlertDialog.Trigger
      className={Button.buttonVariants(~variant=Button.Variant.Outline)}
      type_="button"
    >
      {"Show Dialog"->React.string}
    </AlertDialog.Trigger>
    <AlertDialog.Content dataSize=AlertDialog.Size.Sm>
      <AlertDialog.Header>
        <AlertDialog.Title> {"Allow accessory to connect?"->React.string} </AlertDialog.Title>
        <AlertDialog.Description>
          {"Do you want to allow the USB accessory to connect to this device?"->React.string}
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel> {"Don't allow"->React.string} </AlertDialog.Cancel>
        <AlertDialog.Action> {"Allow"->React.string} </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog>
