module Root = {
  @module("@base-ui/react/accordion")
  @scope("Accordion")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Root"
}

module Item = {
  @module("@base-ui/react/accordion")
  @scope("Accordion")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Item"
}

module Header = {
  @module("@base-ui/react/accordion")
  @scope("Accordion")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Header"
}

module Trigger = {
  @module("@base-ui/react/accordion")
  @scope("Accordion")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Trigger"
}

module Panel = {
  @module("@base-ui/react/accordion")
  @scope("Accordion")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Panel"
}
