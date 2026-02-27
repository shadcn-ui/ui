@react.component
let make = () =>
  <div className="grid w-full gap-2">
    <Textarea placeholder="Type your message here."> {React.null} </Textarea>
    <Button> {"Send message"->React.string} </Button>
  </div>
