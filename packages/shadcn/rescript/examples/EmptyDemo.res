module TablerIcons = {
  type props = {className?: string}

  module FolderCode = {
    @module("@tabler/icons-react")
    external make: React.component<props> = "IconFolderCode"
  }
}

@react.component
let make = () =>
  <Empty>
    <Empty.Header>
      <Empty.Media variant=Empty.Variant.Icon>
        <TablerIcons.FolderCode />
      </Empty.Media>
      <Empty.Title> {"No Projects Yet"->React.string} </Empty.Title>
      <Empty.Description>
        {"You haven't created any projects yet. Get started by creating your first project."->React.string}
      </Empty.Description>
    </Empty.Header>
    <Empty.Content className="flex-row justify-center gap-2">
      <Button> {"Create Project"->React.string} </Button>
      <Button variant=Button.Variant.Outline> {"Import Project"->React.string} </Button>
    </Empty.Content>
    <Button
      variant=Button.Variant.Link
      render={<a href="#" />}
      className="text-muted-foreground"
      size=Button.Size.Sm
      nativeButton={false}
    >
      {"Learn More "->React.string}
      <Icons.ArrowUpRight />
    </Button>
  </Empty>
