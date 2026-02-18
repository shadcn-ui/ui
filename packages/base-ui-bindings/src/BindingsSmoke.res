let _dialog = <Dialog.Root open_=true> {React.null} </Dialog.Root>
let _alertDialog = <AlertDialog.Root open_=false> {React.null} </AlertDialog.Root>
let _button = <Button> {React.string("Click")} </Button>
let _checkbox =
  <Checkbox.Root checked={Types.CheckedState.Checked(true)}> {React.null} </Checkbox.Root>
let _menu = <Menu.Root open_=true> {React.null} </Menu.Root>
let _select = <Select.Root value="one"> {React.null} </Select.Root>
let _tooltip = <Tooltip.Root open_=true> {React.null} </Tooltip.Root>
let _switch = <Switch.Root checked={Types.CheckedState.Checked(false)}> {React.null} </Switch.Root>
let _toggleGroup = <ToggleGroup value="a"> {React.null} </ToggleGroup>
let _scrollArea = <ScrollArea.Root> {React.null} </ScrollArea.Root>

let _rendered = Render.use({defaultTagName: "div"})

@react.component
let make = () => {
  let _direction = DirectionProvider.useDirection()
  React.null
}
