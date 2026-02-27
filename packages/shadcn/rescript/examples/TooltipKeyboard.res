module LucideIcons = {
  type props = {className?: string, @as("data-icon") dataIcon?: string}

  module Save = {
    @module("lucide-react")
    external make: React.component<props> = "SaveIcon"
  }
}

@react.component
let make = () => {
  let triggerClassName =
    Button.buttonVariants(~variant=Button.Variant.Outline, ~size=Button.Size.IconSm)->Button.twMerge

  <Tooltip>
    <Tooltip.Trigger render={<button className=triggerClassName type_="button" tabIndex=0 />}>
      <LucideIcons.Save />
    </Tooltip.Trigger>
    <Tooltip.Content className="pr-1.5">
      <div className="flex items-center gap-2">
        {"Save Changes"->React.string}
        <Kbd> {"S"->React.string} </Kbd>
      </div>
    </Tooltip.Content>
  </Tooltip>
}
