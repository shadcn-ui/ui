@react.component
let make = () =>
  <ButtonGroup>
    <ButtonGroup>
      <Button variant=Button.Variant.Outline size=Button.Size.Icon>
        <Icons.Plus />
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      <InputGroup>
        <InputGroup.Input placeholder="Send a message..." />
        <Tooltip>
          <Tooltip.Trigger
            render={
              <InputGroup.Addon
                dataAlign=InputGroup.DataAlign.InlineEnd
                dataSlot="tooltip-trigger"
              />
            }>
            <Icons.AudioLines />
          </Tooltip.Trigger>
          <Tooltip.Content> {"Voice Mode"->React.string} </Tooltip.Content>
        </Tooltip>
      </InputGroup>
    </ButtonGroup>
  </ButtonGroup>
