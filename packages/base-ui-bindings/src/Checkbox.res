module Root = {
  @module("@base-ui/react/checkbox")
  @scope("Checkbox")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Root"
}

module Indicator = {
  @module("@base-ui/react/checkbox")
  @scope("Checkbox")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Indicator"
}
