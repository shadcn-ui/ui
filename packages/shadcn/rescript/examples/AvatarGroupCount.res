@react.component
let make = () =>
  <Avatar.Group className="grayscale">
    <Avatar>
      <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
      <Avatar.Fallback> {"CN"->React.string} </Avatar.Fallback>
    </Avatar>
    <Avatar>
      <Avatar.Image src="https://github.com/maxleiter.png" alt="@maxleiter" />
      <Avatar.Fallback> {"LR"->React.string} </Avatar.Fallback>
    </Avatar>
    <Avatar>
      <Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
      <Avatar.Fallback> {"ER"->React.string} </Avatar.Fallback>
    </Avatar>
    <Avatar.GroupCount> {"+3"->React.string} </Avatar.GroupCount>
  </Avatar.Group>
