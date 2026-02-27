@react.component
let make = () =>
  <Button nativeButton={false} render={<a href="#" />}>
    {"Login"->React.string}
  </Button>
