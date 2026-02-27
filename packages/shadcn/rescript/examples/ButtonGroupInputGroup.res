@@directive("'use client'")

@react.component
let make = () => {
  let (voiceEnabled, setVoiceEnabled) = React.useState(() => false)
  let placeholder = switch voiceEnabled {
  | true => "Record and send audio..."
  | false => "Send a message..."
  }

  <ButtonGroup className="[--radius:9999rem]">
    <ButtonGroup>
      <Button variant=Button.Variant.Outline size=Button.Size.Icon>
        <Icons.Plus />
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      <InputGroup>
        <InputGroup.Input placeholder disabled=voiceEnabled />
        <InputGroup.Addon dataAlign=InputGroup.DataAlign.InlineEnd>
          <Tooltip>
            <Tooltip.Trigger
              render={
                <InputGroup.Button
                  onClick={_ => setVoiceEnabled(value => !value)}
                  dataSize=InputGroup.Size.IconXs
                  dataActive=voiceEnabled
                  ariaPressed=voiceEnabled
                  dataSlot="tooltip-trigger"
                  className="data-[active=true]:bg-orange-100 data-[active=true]:text-orange-700 dark:data-[active=true]:bg-orange-800 dark:data-[active=true]:text-orange-100"
                />
              }>
              <Icons.AudioLines />
            </Tooltip.Trigger>
            <Tooltip.Content> {"Voice Mode"->React.string} </Tooltip.Content>
          </Tooltip>
        </InputGroup.Addon>
      </InputGroup>
    </ButtonGroup>
  </ButtonGroup>
}
