@react.component
let make = () =>
  <div className="flex flex-row flex-wrap items-center gap-6 md:gap-12">
    <Avatar>
      <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" className="grayscale" />
      <Avatar.Fallback>{"CN"->React.string}</Avatar.Fallback>
    </Avatar>
    <Avatar>
      <Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
      <Avatar.Fallback>{"ER"->React.string}</Avatar.Fallback>
      <Avatar.Badge className="bg-green-600 dark:bg-green-800">{React.null}</Avatar.Badge>
    </Avatar>
    <Avatar.Group className="grayscale">
      <Avatar>
        <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
        <Avatar.Fallback>{"CN"->React.string}</Avatar.Fallback>
      </Avatar>
      <Avatar>
        <Avatar.Image src="https://github.com/maxleiter.png" alt="@maxleiter" />
        <Avatar.Fallback>{"LR"->React.string}</Avatar.Fallback>
      </Avatar>
      <Avatar>
        <Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
        <Avatar.Fallback>{"ER"->React.string}</Avatar.Fallback>
      </Avatar>
      <Avatar.GroupCount>{"+3"->React.string}</Avatar.GroupCount>
    </Avatar.Group>
  </div>
