@react.component
let make = () =>
  <Avatar>
    <Avatar.Image
      src="https://github.com/shadcn.png"
      alt="@shadcn"
      className="grayscale"
      renderBeforeHydration={true}
    />
    <Avatar.Fallback> {"CN"->React.string} </Avatar.Fallback>
  </Avatar>
