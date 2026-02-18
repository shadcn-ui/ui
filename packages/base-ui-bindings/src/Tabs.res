module Root = {
  @module("@base-ui/react/tabs") @scope("Tabs")
  external make: React.component<Types.props<'value, 'checked>> = "Root"
}

module List = {
  @module("@base-ui/react/tabs") @scope("Tabs")
  external make: React.component<Types.props<'value, 'checked>> = "List"
}

module Tab = {
  @module("@base-ui/react/tabs") @scope("Tabs")
  external make: React.component<Types.props<'value, 'checked>> = "Tab"
}

module Panel = {
  @module("@base-ui/react/tabs") @scope("Tabs")
  external make: React.component<Types.props<'value, 'checked>> = "Panel"
}

module Indicator = {
  @module("@base-ui/react/tabs") @scope("Tabs")
  external make: React.component<Types.props<'value, 'checked>> = "Indicator"
}
