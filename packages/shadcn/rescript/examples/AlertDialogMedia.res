@react.component
let make = () =>
  <AlertDialog>
    <AlertDialog.Trigger
      className={Button.buttonVariants(~variant=Button.Variant.Outline)}
      type_="button"
    >
      {"Share Project"->React.string}
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Media>
          <Icons.CircleFadingPlus />
        </AlertDialog.Media>
        <AlertDialog.Title> {"Share this project?"->React.string} </AlertDialog.Title>
        <AlertDialog.Description>
          {"Anyone with the link will be able to view and edit this project."->React.string}
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel> {"Cancel"->React.string} </AlertDialog.Cancel>
        <AlertDialog.Action> {"Share"->React.string} </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog>
