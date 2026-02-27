@react.component
let make = () =>
  <Avatar className="grayscale">
    <Avatar.Image
      src="https://github.com/pranathip.png"
      alt="@pranathip"
      renderBeforeHydration={true}
    />
    <Avatar.Fallback> {"PP"->React.string} </Avatar.Fallback>
    <Avatar.Badge>
      <Icons.Plus />
    </Avatar.Badge>
  </Avatar>
