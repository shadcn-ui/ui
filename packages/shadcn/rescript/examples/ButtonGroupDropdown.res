@@directive("'use client'")

module LocalIcons = {
  type props = {
    className?: string,
    @as("data-icon") dataIcon?: string,
  }

  module VolumeOff = {
    @module("lucide-react")
    external make: React.component<props> = "VolumeOffIcon"
  }

  module UserRoundX = {
    @module("lucide-react")
    external make: React.component<props> = "UserRoundXIcon"
  }

  module Share = {
    @module("lucide-react")
    external make: React.component<props> = "ShareIcon"
  }

  module Copy = {
    @module("lucide-react")
    external make: React.component<props> = "CopyIcon"
  }

  module Trash = {
    @module("lucide-react")
    external make: React.component<props> = "TrashIcon"
  }
}

@react.component
let make = () => {
  let triggerClassName = `${Button.buttonVariants(~variant=Button.Variant.Outline)} !pl-2`

  <ButtonGroup>
    <Button variant=Button.Variant.Outline> {"Follow"->React.string} </Button>
    <DropdownMenu>
      <DropdownMenu.Trigger className=triggerClassName type_="button">
        <Icons.ChevronDown />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align=BaseUi.Types.Align.End className="w-44">
        <DropdownMenu.Group>
          <DropdownMenu.Item>
            <LocalIcons.VolumeOff />
            {"Mute Conversation"->React.string}
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <Icons.Check />
            {"Mark as Read"->React.string}
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <Icons.AlertTriangle />
            {"Report Conversation"->React.string}
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <LocalIcons.UserRoundX />
            {"Block User"->React.string}
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <LocalIcons.Share />
            {"Share Conversation"->React.string}
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <LocalIcons.Copy />
            {"Copy Conversation"->React.string}
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator> {React.null} </DropdownMenu.Separator>
        <DropdownMenu.Group>
          <DropdownMenu.Item variant=DropdownMenu.Variant.Destructive>
            <LocalIcons.Trash />
            {"Delete Conversation"->React.string}
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  </ButtonGroup>
}
