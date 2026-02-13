let _dialog = <Dialog.Root open_=true />
let _alertDialog = <AlertDialog.Root open_=false />
let _button = <Button> {React.string("Click")} </Button>
let _checkbox = <Checkbox.Root checked={Types.CheckedState.Checked(true)} />
let _menu = <Menu.Root open_=true />
let _select = <Select.Root value="one" />
let _tooltip = <Tooltip.Root open_=true />
let _switch = <Switch.Root checked={Types.CheckedState.Checked(false)} />
let _toggleGroup = <ToggleGroup value="a" />
let _scrollArea = <ScrollArea.Root />

let _rendered = UseRender.useRender(~defaultTagName="div", ())

@react.component
let make = () => {
  let _direction = DirectionProvider.useDirection()
  React.null
}
