module Root = {
  @module("@base-ui/react/radio")
  @scope("Radio")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Root"
}

module Indicator = {
  @module("@base-ui/react/radio")
  @scope("Radio")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Indicator"
}
