module Root = {
  @module("@base-ui/react/checkbox")
  @scope("Checkbox")
  external make: React.component<Types.props<'value, 'checked>> = "Root"
}

module Indicator = {
  @module("@base-ui/react/checkbox")
  @scope("Checkbox")
  external make: React.component<Types.props<'value, 'checked>> = "Indicator"
}
