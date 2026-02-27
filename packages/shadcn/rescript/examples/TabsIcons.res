module LucideIcons = {
  type props = {className?: string, @as("data-icon") dataIcon?: string}

  module AppWindow = {
    @module("lucide-react")
    external make: React.component<props> = "AppWindowIcon"
  }

  module Code = {
    @module("lucide-react")
    external make: React.component<props> = "CodeIcon"
  }
}

@react.component
let make = () =>
  <Tabs defaultValue="preview">
    <Tabs.List>
      <Tabs.Trigger value="preview">
        <LucideIcons.AppWindow />
        {"Preview"->React.string}
      </Tabs.Trigger>
      <Tabs.Trigger value="code">
        <LucideIcons.Code />
        {"Code"->React.string}
      </Tabs.Trigger>
    </Tabs.List>
  </Tabs>
