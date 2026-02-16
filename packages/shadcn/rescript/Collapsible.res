open BaseUi.Types

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) =>
  <BaseUi.Collapsible.Root {...props} dataSlot="collapsible" />

module Trigger = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Collapsible.Trigger {...props} dataSlot="collapsible-trigger" />
}

module Content = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Collapsible.Panel {...props} dataSlot="collapsible-content" />
}
