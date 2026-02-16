module Root = {
  @module("@base-ui/react/tabs")
  @scope("Tabs")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Root"
}

module List = {
  @module("@base-ui/react/tabs")
  @scope("Tabs")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "List"
}

module Tab = {
  @module("@base-ui/react/tabs")
  @scope("Tabs")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Tab"
}

module Panel = {
  @module("@base-ui/react/tabs")
  @scope("Tabs")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Panel"
}

module Indicator = {
  @module("@base-ui/react/tabs")
  @scope("Tabs")
  external make: React.component<Types.propsWithOptionalChildren<'value, 'checked>> = "Indicator"
}
