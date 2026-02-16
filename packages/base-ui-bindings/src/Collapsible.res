module Root = {
  @module("@base-ui/react/collapsible")
  @scope("Collapsible")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Root"
}

module Trigger = {
  @module("@base-ui/react/collapsible")
  @scope("Collapsible")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Trigger"
}

module Panel = {
  @module("@base-ui/react/collapsible")
  @scope("Collapsible")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Panel"
}
