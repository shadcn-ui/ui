module Root = {
  @module("@base-ui/react/collapsible")
  @scope("Collapsible")
  external make: React.component<Types.props<'value, 'checked>> = "Root"
}

module Trigger = {
  @module("@base-ui/react/collapsible")
  @scope("Collapsible")
  external make: React.component<Types.props<'value, 'checked>> = "Trigger"
}

module Panel = {
  @module("@base-ui/react/collapsible")
  @scope("Collapsible")
  external make: React.component<Types.props<'value, 'checked>> = "Panel"
}
