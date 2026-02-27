@react.component
let make = () =>
  <AlertDialog>
    <AlertDialog.Trigger
      className={Button.buttonVariants(~variant=Button.Variant.Destructive)}
      type_="button"
    >
      {"Delete Chat"->React.string}
    </AlertDialog.Trigger>
    <AlertDialog.Content dataSize=AlertDialog.Size.Sm>
      <AlertDialog.Header>
        <AlertDialog.Media className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
          <Icons.Trash2 />
        </AlertDialog.Media>
        <AlertDialog.Title> {"Delete chat?"->React.string} </AlertDialog.Title>
        <AlertDialog.Description>
          {"This will permanently delete this chat conversation. View "->React.string}
          <a href="#"> {"Settings"->React.string} </a>
          {" delete any memories saved during this chat."->React.string}
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel dataVariant=AlertDialog.Variant.Outline>
          {"Cancel"->React.string}
        </AlertDialog.Cancel>
        <AlertDialog.Action variant=AlertDialog.Variant.Destructive>
          {"Delete"->React.string}
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog>
