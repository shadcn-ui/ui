@react.component
let make = () =>
  <div className="flex flex-wrap items-center gap-2 grayscale">
    <Avatar dataSize=Avatar.Size.Sm>
      <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
      <Avatar.Fallback> {"CN"->React.string} </Avatar.Fallback>
    </Avatar>
    <Avatar>
      <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
      <Avatar.Fallback> {"CN"->React.string} </Avatar.Fallback>
    </Avatar>
    <Avatar dataSize=Avatar.Size.Lg>
      <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
      <Avatar.Fallback> {"CN"->React.string} </Avatar.Fallback>
    </Avatar>
  </div>
