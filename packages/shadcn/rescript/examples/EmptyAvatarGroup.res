@react.component
let make = () =>
  <Empty>
    <Empty.Header>
      <Empty.Media>
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
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
        </div>
      </Empty.Media>
      <Empty.Title> {"No Team Members"->React.string} </Empty.Title>
      <Empty.Description>
        {"Invite your team to collaborate on this project."->React.string}
      </Empty.Description>
    </Empty.Header>
    <Empty.Content>
      <Button size=Button.Size.Sm>
        <Icons.Plus />
        {"Invite Members"->React.string}
      </Button>
    </Empty.Content>
  </Empty>
