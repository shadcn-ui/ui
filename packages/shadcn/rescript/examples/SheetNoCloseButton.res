@react.component
let make = () =>
  <Sheet>
    <Sheet.Trigger
      className={Button.twMerge(Button.buttonVariants(~variant=Button.Variant.Outline))}
      type_="button"
    >
      {"Open Sheet"->React.string}
    </Sheet.Trigger>
    <Sheet.Content showCloseButton={false}>
      <Sheet.Header>
        <Sheet.Title> {"No Close Button"->React.string} </Sheet.Title>
        <Sheet.Description>
          {"This sheet doesn't have a close button in the top-right corner. Click outside to close."->React.string}
        </Sheet.Description>
      </Sheet.Header>
    </Sheet.Content>
  </Sheet>
